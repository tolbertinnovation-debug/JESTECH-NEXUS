/* Seeds development data. Run with: npm run db:seed (idempotent: skips if courses exist). */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { statSync } from "node:fs";
import path from "node:path";
import * as s from "./schema";
import {
  challengeSeeds,
  courseSeeds,
  expertSeeds,
  innovationSeeds,
  resourceSeeds,
} from "./seed-data";
import { hashPassword } from "../lib/password";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema: s });

const DEV_PASSWORD = process.env.SEED_PASSWORD ?? "nexus-dev-2026";

function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fileSize(publicPath: string | null): number | null {
  if (!publicPath) return null;
  try {
    return statSync(path.join(process.cwd(), "public", publicPath)).size;
  } catch {
    return null;
  }
}

async function main() {
  const existing = await db
    .select({ id: s.courses.id })
    .from(s.courses)
    .limit(1);
  if (existing.length) {
    console.log(
      "Database already seeded — run `npm run db:reset` to start over.",
    );
    return;
  }

  // On Vercel (production/preview) only real course and library content is loaded:
  // no dev accounts with a known password, and no sample experts, partners or challenges.
  const demo = !process.env.VERCEL && process.env.SEED_DEMO !== "false";
  let ownerId: string | null = null;

  if (demo) {
    const passwordHash = await hashPassword(DEV_PASSWORD);
    const [admin, , mentor, student] = await db
      .insert(s.users)
      .values([
        {
          name: "Nexus Admin",
          email: "admin@nexus.local",
          passwordHash,
          role: "ADMIN",
        },
        {
          name: "Content Editor",
          email: "editor@nexus.local",
          passwordHash,
          role: "EDITOR",
        },
        {
          name: "Mentor Demo",
          email: "mentor@nexus.local",
          passwordHash,
          role: "MENTOR",
        },
        {
          name: "Student Demo",
          email: "student@nexus.local",
          passwordHash,
          role: "STUDENT",
        },
      ])
      .returning();
    await db
      .insert(s.mentorAssignments)
      .values({ mentorId: mentor!.id, studentId: student!.id });
    ownerId = admin!.id;
  }

  const resourceIds = new Map<string, string>();
  for (const r of resourceSeeds) {
    const [row] = await db
      .insert(s.resources)
      .values({
        ...r,
        sizeBytes: fileSize(r.fileUrl),
        readOnlineUrl: r.format === "PDF" ? r.fileUrl : null,
        status: "PUBLISHED",
      })
      .returning({ id: s.resources.id });
    resourceIds.set(r.slug, row!.id);
  }

  for (const c of courseSeeds) {
    const { modules, activity, guideSlug, ...course } = c;
    const [row] = await db
      .insert(s.courses)
      .values({
        ...course,
        guideResourceId: guideSlug ? resourceIds.get(guideSlug) : null,
        status: "PUBLISHED",
        ownerId,
        publishedAt: new Date(),
      })
      .returning({ id: s.courses.id });
    await db.insert(s.activities).values({ courseId: row!.id, ...activity });
    for (const [mi, m] of modules.entries()) {
      const [mod] = await db
        .insert(s.courseModules)
        .values({ courseId: row!.id, position: mi + 1, title: m.title })
        .returning({ id: s.courseModules.id });
      await db.insert(s.lessons).values(
        m.lessons.map((l, li) => ({
          moduleId: mod!.id,
          position: li + 1,
          slug: slugify(l.title),
          title: l.title,
          summary: l.summary,
          body: l.body,
          checklist: l.checklist,
          estMinutes: l.minutes ?? 10,
        })),
      );
    }
  }

  if (!demo) {
    console.log(
      "Seeded courses and library (no demo accounts or sample listings).",
    );
    return;
  }

  const now = new Date();
  await db
    .insert(s.experts)
    .values(
      expertSeeds.map((e) => ({
        ...e,
        status: "APPROVED" as const,
        consentAt: now,
        verifiedAt: now,
      })),
    );
  // Partners appear only after a formal agreement — seed one PENDING example, which stays hidden.
  await db.insert(s.partners).values({
    name: "Example Pending Partner",
    category: "EDUCATION",
    collaborationArea: "Content partnership",
    status: "PENDING",
  });
  await db
    .insert(s.challenges)
    .values(challengeSeeds.map((c) => ({ ...c, published: true })));
  await db
    .insert(s.innovationItems)
    .values(
      innovationSeeds.map((i) => ({ ...i, published: true, verifiedAt: now })),
    );

  console.log(
    `Seeded. Dev accounts (password "${DEV_PASSWORD}"): admin@, editor@, mentor@, student@nexus.local`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
