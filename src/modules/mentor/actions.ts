"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { auditLog, submissions } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { awardPoints, maybeIssueCertificate, POINTS } from "@/modules/learning/engine";
import { getSubmissionForReview } from "./data";

export type ReviewState = { errors?: Record<string, string> };

const schema = z.object({
  id: z.uuid(),
  decision: z.enum(["APPROVED", "CHANGES_REQUESTED"]),
  feedback: z.string().trim().min(5, "Write some constructive feedback (at least 5 characters)").max(4000),
});

export async function reviewSubmissionAction(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const user = await requireUser("review_submissions");
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: { feedback: parsed.error.issues[0]?.message ?? "Invalid input" } };

  const sub = await getSubmissionForReview(user, parsed.data.id);
  if (!sub) return { errors: { form: "You are not assigned to review this submission." } };

  await db
    .update(submissions)
    .set({ status: parsed.data.decision, feedback: parsed.data.feedback, mentorId: user.id, reviewedAt: new Date() })
    .where(eq(submissions.id, sub.id));
  await db.insert(auditLog).values({
    actorId: user.id,
    action: `submission.${parsed.data.decision.toLowerCase()}`,
    entity: "submission",
    entityId: sub.id,
  });

  if (parsed.data.decision === "APPROVED") {
    await awardPoints(sub.userId, POINTS.approved, "approved", sub.courseId);
    await maybeIssueCertificate(sub.userId, sub.courseId);
  }

  revalidatePath("/mentor", "layout");
  revalidatePath("/dashboard", "layout");
  redirect("/mentor?reviewed=1");
}
