import "server-only";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { courses, mentorAssignments, submissions, users } from "@/db/schema";
import type { SessionUser } from "@/lib/auth";

/** Students a mentor may review. Admins may review everyone (returns null = no restriction). */
export async function reviewableStudentIds(user: SessionUser): Promise<string[] | null> {
  if (user.role === "ADMIN") return null;
  const rows = await db
    .select({ id: mentorAssignments.studentId })
    .from(mentorAssignments)
    .where(eq(mentorAssignments.mentorId, user.id));
  return rows.map((r) => r.id);
}

export async function getAssignedStudents(user: SessionUser) {
  const ids = await reviewableStudentIds(user);
  if (ids && ids.length === 0) return [];
  return db
    .select({
      id: users.id,
      name: users.name,
      latestStatus: sql<
        "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED" | null
      >`(select s.status from submissions s where s.user_id = "users"."id" order by s.created_at desc limit 1)`,
    })
    .from(users)
    .where(ids ? inArray(users.id, ids) : eq(users.role, "STUDENT"))
    .orderBy(users.name);
}

const student = alias(users, "student");

export async function getReviewQueue(user: SessionUser) {
  const ids = await reviewableStudentIds(user);
  if (ids && ids.length === 0) return [];
  return db
    .select({
      id: submissions.id,
      studentName: student.name,
      courseTitle: courses.title,
      type: submissions.type,
      status: submissions.status,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(student, eq(student.id, submissions.userId))
    .innerJoin(courses, eq(courses.id, submissions.courseId))
    .where(ids ? inArray(submissions.userId, ids) : undefined)
    .orderBy(sql`case when ${submissions.status} = 'SUBMITTED' then 0 else 1 end`, desc(submissions.createdAt))
    .limit(100);
}

export async function getSubmissionForReview(user: SessionUser, id: string) {
  const ids = await reviewableStudentIds(user);
  const [row] = await db
    .select({
      id: submissions.id,
      userId: submissions.userId,
      courseId: submissions.courseId,
      studentName: student.name,
      courseTitle: courses.title,
      type: submissions.type,
      url: submissions.url,
      description: submissions.description,
      status: submissions.status,
      feedback: submissions.feedback,
      createdAt: submissions.createdAt,
    })
    .from(submissions)
    .innerJoin(student, eq(student.id, submissions.userId))
    .innerJoin(courses, eq(courses.id, submissions.courseId))
    .where(and(eq(submissions.id, id), ids ? inArray(submissions.userId, ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]) : undefined))
    .limit(1);
  return row ?? null;
}
