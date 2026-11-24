import "server-only";
import { randomBytes } from "node:crypto";
import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  certificates,
  courseModules,
  enrollments,
  lessonProgress,
  lessons,
  pointsLedger,
  submissions,
  userBadges,
} from "@/db/schema";

export const POINTS = { lesson: 10, submission: 20, approved: 50 } as const;

export const BADGES = {
  "first-lesson": { name: "First lesson", description: "Completed your first lesson" },
  "quick-starter": { name: "Quick starter", description: "Completed 3 lessons" },
  "project-submitted": { name: "Project submitted", description: "Submitted your first project" },
  "course-complete": { name: "Course complete", description: "Earned your first certificate" },
} as const;
export type BadgeKey = keyof typeof BADGES;

export async function awardPoints(userId: string, amount: number, reason: string, refId: string) {
  // Unique (user, reason, ref) index makes this idempotent.
  await db.insert(pointsLedger).values({ userId, amount, reason, refId }).onConflictDoNothing();
}

export async function awardBadge(userId: string, badgeKey: BadgeKey) {
  await db.insert(userBadges).values({ userId, badgeKey }).onConflictDoNothing();
}

export async function lessonCountForCourse(courseId: string) {
  const [row] = await db
    .select({ n: count() })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(eq(courseModules.courseId, courseId));
  return row?.n ?? 0;
}

export async function completedLessonCount(userId: string, courseId: string) {
  const [row] = await db
    .select({ n: count() })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(and(eq(lessonProgress.userId, userId), eq(courseModules.courseId, courseId)));
  return row?.n ?? 0;
}

function certificateCode() {
  // e.g. JTN-7K3M-Q9XP — unambiguous characters only
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  return `JTN-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

/**
 * Completion rule: every lesson finished AND the course's practical project approved by a mentor.
 * Issues the certificate once (unique user+course index).
 */
export async function maybeIssueCertificate(userId: string, courseId: string) {
  const [total, done] = await Promise.all([lessonCountForCourse(courseId), completedLessonCount(userId, courseId)]);
  if (total === 0 || done < total) return null;

  const [approved] = await db
    .select({ id: submissions.id })
    .from(submissions)
    .where(and(eq(submissions.userId, userId), eq(submissions.courseId, courseId), eq(submissions.status, "APPROVED")))
    .limit(1);
  if (!approved) return null;

  const [cert] = await db
    .insert(certificates)
    .values({ code: certificateCode(), userId, courseId })
    .onConflictDoNothing()
    .returning();
  await db
    .update(enrollments)
    .set({ completedAt: sql`coalesce(${enrollments.completedAt}, now())` })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  if (cert) await awardBadge(userId, "course-complete");
  return cert ?? null;
}
