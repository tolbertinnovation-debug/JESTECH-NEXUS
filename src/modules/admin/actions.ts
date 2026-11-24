"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, max } from "drizzle-orm";
import { z } from "zod";
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
  type Role,
} from "@/db/schema";
import { requireUser, type SessionUser } from "@/lib/auth";
import { can, type Action } from "@/lib/rbac";

export type ActionState = { ok?: boolean; message?: string; errors?: string[] };

/* -------------------------------------------------------------- helpers */

async function guard(action: Action) {
  return requireUser(action);
}

async function audit(actor: SessionUser, action: string, entity: string, entityId?: string, detail?: unknown) {
  await db.insert(auditLog).values({ actorId: actor.id, action, entity, entityId, detail: detail ?? null });
}

function fail(error: z.ZodError): ActionState {
  return { errors: error.issues.map((i) => `${i.path.join(".") || "Form"}: ${i.message}`) };
}

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase letters, numbers and hyphens");
const optionalText = (n: number) => z.string().trim().max(n).optional().transform((v) => (v ? v : null));
const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean());
const lines = z.string().transform((s) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean),
);
const csv = z.string().transform((s) =>
  s
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean),
);

function isUniqueViolation(e: unknown) {
  return typeof e === "object" && e !== null && "cause" in e && (e as { cause?: { code?: string } }).cause?.code === "23505";
}

/* -------------------------------------------------------------- courses */

const courseSchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  slug,
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().min(10).max(600),
  audience: z.string().trim().min(10).max(600),
  category: z.enum(["Technology", "Agriculture", "Education", "Entrepreneurship"]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  format: z.enum(["ONLINE", "HYBRID", "OFFLINE_GUIDE"]),
  icon: z.string().trim().max(20).default("book"),
  outcomes: z.string().trim().max(1000).default(""),
  reviewNote: optionalText(400),
  reviewedBy: optionalText(160),
  guideResourceId: z.uuid().optional().or(z.literal("")).transform((v) => v || null),
  isPilot: checkbox,
  isFeatured: checkbox,
});

export async function saveCourseAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("edit_content");
  const parsed = courseSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  let courseId = id || undefined;
  try {
    if (courseId) {
      await db.update(courses).set(data).where(eq(courses.id, courseId));
    } else {
      const [row] = await db.insert(courses).values({ ...data, ownerId: user.id }).returning({ id: courses.id });
      courseId = row!.id;
    }
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: ["Slug: another course already uses this web address"] };
    throw e;
  }
  await audit(user, id ? "course.update" : "course.create", "course", courseId);
  updateTag("courses");
  if (!id) redirect(`/admin/courses/${courseId}`);
  return { ok: true, message: "Course saved." };
}

const statusFlow = z.object({
  id: z.uuid(),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]),
});

/** Editors move content between Draft and In review; only admins publish or archive. */
function allowedStatus(user: SessionUser, status: string) {
  return status === "DRAFT" || status === "IN_REVIEW" || can(user.role, "publish_content");
}

export async function setCourseStatusAction(fd: FormData) {
  const user = await guard("edit_content");
  const { id, status } = statusFlow.parse(Object.fromEntries(fd));
  if (!allowedStatus(user, status)) return;
  await db
    .update(courses)
    .set({ status, publishedAt: status === "PUBLISHED" ? new Date() : undefined })
    .where(eq(courses.id, id));
  await audit(user, `course.status.${status.toLowerCase()}`, "course", id);
  updateTag("courses");
  revalidatePath("/admin", "layout");
}

export async function addModuleAction(fd: FormData) {
  const user = await guard("edit_content");
  const { courseId, title } = z
    .object({ courseId: z.uuid(), title: z.string().trim().min(2).max(160) })
    .parse(Object.fromEntries(fd));
  const [{ pos }] = (await db
    .select({ pos: max(courseModules.position) })
    .from(courseModules)
    .where(eq(courseModules.courseId, courseId))) as [{ pos: number | null }];
  await db.insert(courseModules).values({ courseId, title, position: (pos ?? 0) + 1 });
  await audit(user, "module.create", "course", courseId, { title });
  updateTag("courses");
  revalidatePath(`/admin/courses/${courseId}`);
}

export async function deleteModuleAction(fd: FormData) {
  const user = await guard("edit_content");
  const { id, courseId } = z.object({ id: z.uuid(), courseId: z.uuid() }).parse(Object.fromEntries(fd));
  await db.delete(courseModules).where(and(eq(courseModules.id, id), eq(courseModules.courseId, courseId)));
  await audit(user, "module.delete", "course", courseId, { moduleId: id });
  updateTag("courses");
  revalidatePath(`/admin/courses/${courseId}`);
}

const lessonSchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  courseId: z.uuid(),
  moduleId: z.uuid(),
  slug,
  title: z.string().trim().min(2).max(160),
  summary: z.string().trim().max(400).default(""),
  body: z.string().max(20000).default(""),
  checklist: lines,
  estMinutes: z.coerce.number().int().min(1).max(240).default(10),
});

export async function saveLessonAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("edit_content");
  const parsed = lessonSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  const { id, courseId, ...data } = parsed.data;
  let lessonId = id || undefined;
  if (lessonId) {
    await db.update(lessons).set(data).where(eq(lessons.id, lessonId));
  } else {
    const [{ pos }] = (await db
      .select({ pos: max(lessons.position) })
      .from(lessons)
      .where(eq(lessons.moduleId, data.moduleId))) as [{ pos: number | null }];
    const [row] = await db
      .insert(lessons)
      .values({ ...data, position: (pos ?? 0) + 1 })
      .returning({ id: lessons.id });
    lessonId = row!.id;
  }
  await audit(user, id ? "lesson.update" : "lesson.create", "lesson", lessonId);
  updateTag("courses");
  revalidatePath(`/admin/courses/${courseId}`);
  if (!id) redirect(`/admin/courses/${courseId}/lessons/${lessonId}?saved=1`);
  return { ok: true, message: "Lesson saved." };
}

export async function deleteLessonAction(fd: FormData) {
  const user = await guard("edit_content");
  const { id, courseId } = z.object({ id: z.uuid(), courseId: z.uuid() }).parse(Object.fromEntries(fd));
  await db.delete(lessons).where(eq(lessons.id, id));
  await audit(user, "lesson.delete", "lesson", id);
  updateTag("courses");
  redirect(`/admin/courses/${courseId}`);
}

/* -------------------------------------------------------------- library */

const resourceSchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  slug,
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(1000),
  subject: z.enum(["Agriculture", "Education", "Technology", "Entrepreneurship"]),
  kind: z.string().trim().min(2).max(60),
  audiences: csv,
  format: z.enum(["PDF", "EPUB", "VIDEO", "AUDIO", "WEB"]),
  language: z.string().trim().min(2).max(40),
  source: z.string().trim().min(2).max(200),
  publishedOn: optionalText(40),
  licence: z.enum(["OWNED", "PERMISSION", "OPEN_LICENCE"], { message: "Record who owns this or how it is licensed" }),
  licenceNote: z.string().trim().min(5, "Describe the licence or permission").max(400),
  fileUrl: optionalText(500),
  sizeBytes: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().min(0).max(500_000_000).nullable()),
  readOnlineUrl: optionalText(500),
  downloadable: checkbox,
  reviewedBy: optionalText(160),
});

export async function saveResourceAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("edit_content");
  const parsed = resourceSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  for (const u of [data.fileUrl, data.readOnlineUrl]) {
    if (u && !(u.startsWith("/") || u.startsWith("https://"))) return { errors: ["File links must start with https:// or /"] };
  }
  let resourceId = id || undefined;
  try {
    if (resourceId) await db.update(resources).set(data).where(eq(resources.id, resourceId));
    else resourceId = (await db.insert(resources).values(data).returning({ id: resources.id }))[0]!.id;
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: ["Slug: another resource already uses this web address"] };
    throw e;
  }
  await audit(user, id ? "resource.update" : "resource.create", "resource", resourceId);
  updateTag("library");
  if (!id) redirect(`/admin/library/${resourceId}`);
  return { ok: true, message: "Resource saved." };
}

export async function setResourceStatusAction(fd: FormData) {
  const user = await guard("edit_content");
  const { id, status } = statusFlow.parse(Object.fromEntries(fd));
  if (!allowedStatus(user, status)) return;
  await db.update(resources).set({ status }).where(eq(resources.id, id));
  await audit(user, `resource.status.${status.toLowerCase()}`, "resource", id);
  updateTag("library");
  revalidatePath("/admin", "layout");
}

/* ---------------------------------------------------- experts & partners */

const expertSchema = z.object({
  slug,
  name: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(120),
  area: z.enum(["Software and IT", "Agriculture", "Data", "Design", "Cybersecurity", "Education"]),
  tags: csv,
  bio: z.string().trim().min(10).max(1000),
});

export async function createExpertAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("manage_listings");
  const parsed = expertSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  try {
    const [row] = await db.insert(experts).values(parsed.data).returning({ id: experts.id });
    await audit(user, "expert.create", "expert", row!.id);
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: ["Slug: already in use"] };
    throw e;
  }
  revalidatePath("/admin/experts");
  return { ok: true, message: "Expert added as Pending. Verify and approve to publish." };
}

export async function setExpertStatusAction(fd: FormData) {
  const user = await guard("manage_listings");
  const d = z
    .object({ id: z.uuid(), status: z.enum(["PENDING", "APPROVED", "HIDDEN"]), consent: checkbox, verified: checkbox })
    .parse(Object.fromEntries(fd));
  const now = new Date();
  if (d.status === "APPROVED" && !(d.consent && d.verified)) redirect("/admin/experts?error=verify");
  await db
    .update(experts)
    .set({
      status: d.status,
      ...(d.status === "APPROVED" ? { consentAt: now, verifiedAt: now } : {}),
    })
    .where(eq(experts.id, d.id));
  await audit(user, `expert.status.${d.status.toLowerCase()}`, "expert", d.id);
  updateTag("experts");
  revalidatePath("/admin/experts");
}

const partnerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.enum(["EDUCATION", "NGO", "BUSINESS", "COMMUNITY", "DEVELOPMENT"]),
  collaborationArea: z.string().trim().min(2).max(160),
  description: z.string().trim().max(600).default(""),
  website: z.url({ protocol: /^https$/ }).optional().or(z.literal("")).transform((v) => v || null),
  logoUrl: optionalText(500),
  agreementRef: optionalText(120),
});

export async function createPartnerAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("manage_listings");
  const parsed = partnerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  const [row] = await db
    .insert(partners)
    .values({ ...parsed.data, agreementDate: parsed.data.agreementRef ? new Date() : null })
    .returning({ id: partners.id });
  await audit(user, "partner.create", "partner", row!.id);
  revalidatePath("/admin/partners");
  return { ok: true, message: "Partner added as Pending." };
}

export async function setPartnerStatusAction(fd: FormData) {
  const user = await guard("manage_listings");
  const d = z
    .object({ id: z.uuid(), status: z.enum(["PENDING", "APPROVED", "HIDDEN"]), agreementRef: optionalText(120) })
    .parse(Object.fromEntries(fd));
  const [p] = await db.select().from(partners).where(eq(partners.id, d.id));
  if (!p) return;
  const agreementRef = d.agreementRef ?? p.agreementRef;
  if (d.status === "APPROVED" && !agreementRef) redirect("/admin/partners?error=agreement");
  await db
    .update(partners)
    .set({ status: d.status, agreementRef, agreementDate: agreementRef && !p.agreementDate ? new Date() : p.agreementDate })
    .where(eq(partners.id, d.id));
  await audit(user, `partner.status.${d.status.toLowerCase()}`, "partner", d.id);
  updateTag("partners");
  revalidatePath("/admin/partners");
}

/* ----------------------------------------------------------- innovation */

const challengeSchema = z.object({
  slug,
  title: z.string().trim().min(5).max(200),
  context: z.string().trim().min(10).max(2000),
  goals: z.string().trim().min(10).max(2000),
  community: optionalText(160),
});

export async function createChallengeAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("manage_listings");
  const parsed = challengeSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  try {
    const [row] = await db.insert(challenges).values(parsed.data).returning({ id: challenges.id });
    await audit(user, "challenge.create", "challenge", row!.id);
  } catch (e) {
    if (isUniqueViolation(e)) return { errors: ["Slug: already in use"] };
    throw e;
  }
  revalidatePath("/admin/innovation");
  return { ok: true, message: "Challenge created (unpublished)." };
}

export async function updateChallengeAction(fd: FormData) {
  const user = await guard("manage_listings");
  const d = z
    .object({ id: z.uuid(), published: z.enum(["true", "false"]).optional(), status: z.enum(["OPEN", "CLOSED"]).optional() })
    .parse(Object.fromEntries(fd));
  await db
    .update(challenges)
    .set({
      ...(d.published ? { published: d.published === "true" } : {}),
      ...(d.status ? { status: d.status } : {}),
    })
    .where(eq(challenges.id, d.id));
  await audit(user, "challenge.update", "challenge", d.id, d);
  updateTag("innovation");
  revalidatePath("/admin/innovation");
}

const itemSchema = z.object({
  type: z.enum(["CASE_STUDY", "PROTOTYPE"]),
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(10).max(1000),
  sources: lines,
});

export async function createInnovationItemAction(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await guard("manage_listings");
  const parsed = itemSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error);
  if (parsed.data.type === "CASE_STUDY" && parsed.data.sources.length === 0)
    return { errors: ["Sources: case studies must cite at least one source — no unsupported impact claims"] };
  const [row] = await db.insert(innovationItems).values(parsed.data).returning({ id: innovationItems.id });
  await audit(user, "innovation.create", "innovation_item", row!.id);
  revalidatePath("/admin/innovation");
  return { ok: true, message: "Saved as unverified. Verify & publish when outcomes are confirmed." };
}

export async function verifyInnovationItemAction(fd: FormData) {
  const user = await guard("manage_listings");
  const d = z.object({ id: z.uuid(), publish: z.enum(["true", "false"]) }).parse(Object.fromEntries(fd));
  const publish = d.publish === "true";
  await db
    .update(innovationItems)
    .set({ published: publish, verifiedAt: publish ? new Date() : null })
    .where(eq(innovationItems.id, d.id));
  await audit(user, publish ? "innovation.publish" : "innovation.unpublish", "innovation_item", d.id);
  updateTag("innovation");
  revalidatePath("/admin/innovation");
}

/* ----------------------------------------------- inquiries & reports */

export async function updateInquiryAction(fd: FormData) {
  const user = await guard("manage_inquiries");
  const d = z
    .object({ id: z.uuid(), status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]), notes: optionalText(2000) })
    .parse(Object.fromEntries(fd));
  await db.update(inquiries).set({ status: d.status, notes: d.notes }).where(eq(inquiries.id, d.id));
  await audit(user, `inquiry.${d.status.toLowerCase()}`, "inquiry", d.id);
  revalidatePath("/admin", "layout");
}

export async function updateIssueAction(fd: FormData) {
  const user = await guard("manage_inquiries");
  const d = z.object({ id: z.uuid(), status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]) }).parse(Object.fromEntries(fd));
  await db.update(issueReports).set({ status: d.status }).where(eq(issueReports.id, d.id));
  await audit(user, `issue.${d.status.toLowerCase()}`, "issue_report", d.id);
  revalidatePath("/admin", "layout");
}

/* ---------------------------------------------------------------- users */

export async function setUserRoleAction(fd: FormData) {
  const user = await guard("manage_users");
  const d = z
    .object({ id: z.uuid(), role: z.enum(["STUDENT", "MENTOR", "EDITOR", "ADMIN"]) })
    .parse(Object.fromEntries(fd));
  if (d.id === user.id) redirect("/admin/users?error=self"); // prevent locking yourself out
  await db.update(users).set({ role: d.role as Role }).where(eq(users.id, d.id));
  await audit(user, "user.role", "user", d.id, { role: d.role });
  revalidatePath("/admin/users");
}

export async function assignMentorAction(fd: FormData) {
  const user = await guard("manage_users");
  const d = z.object({ studentId: z.uuid(), mentorId: z.uuid().or(z.literal("")) }).parse(Object.fromEntries(fd));
  await db.delete(mentorAssignments).where(eq(mentorAssignments.studentId, d.studentId));
  if (d.mentorId) {
    const [m] = await db.select({ role: users.role }).from(users).where(eq(users.id, d.mentorId));
    if (m && (m.role === "MENTOR" || m.role === "ADMIN"))
      await db.insert(mentorAssignments).values({ mentorId: d.mentorId, studentId: d.studentId });
  }
  await audit(user, "user.mentor", "user", d.studentId, { mentorId: d.mentorId || null });
  revalidatePath("/admin/users");
}
