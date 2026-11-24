import "server-only";
import { and, asc, desc, eq, inArray, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import {
  certificates,
  courseModules,
  courses,
  enrollments,
  lessonProgress,
  lessons,
  pointsLedger,
  submissions,
  userBadges,
  users,
} from "@/db/schema";

/** Per-user state for one course page. Never cached across users. */
export async function getCourseProgress(userId: string, courseId: string) {
  const [enrolment] = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  const done = await db
    .select({ lessonId: lessonProgress.lessonId })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .where(and(eq(lessonProgress.userId, userId), eq(courseModules.courseId, courseId)));
  const [cert] = await db
    .select({ code: certificates.code })
    .from(certificates)
    .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
    .limit(1);
  return { enrolled: !!enrolment, completedLessonIds: new Set(done.map((d) => d.lessonId)), certificateCode: cert?.code };
}

export async function getDashboard(userId: string) {
  const myCourses = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      completedAt: enrollments.completedAt,
      total: sql<number>`(select count(*)::int from lessons l join course_modules m on m.id = l.module_id where m.course_id = "courses"."id")`,
      done: sql<number>`(select count(*)::int from lesson_progress p join lessons l on l.id = p.lesson_id join course_modules m on m.id = l.module_id where m.course_id = "courses"."id" and p.user_id = ${userId})`,
    })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrolledAt));

  // Next lesson for each course: first lesson in order not yet completed.
  const nextLessons = new Map<string, { slug: string; title: string; modulePosition: number }>();
  if (myCourses.length) {
    const rows = await db
      .select({
        courseId: courseModules.courseId,
        slug: lessons.slug,
        title: lessons.title,
        modulePosition: courseModules.position,
        done: sql<boolean>`exists (select 1 from lesson_progress p where p.lesson_id = "lessons"."id" and p.user_id = ${userId})`,
      })
      .from(lessons)
      .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
      .where(inArray(courseModules.courseId, myCourses.map((c) => c.id)))
      .orderBy(asc(courseModules.position), asc(lessons.position));
    for (const r of rows) if (!r.done && !nextLessons.has(r.courseId)) nextLessons.set(r.courseId, r);
  }

  const [pointsRow] = await db
    .select({ total: sum(pointsLedger.amount) })
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, userId));
  const badges = await db.select().from(userBadges).where(eq(userBadges.userId, userId)).orderBy(asc(userBadges.awardedAt));

  return {
    courses: myCourses.map((c) => ({ ...c, next: nextLessons.get(c.id) ?? null })),
    points: Number(pointsRow?.total ?? 0),
    badges,
  };
}

/** Class leaderboard — excludes learners who chose private progress mode. */
export async function getLeaderboard(limit = 5) {
  return db
    .select({ id: users.id, name: users.name, points: sql<number>`coalesce(sum(${pointsLedger.amount}), 0)::int` })
    .from(users)
    .leftJoin(pointsLedger, eq(pointsLedger.userId, users.id))
    .where(and(eq(users.privateProgress, false), eq(users.role, "STUDENT")))
    .groupBy(users.id)
    .orderBy(desc(sql`coalesce(sum(${pointsLedger.amount}), 0)`))
    .limit(limit);
}

export async function getMySubmissions(userId: string) {
  return db
    .select({
      id: submissions.id,
      courseTitle: courses.title,
      type: submissions.type,
      url: submissions.url,
      description: submissions.description,
      status: submissions.status,
      feedback: submissions.feedback,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(courses, eq(courses.id, submissions.courseId))
    .where(eq(submissions.userId, userId))
    .orderBy(desc(submissions.createdAt));
}

export async function getEnrolledCourses(userId: string) {
  return db
    .select({ id: courses.id, title: courses.title })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.userId, userId))
    .orderBy(asc(courses.title));
}

export async function getMyCertificates(userId: string) {
  return db
    .select({ code: certificates.code, issuedAt: certificates.issuedAt, courseTitle: courses.title })
    .from(certificates)
    .innerJoin(courses, eq(courses.id, certificates.courseId))
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));
}

export async function getCertificate(code: string) {
  const [c] = await db
    .select({
      code: certificates.code,
      issuedAt: certificates.issuedAt,
      name: users.name,
      courseTitle: courses.title,
      courseSlug: courses.slug,
    })
    .from(certificates)
    .innerJoin(users, eq(users.id, certificates.userId))
    .innerJoin(courses, eq(courses.id, certificates.courseId))
    .where(eq(certificates.code, code))
    .limit(1);
  return c ?? null;
}
