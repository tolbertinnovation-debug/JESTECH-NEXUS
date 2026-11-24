import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { challenges, experts, innovationItems, partners } from "@/db/schema";

export const EXPERT_AREAS = ["Software and IT", "Agriculture", "Data", "Design", "Cybersecurity", "Education"] as const;
export const PARTNER_CATEGORIES = {
  EDUCATION: "Education",
  NGO: "NGOs",
  BUSINESS: "Business",
  COMMUNITY: "Community",
  DEVELOPMENT: "Development partners",
} as const;

/** Only approved, verified, consenting experts are ever public. */
export async function getApprovedExperts(area?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("experts");
  const where = [eq(experts.status, "APPROVED"), isNotNull(experts.verifiedAt), isNotNull(experts.consentAt)];
  if (area && (EXPERT_AREAS as readonly string[]).includes(area)) where.push(eq(experts.area, area));
  return db
    .select({ id: experts.id, slug: experts.slug, name: experts.name, title: experts.title, area: experts.area, tags: experts.tags, bio: experts.bio })
    .from(experts)
    .where(and(...where))
    .orderBy(asc(experts.name));
}

export async function getExpertOptions() {
  "use cache";
  cacheLife("hours");
  cacheTag("experts");
  return db
    .select({ id: experts.id, name: experts.name, title: experts.title })
    .from(experts)
    .where(and(eq(experts.status, "APPROVED"), isNotNull(experts.verifiedAt)))
    .orderBy(asc(experts.name));
}

/** Only partners with an approved, formally recorded agreement are public. */
export async function getApprovedPartners(category?: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("partners");
  const where = [eq(partners.status, "APPROVED"), isNotNull(partners.agreementRef)];
  if (category && category in PARTNER_CATEGORIES)
    where.push(eq(partners.category, category as keyof typeof PARTNER_CATEGORIES));
  return db
    .select({
      id: partners.id,
      name: partners.name,
      category: partners.category,
      collaborationArea: partners.collaborationArea,
      description: partners.description,
      logoUrl: partners.logoUrl,
      website: partners.website,
    })
    .from(partners)
    .where(and(...where))
    .orderBy(asc(partners.name));
}

export async function getInnovation() {
  "use cache";
  cacheLife("hours");
  cacheTag("innovation");
  const [open, items] = await Promise.all([
    db
      .select()
      .from(challenges)
      .where(eq(challenges.published, true))
      .orderBy(desc(challenges.status), desc(challenges.createdAt)),
    db
      .select()
      .from(innovationItems)
      .where(and(eq(innovationItems.published, true), isNotNull(innovationItems.verifiedAt)))
      .orderBy(desc(innovationItems.createdAt)),
  ]);
  return { challenges: open, items };
}

export async function getChallenge(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("innovation");
  const [c] = await db
    .select()
    .from(challenges)
    .where(and(eq(challenges.slug, slug), eq(challenges.published, true)))
    .limit(1);
  return c ?? null;
}
