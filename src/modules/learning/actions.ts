"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { courseModules, courses, enrollments, lessonProgress, lessons, submissions, users } from "@/db/schema";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { awardBadge, awardPoints, maybeIssueCertificate, POINTS } from "./engine";

async function publishedCourse(courseId: string) {
  const [c] = await db
    .select({ id: courses.id, slug: courses.slug })
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.status, "PUBLISHED")))
    .limit(1);
  return c ?? null;
}

export async function enrolAction(formData: FormData) {
  const courseId = z.uuid().parse(formData.get("courseId"));
  const course = await publishedCourse(courseId);
  if (!course) redirect("/courses");

  const user = await getCurrentUser();
  if (!user) redirect(`/register?next=${encodeURIComponent(`/courses/${course.slug}`)}`);

  await db.insert(enrollments).values({ userId: user.id, courseId }).onConflictDoNothing();
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard");
}

export async function completeLessonAction(formData: FormData) {
  const lessonId = z.uuid().parse(formData.get("lessonId"));
  const user = await requireUser("learn");

  const [row] = await db
    .select({ courseId: courseModules.courseId, slug: courses.slug })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(and(eq(lessons.id, lessonId), eq(courses.status, "PUBLISHED")))
    .limit(1);
  if (!row) redirect("/courses");

  // Completing a lesson enrols you automatically.
  await db.insert(enrollments).values({ userId: user.id, courseId: row.courseId }).onConflictDoNothing();
  await db.insert(lessonProgress).values({ userId: user.id, lessonId }).onConflictDoNothing();
  await awardPoints(user.id, POINTS.lesson, "lesson", lessonId);

  const [{ n }] = (await db.select({ n: count() }).from(lessonProgress).where(eq(lessonProgress.userId, user.id))) as [
    { n: number },
  ];
  if (n >= 1) await awardBadge(user.id, "first-lesson");
  if (n >= 3) await awardBadge(user.id, "quick-starter");

  await maybeIssueCertificate(user.id, row.courseId);

  revalidatePath(`/courses/${row.slug}`, "layout");
  revalidatePath("/dashboard", "layout");
  const next = formData.get("next");
  if (typeof next === "string" && next.startsWith(`/courses/${row.slug}`)) redirect(next);
}

const submissionSchema = z.object({
  courseId: z.uuid(),
  type: z.enum(["LIVE_LINK", "GITHUB", "DRIVE", "DESIGN", "SCREENSHOT", "FILE"]),
  url: z
    .url({ protocol: /^https?$/, message: "Enter a full link starting with https://" })
    .max(500),
  description: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
});

export type SubmitState = { ok?: boolean; errors?: Partial<Record<"url" | "description" | "form", string>> };

export async function submitProjectAction(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const user = await requireUser("learn", "/dashboard/submissions");
  const parsed = submissionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: SubmitState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "url" | "description";
      errors[key === "url" || key === "description" ? key : "form"] ??= issue.message;
    }
    return { errors };
  }
  const { courseId, type, url, description } = parsed.data;

  const [enrolled] = await db
    .select({ c: enrollments.courseId })
    .from(enrollments)
    .where(and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)))
    .limit(1);
  if (!enrolled) return { errors: { form: "Enrol in this course before submitting a project." } };

  const [sub] = await db
    .insert(submissions)
    .values({ userId: user.id, courseId, type, url, description })
    .returning({ id: submissions.id });
  await awardPoints(user.id, POINTS.submission, "submission", courseId);
  await awardBadge(user.id, "project-submitted");

  revalidatePath("/dashboard", "layout");
  revalidatePath("/mentor", "layout");
  return { ok: !!sub };
}

export async function togglePrivateProgressAction() {
  const user = await requireUser();
  await db.update(users).set({ privateProgress: !user.privateProgress }).where(eq(users.id, user.id));
  revalidatePath("/dashboard", "layout");
}
