import "server-only";
import { asc, count, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  auditLog,
  challenges,
  courseModules,
  courses,
  experts,
  inquiries,
  innovationItems,
  issueReports,
  lessons,
  mentorAssignments,
  partners,
  resources,
  users,
} from "@/db/schema";

export async function getOverview() {
  const [[c], [r], [pendingCourses], [pendingResources], [pendingExperts], [pendingPartners], [newInq], [newIssues]] =
    await Promise.all([
      db.select({ n: count() }).from(courses),
      db.select({ n: count() }).from(resources),
      db.select({ n: count() }).from(courses).where(eq(courses.status, "IN_REVIEW")),
      db.select({ n: count() }).from(resources).where(eq(resources.status, "IN_REVIEW")),
      db.select({ n: count() }).from(experts).where(eq(experts.status, "PENDING")),
      db.select({ n: count() }).from(partners).where(eq(partners.status, "PENDING")),
      db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "NEW")),
      db.select({ n: count() }).from(issueReports).where(eq(issueReports.status, "NEW")),
    ]);

  const owner = alias(users, "owner");
  const queue = await db
    .select({
      id: courses.id,
      kind: sql<string>`'course'`,
      title: courses.title,
      owner: owner.name,
      status: courses.status,
    })
    .from(courses)
    .leftJoin(owner, eq(owner.id, courses.ownerId))
    .where(ne(courses.status, "PUBLISHED"))
    .orderBy(desc(courses.updatedAt))
    .limit(8);
  const resQueue = await db
    .select({ id: resources.id, title: resources.title, status: resources.status, reviewedBy: resources.reviewedBy })
    .from(resources)
    .where(ne(resources.status, "PUBLISHED"))
    .orderBy(desc(resources.updatedAt))
    .limit(8);
  const recentInquiries = await db
    .select({ id: inquiries.id, type: inquiries.type, subject: inquiries.subject, createdAt: inquiries.createdAt })
    .from(inquiries)
    .where(eq(inquiries.status, "NEW"))
    .orderBy(desc(inquiries.createdAt))
    .limit(6);

  return {
    counts: {
      courses: c!.n,
      resources: r!.n,
      awaitingApproval: pendingCourses!.n + pendingResources!.n + pendingExperts!.n + pendingPartners!.n,
      newInquiries: newInq!.n + newIssues!.n,
    },
    queue,
    resQueue,
    recentInquiries,
  };
}

export async function listCourses() {
  return db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      category: courses.category,
      status: courses.status,
      updatedAt: courses.updatedAt,
      modules: sql<number>`(select count(*)::int from course_modules cm where cm.course_id = "courses"."id")`,
    })
    .from(courses)
    .orderBy(asc(courses.title));
}

export async function getCourseForEdit(id: string) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, id),
    with: {
      modules: {
        orderBy: asc(courseModules.position),
        with: { lessons: { orderBy: asc(lessons.position), columns: { id: true, title: true, slug: true } } },
      },
    },
  });
  return course ?? null;
}

export async function getLessonForEdit(id: string) {
  const [l] = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return l ?? null;
}

export async function listResources() {
  return db.select().from(resources).orderBy(asc(resources.title));
}

export async function getResourceForEdit(id: string) {
  const [r] = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return r ?? null;
}

export async function resourceOptions() {
  return db.select({ id: resources.id, title: resources.title }).from(resources).orderBy(asc(resources.title));
}

export async function listExperts() {
  return db.select().from(experts).orderBy(asc(experts.status), asc(experts.name));
}
export async function listPartners() {
  return db.select().from(partners).orderBy(asc(partners.status), asc(partners.name));
}
export async function listInnovation() {
  const [c, i] = await Promise.all([
    db.select().from(challenges).orderBy(desc(challenges.createdAt)),
    db.select().from(innovationItems).orderBy(desc(innovationItems.createdAt)),
  ]);
  return { challenges: c, items: i };
}

export async function listInquiries(status?: "NEW" | "IN_PROGRESS" | "CLOSED") {
  const q = db
    .select({
      inquiry: inquiries,
      expertName: experts.name,
      challengeTitle: challenges.title,
    })
    .from(inquiries)
    .leftJoin(experts, eq(experts.id, inquiries.expertId))
    .leftJoin(challenges, eq(challenges.id, inquiries.challengeId))
    .orderBy(desc(inquiries.createdAt))
    .limit(200);
  return status ? q.where(eq(inquiries.status, status)) : q;
}

export async function listIssues() {
  return db.select().from(issueReports).orderBy(asc(issueReports.status), desc(issueReports.createdAt)).limit(200);
}

export async function listUsers() {
  const all = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.role), asc(users.name));
  const assignments = all.length
    ? await db
        .select()
        .from(mentorAssignments)
        .where(inArray(mentorAssignments.studentId, all.map((u) => u.id)))
    : [];
  const mentorOf = new Map(assignments.map((a) => [a.studentId, a.mentorId]));
  return all.map((u) => ({ ...u, mentorId: mentorOf.get(u.id) ?? null }));
}

export async function recentAudit(limit = 20) {
  return db
    .select({ id: auditLog.id, action: auditLog.action, entity: auditLog.entity, createdAt: auditLog.createdAt, actor: users.name })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}
