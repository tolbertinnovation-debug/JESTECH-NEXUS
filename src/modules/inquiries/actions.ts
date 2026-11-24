"use server";

import { revalidatePath } from "next/cache";
import { and, count, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { challenges, experts, inquiries, issueReports } from "@/db/schema";
import { adminInbox, sendEmail } from "@/lib/email";

export type FormState = { ok?: boolean; errors?: Record<string, string> };

const text = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} needs at least ${min} characters`)
    .max(max, `${label} is too long`);

const inquirySchema = z.object({
  type: z.enum(["CONSULTATION", "PARTNERSHIP", "CONTACT", "SOLUTION"]),
  name: text(2, 120, "Name"),
  contact: text(5, 160, "Contact"),
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  subject: text(2, 160, "Subject"),
  message: text(10, 4000, "Message"),
  expertId: z.uuid().optional().or(z.literal("")),
  challengeId: z.uuid().optional().or(z.literal("")),
  consent: z.literal("on", { message: "Please agree so we can contact you" }),
});

function issuesToErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const i of error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
  return errors;
}

/** Simple abuse guard: max 5 submissions per contact per hour. */
async function tooMany(contact: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [row] = await db
    .select({ n: count() })
    .from(inquiries)
    .where(and(eq(inquiries.contact, contact), gt(inquiries.createdAt, since)));
  return (row?.n ?? 0) >= 5;
}

const typeLabel = {
  CONSULTATION: "Consultation inquiry",
  PARTNERSHIP: "Partnership inquiry",
  CONTACT: "Contact message",
  SOLUTION: "Solution proposal",
} as const;

export async function submitInquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website_url")) return { ok: true }; // honeypot: pretend success to bots

  const parsed = inquirySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: issuesToErrors(parsed.error) };
  const d = parsed.data;

  if (await tooMany(d.contact)) {
    return { errors: { form: "We have received several messages from you recently. Please try again later." } };
  }

  let expertId: string | null = null;
  if (d.type === "CONSULTATION" && d.expertId) {
    const [e] = await db.select({ id: experts.id }).from(experts).where(and(eq(experts.id, d.expertId), eq(experts.status, "APPROVED")));
    expertId = e?.id ?? null;
  }
  let challengeId: string | null = null;
  if (d.type === "SOLUTION") {
    if (!d.challengeId) return { errors: { form: "Choose a challenge" } };
    const [c] = await db.select({ id: challenges.id }).from(challenges).where(and(eq(challenges.id, d.challengeId), eq(challenges.status, "OPEN")));
    if (!c) return { errors: { form: "This challenge is no longer open." } };
    challengeId = c.id;
  }

  await db.insert(inquiries).values({
    type: d.type,
    name: d.name,
    contact: d.contact,
    organisation: d.organisation || null,
    subject: d.subject,
    message: d.message,
    expertId,
    challengeId,
  });

  await sendEmail({
    to: adminInbox(),
    subject: `[Nexus] ${typeLabel[d.type]}: ${d.subject}`,
    text: `${typeLabel[d.type]}\n\nFrom: ${d.name}${d.organisation ? ` (${d.organisation})` : ""}\nContact: ${d.contact}\nSubject: ${d.subject}\n\n${d.message}\n\nReview it in the admin dashboard: /admin/inquiries`,
  });

  revalidatePath("/admin", "layout");
  return { ok: true };
}

const issueSchema = z.object({
  page: z.string().trim().min(1, "Tell us which page or resource").max(300),
  message: text(10, 3000, "Description"),
  contact: z.string().trim().max(160).optional().or(z.literal("")),
});

export async function reportIssueAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website_url")) return { ok: true };
  const parsed = issueSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: issuesToErrors(parsed.error) };
  await db.insert(issueReports).values({ ...parsed.data, contact: parsed.data.contact || null });
  await sendEmail({
    to: adminInbox(),
    subject: `[Nexus] Issue reported: ${parsed.data.page}`,
    text: `${parsed.data.message}\n\nContact: ${parsed.data.contact || "not given"}`,
  });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
