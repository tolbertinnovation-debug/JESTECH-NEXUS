import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { activities, courseModules, courses, lessons, resources } from "@/db/schema";

export const COURSE_CATEGORIES = ["Technology", "Agriculture", "Education", "Entrepreneurship"] as const;
export const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const COURSE_FORMATS = ["ONLINE", "HYBRID", "OFFLINE_GUIDE"] as const;

export type CatalogFilters = { category?: string; level?: string; format?: string; q?: string };

export async function getCatalog(filters: CatalogFilters) {
  "use cache";
  cacheLife("hours");
  cacheTag("courses");

  const where = [eq(courses.status, "PUBLISHED")];
  if (filters.category && (COURSE_CATEGORIES as readonly string[]).includes(filters.category))
    where.push(eq(courses.category, filters.category));
  if (filters.level && (COURSE_LEVELS as readonly string[]).includes(filters.level))
    where.push(eq(courses.level, filters.level as (typeof COURSE_LEVELS)[number]));
  if (filters.format && (COURSE_FORMATS as readonly string[]).includes(filters.format))
    where.push(eq(courses.format, filters.format as (typeof COURSE_FORMATS)[number]));
  if (filters.q?.trim()) {
    const q = `%${filters.q.trim().slice(0, 80)}%`;
    where.push(or(ilike(courses.title, q), ilike(courses.summary, q), ilike(courses.category, q))!);
  }

  return db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      summary: courses.summary,
      category: courses.category,
      level: courses.level,
      format: courses.format,
      icon: courses.icon,
      isPilot: courses.isPilot,
      moduleCount: sql<number>`(select count(*)::int from course_modules cm where cm.course_id = "courses"."id")`,
    })
    .from(courses)
    .where(and(...where))
    .orderBy(sql`${courses.isPilot} desc`, asc(courses.title));
}

export async function getFeaturedCourse() {
  "use cache";
  cacheLife("hours");
  cacheTag("courses");
  const [c] = await db
    .select({ slug: courses.slug, title: courses.title, summary: courses.summary })
    .from(courses)
    .where(and(eq(courses.status, "PUBLISHED"), eq(courses.isFeatured, true)))
    .orderBy(sql`${courses.isPilot} desc`)
    .limit(1);
  return c ?? null;
}

export async function getPublishedCourseSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("courses");
  return db.select({ slug: courses.slug }).from(courses).where(eq(courses.status, "PUBLISHED"));
}

export async function getCourse(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("courses", `course:${slug}`);

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.slug, slug), eq(courses.status, "PUBLISHED")),
    with: {
      modules: {
        orderBy: asc(courseModules.position),
        with: {
          lessons: {
            orderBy: asc(lessons.position),
            columns: { id: true, slug: true, title: true, summary: true, estMinutes: true, checklist: true },
          },
        },
      },
      activities: true,
    },
  });
  if (!course) return null;

  const guide = course.guideResourceId
    ? ((
        await db
          .select({
            slug: resources.slug,
            title: resources.title,
            format: resources.format,
            sizeBytes: resources.sizeBytes,
            fileUrl: resources.fileUrl,
          })
          .from(resources)
          .where(and(eq(resources.id, course.guideResourceId), eq(resources.status, "PUBLISHED")))
      )[0] ?? null)
    : null;

  return { ...course, guide };
}

export type CourseWithModules = NonNullable<Awaited<ReturnType<typeof getCourse>>>;

/** Flattened lesson order for prev/next navigation. */
export function flattenLessons(course: CourseWithModules) {
  return course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title, modulePosition: m.position })),
  );
}

export async function getLesson(courseSlug: string, lessonSlug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("courses", `course:${courseSlug}`);

  const [row] = await db
    .select({ lesson: lessons, moduleTitle: courseModules.title, modulePosition: courseModules.position })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(and(eq(courses.slug, courseSlug), eq(lessons.slug, lessonSlug), eq(courses.status, "PUBLISHED")))
    .limit(1);
  return row ?? null;
}

export async function getAllLessonParams() {
  "use cache";
  cacheLife("hours");
  cacheTag("courses");
  return db
    .select({ slug: courses.slug, lesson: lessons.slug })
    .from(lessons)
    .innerJoin(courseModules, eq(courseModules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, courseModules.courseId))
    .where(eq(courses.status, "PUBLISHED"));
}

export async function getActivityIds(courseIds: string[]) {
  if (!courseIds.length) return [];
  return db.select().from(activities).where(inArray(activities.courseId, courseIds));
}
