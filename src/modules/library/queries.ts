import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { resources } from "@/db/schema";

export const LIBRARY_SUBJECTS = ["Agriculture", "Education", "Technology", "Entrepreneurship"] as const;
export const LIBRARY_AUDIENCES = ["Farmers", "Teachers", "Students"] as const;
export const LIBRARY_FORMATS = ["PDF", "EPUB", "VIDEO"] as const;

export type LibraryFilters = { subject?: string; audience?: string; format?: string; language?: string; q?: string };

export async function searchLibrary(f: LibraryFilters) {
  "use cache";
  cacheLife("hours");
  cacheTag("library");

  const where = [eq(resources.status, "PUBLISHED")];
  if (f.subject && (LIBRARY_SUBJECTS as readonly string[]).includes(f.subject)) where.push(eq(resources.subject, f.subject));
  if (f.format && (LIBRARY_FORMATS as readonly string[]).includes(f.format))
    where.push(eq(resources.format, f.format as (typeof LIBRARY_FORMATS)[number]));
  if (f.audience && (LIBRARY_AUDIENCES as readonly string[]).includes(f.audience))
    where.push(sql`${resources.audiences} @> ${JSON.stringify([f.audience])}::jsonb`);
  if (f.language) where.push(eq(resources.language, f.language.slice(0, 40)));
  if (f.q?.trim()) {
    const q = `%${f.q.trim().slice(0, 80)}%`;
    where.push(
      or(ilike(resources.title, q), ilike(resources.description, q), ilike(resources.subject, q), ilike(resources.kind, q))!,
    );
  }

  return db
    .select({
      slug: resources.slug,
      title: resources.title,
      subject: resources.subject,
      kind: resources.kind,
      source: resources.source,
      format: resources.format,
      licence: resources.licence,
      sizeBytes: resources.sizeBytes,
      fileUrl: resources.fileUrl,
      readOnlineUrl: resources.readOnlineUrl,
      downloadable: resources.downloadable,
    })
    .from(resources)
    .where(and(...where))
    .orderBy(asc(resources.title));
}

export async function getLibraryLanguages() {
  "use cache";
  cacheLife("hours");
  cacheTag("library");
  const rows = await db
    .selectDistinct({ language: resources.language })
    .from(resources)
    .where(eq(resources.status, "PUBLISHED"));
  return rows.map((r) => r.language).sort();
}

export async function getResource(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("library", `resource:${slug}`);
  const [r] = await db
    .select()
    .from(resources)
    .where(and(eq(resources.slug, slug), eq(resources.status, "PUBLISHED")))
    .limit(1);
  return r ?? null;
}

export async function getResourceSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("library");
  return db.select({ slug: resources.slug }).from(resources).where(eq(resources.status, "PUBLISHED"));
}
