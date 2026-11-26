import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { appState, assistantUsage } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { AssistantUnavailableError, assistantConfigured, streamReply } from "@/lib/assistant/provider";
import { trimConversation, tutorSystemPrompt, type LessonContext } from "@/lib/assistant/tutor";
import { getCourse, getLesson } from "@/modules/courses/queries";

/** Questions per learner per day (UTC). Override with ASSISTANT_DAILY_LIMIT. */
const DAILY_LIMIT = Number(process.env.ASSISTANT_DAILY_LIMIT ?? 40);

const bodySchema = z.object({
  courseSlug: z.string().regex(/^[a-z0-9-]{1,80}$/),
  lessonSlug: z
    .string()
    .regex(/^[a-z0-9-]{1,80}$/)
    .optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) }))
    .min(1)
    .max(20)
    .refine((m) => m.at(-1)?.role === "user", "The last message must be the learner's question"),
});

const json = (status: number, error: string) =>
  Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** Shown when Grandpa AI's own spending allowance or rate limit is used up. */
const RESTING =
  "Grandpa has answered a lot of questions today and is resting. Please try again later, or ask your mentor.";

/**
 * While the provider is out of allowance we pause Ask Grandpa (stored in app_state, shared by all
 * server instances) instead of calling it for every question.
 */
const PAUSE_KEY = "assistant_paused_until";
const DEFAULT_PAUSE_SEC = 30 * 60;
const MAX_PAUSE_SEC = 6 * 60 * 60;

async function pausedNow(): Promise<boolean> {
  const [row] = await db
    .select({ paused: sql<boolean>`${appState.value}::timestamptz > now()` })
    .from(appState)
    .where(sql`${appState.key} = ${PAUSE_KEY}`)
    .limit(1);
  return row?.paused ?? false;
}

async function pauseFor(seconds: number) {
  const secs = Math.min(MAX_PAUSE_SEC, Math.max(60, Math.round(seconds)));
  const until = sql`to_char((now() + make_interval(secs => ${secs})) at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
  await db
    .insert(appState)
    .values({ key: PAUSE_KEY, value: until })
    .onConflictDoUpdate({ target: appState.key, set: { value: until } });
}

export async function POST(request: Request) {
  if (!assistantConfigured()) return json(503, "Ask Grandpa is not available yet.");

  const user = await getCurrentUser();
  if (!user) return json(401, "Please log in to ask Grandpa.");

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json(400, "Please type a shorter question.");
  const { courseSlug, lessonSlug, messages } = parsed.data;

  const course = await getCourse(courseSlug);
  if (!course) return json(404, "Course not found.");
  const ctx: LessonContext = {
    courseTitle: course.title,
    courseSummary: course.summary,
    outline: course.modules.map((m) => m.title),
  };
  if (lessonSlug) {
    const row = await getLesson(courseSlug, lessonSlug);
    if (!row) return json(404, "Lesson not found.");
    Object.assign(ctx, {
      lessonTitle: row.lesson.title,
      moduleTitle: row.moduleTitle,
      lessonBody: row.lesson.body,
      checklist: row.lesson.checklist,
    });
  }

  if (await pausedNow()) return json(503, RESTING);

  // Count the question first (atomic upsert), then refuse if over today's limit.
  const [usage] = await db
    .insert(assistantUsage)
    .values({ userId: user.id, day: sql`to_char(now() at time zone 'utc', 'YYYY-MM-DD')`, count: 1 })
    .onConflictDoUpdate({
      target: [assistantUsage.userId, assistantUsage.day],
      set: { count: sql`${assistantUsage.count} + 1` },
    })
    .returning({ count: assistantUsage.count });
  if ((usage?.count ?? 0) > DAILY_LIMIT) {
    return json(429, `You have asked ${DAILY_LIMIT} questions today. Grandpa needs a rest. Please try again tomorrow, or ask your mentor.`);
  }

  try {
    const stream = await streamReply([{ role: "system", content: tutorSystemPrompt(ctx) }, ...trimConversation(messages)], request.signal);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Questions-Left": String(Math.max(0, DAILY_LIMIT - (usage?.count ?? 0))),
      },
    });
  } catch (e) {
    if (e instanceof AssistantUnavailableError) {
      console.error("[assistant]", e.message);
      // Don't charge the learner a question the provider failed to answer.
      await db
        .update(assistantUsage)
        .set({ count: sql`greatest(${assistantUsage.count} - 1, 0)` })
        .where(sql`${assistantUsage.userId} = ${user.id} and ${assistantUsage.day} = to_char(now() at time zone 'utc', 'YYYY-MM-DD')`);
      if (e.outOfAllowance) {
        await pauseFor(e.retryAfterSec ?? DEFAULT_PAUSE_SEC);
        return json(503, RESTING);
      }
      return json(502, "Grandpa can't answer right now. Please try again in a minute.");
    }
    throw e;
  }
}
