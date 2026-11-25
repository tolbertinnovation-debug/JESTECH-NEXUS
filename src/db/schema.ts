import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ---------------------------------------------------------------- enums */

export const roleEnum = pgEnum("role", ["STUDENT", "MENTOR", "EDITOR", "ADMIN"]);
export const contentStatusEnum = pgEnum("content_status", [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);
export const listingStatusEnum = pgEnum("listing_status", ["PENDING", "APPROVED", "HIDDEN"]);
export const courseLevelEnum = pgEnum("course_level", ["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
export const courseFormatEnum = pgEnum("course_format", ["ONLINE", "HYBRID", "OFFLINE_GUIDE"]);
export const licenceEnum = pgEnum("licence", ["OWNED", "PERMISSION", "OPEN_LICENCE"]);
export const resourceFormatEnum = pgEnum("resource_format", ["PDF", "EPUB", "VIDEO", "AUDIO", "WEB"]);
export const submissionTypeEnum = pgEnum("submission_type", [
  "LIVE_LINK",
  "GITHUB",
  "DRIVE",
  "DESIGN",
  "SCREENSHOT",
  "FILE",
]);
export const submissionStatusEnum = pgEnum("submission_status", [
  "SUBMITTED",
  "CHANGES_REQUESTED",
  "APPROVED",
]);
export const partnerCategoryEnum = pgEnum("partner_category", [
  "EDUCATION",
  "NGO",
  "BUSINESS",
  "COMMUNITY",
  "DEVELOPMENT",
]);
export const innovationTypeEnum = pgEnum("innovation_type", ["CASE_STUDY", "PROTOTYPE"]);
export const challengeStatusEnum = pgEnum("challenge_status", ["OPEN", "CLOSED"]);
export const inquiryTypeEnum = pgEnum("inquiry_type", [
  "CONSULTATION",
  "PARTNERSHIP",
  "CONTACT",
  "SOLUTION",
]);
export const ticketStatusEnum = pgEnum("ticket_status", ["NEW", "IN_PROGRESS", "CLOSED"]);

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

/* ---------------------------------------------------------- users/auth */

export const users = pgTable(
  "users",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("STUDENT"),
    privateProgress: boolean("private_progress").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(), // sha256 of the cookie token
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/* -------------------------------------------------------------- courses */

export const courses = pgTable(
  "courses",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    audience: text("audience").notNull(),
    category: text("category").notNull(), // Technology | Agriculture | Education | Entrepreneurship
    level: courseLevelEnum("level").notNull().default("BEGINNER"),
    format: courseFormatEnum("format").notNull().default("ONLINE"),
    icon: text("icon").notNull().default("book"),
    outcomes: text("outcomes").notNull().default(""),
    isPilot: boolean("is_pilot").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    reviewNote: text("review_note"),
    guideResourceId: uuid("guide_resource_id"),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    reviewedBy: text("reviewed_by"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("courses_slug_idx").on(t.slug), index("courses_status_idx").on(t.status)],
);

export const courseModules = pgTable(
  "course_modules",
  {
    id: id(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    title: text("title").notNull(),
  },
  (t) => [index("modules_course_idx").on(t.courseId)],
);

export const lessons = pgTable(
  "lessons",
  {
    id: id(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => courseModules.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull().default(""),
    body: text("body").notNull().default(""), // lightweight markdown
    checklist: jsonb("checklist").$type<string[]>().notNull().default([]),
    estMinutes: integer("est_minutes").notNull().default(10),
    // Optional lesson video: a self-hosted MP4 (with poster + captions) or a YouTube link.
    videoUrl: text("video_url"),
    videoPoster: text("video_poster"),
    videoCaptions: text("video_captions"),
    videoDurationSec: integer("video_duration_sec"),
    videoSizeBytes: integer("video_size_bytes"),
    videoCredit: text("video_credit"),
  },
  (t) => [index("lessons_module_idx").on(t.moduleId)],
);

export const activities = pgTable("activities", {
  id: id(),
  courseId: uuid("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: createdAt(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completedAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const submissions = pgTable(
  "submissions",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    type: submissionTypeEnum("type").notNull(),
    url: text("url").notNull(),
    description: text("description").notNull(),
    status: submissionStatusEnum("status").notNull().default("SUBMITTED"),
    mentorId: uuid("mentor_id").references(() => users.id, { onDelete: "set null" }),
    feedback: text("feedback"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("submissions_user_idx").on(t.userId)],
);

export const mentorAssignments = pgTable(
  "mentor_assignments",
  {
    mentorId: uuid("mentor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.mentorId, t.studentId] })],
);

export const pointsLedger = pgTable(
  "points_ledger",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    refId: text("ref_id"),
    createdAt: createdAt(),
  },
  (t) => [
    index("points_user_idx").on(t.userId),
    uniqueIndex("points_unique_reason_idx").on(t.userId, t.reason, t.refId),
  ],
);

export const userBadges = pgTable(
  "user_badges",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    badgeKey: text("badge_key").notNull(),
    awardedAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeKey] })],
);

export const certificates = pgTable(
  "certificates",
  {
    id: id(),
    code: text("code").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    issuedAt: createdAt(),
  },
  (t) => [
    uniqueIndex("certificates_code_idx").on(t.code),
    uniqueIndex("certificates_user_course_idx").on(t.userId, t.courseId),
  ],
);

/* -------------------------------------------------------------- library */

export const resources = pgTable(
  "resources",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    subject: text("subject").notNull(),
    kind: text("kind").notNull().default("Guide"), // Guide | Teaching materials | Workbook ...
    audiences: jsonb("audiences").$type<string[]>().notNull().default([]),
    format: resourceFormatEnum("format").notNull(),
    language: text("language").notNull().default("English"),
    source: text("source").notNull(),
    publishedOn: text("published_on"), // free text: "2026", "March 2026", or null = unknown
    licence: licenceEnum("licence").notNull(),
    licenceNote: text("licence_note").notNull(),
    fileUrl: text("file_url"),
    sizeBytes: integer("size_bytes"),
    readOnlineUrl: text("read_online_url"),
    downloadable: boolean("downloadable").notNull().default(true),
    reviewedBy: text("reviewed_by"),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("resources_slug_idx").on(t.slug), index("resources_status_idx").on(t.status)],
);

export const savedItems = pgTable(
  "saved_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    resourceId: uuid("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }),
    savedAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.resourceId] })],
);

/* ------------------------------------------------- experts and partners */

export const experts = pgTable(
  "experts",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    title: text("title").notNull(),
    bio: text("bio").notNull(),
    area: text("area").notNull(), // filter group: Software and IT | Agriculture | Data ...
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    consentAt: timestamp("consent_at", { withTimezone: true }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    status: listingStatusEnum("status").notNull().default("PENDING"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("experts_slug_idx").on(t.slug)],
);

export const partners = pgTable("partners", {
  id: id(),
  name: text("name").notNull(),
  category: partnerCategoryEnum("category").notNull(),
  collaborationArea: text("collaboration_area").notNull(),
  description: text("description").notNull().default(""),
  logoUrl: text("logo_url"),
  website: text("website"),
  agreementRef: text("agreement_ref"),
  agreementDate: timestamp("agreement_date", { withTimezone: true }),
  status: listingStatusEnum("status").notNull().default("PENDING"),
  createdAt: createdAt(),
});

/* ----------------------------------------------------------- innovation */

export const challenges = pgTable(
  "challenges",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    context: text("context").notNull(),
    goals: text("goals").notNull(),
    community: text("community"),
    status: challengeStatusEnum("status").notNull().default("OPEN"),
    published: boolean("published").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("challenges_slug_idx").on(t.slug)],
);

export const innovationItems = pgTable("innovation_items", {
  id: id(),
  type: innovationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  sources: jsonb("sources").$type<string[]>().notNull().default([]),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  published: boolean("published").notNull().default(false),
  createdAt: createdAt(),
});

/* ------------------------------------------------ inquiries and reports */

export const inquiries = pgTable(
  "inquiries",
  {
    id: id(),
    type: inquiryTypeEnum("type").notNull(),
    name: text("name").notNull(),
    contact: text("contact").notNull(),
    organisation: text("organisation"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    expertId: uuid("expert_id").references(() => experts.id, { onDelete: "set null" }),
    challengeId: uuid("challenge_id").references(() => challenges.id, { onDelete: "set null" }),
    status: ticketStatusEnum("status").notNull().default("NEW"),
    notes: text("notes"),
    createdAt: createdAt(),
  },
  (t) => [index("inquiries_status_idx").on(t.status)],
);

export const issueReports = pgTable("issue_reports", {
  id: id(),
  page: text("page").notNull(),
  message: text("message").notNull(),
  contact: text("contact"),
  status: ticketStatusEnum("status").notNull().default("NEW"),
  createdAt: createdAt(),
});

export const auditLog = pgTable("audit_log", {
  id: id(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  detail: jsonb("detail"),
  createdAt: createdAt(),
});

/* ------------------------------------------------------------ relations */

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(courseModules),
  activities: many(activities),
}));
export const modulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, { fields: [courseModules.courseId], references: [courses.id] }),
  lessons: many(lessons),
}));
export const lessonsRelations = relations(lessons, ({ one }) => ({
  module: one(courseModules, { fields: [lessons.moduleId], references: [courseModules.id] }),
}));
export const activitiesRelations = relations(activities, ({ one }) => ({
  course: one(courses, { fields: [activities.courseId], references: [courses.id] }),
}));

export type User = typeof users.$inferSelect;
export type Role = (typeof roleEnum.enumValues)[number];
export type Course = typeof courses.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type Expert = typeof experts.$inferSelect;
export type Partner = typeof partners.$inferSelect;
