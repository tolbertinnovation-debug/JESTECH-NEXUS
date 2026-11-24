import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink } from "lucide-react";
import { ReviewForm } from "@/components/review-form";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getSubmissionForReview } from "@/modules/mentor/data";

export const metadata: Metadata = { title: "Review submission" };

type Props = { params: Promise<{ id: string }> };

const typeLabel = {
  LIVE_LINK: "Live site link",
  GITHUB: "GitHub repository",
  DRIVE: "Google Drive",
  DESIGN: "Graphic design",
  SCREENSHOT: "Screenshots",
  FILE: "File",
} as const;

export default function ReviewPage({ params }: Props) {
  return (
    <div className="container-page max-w-3xl py-10">
      <Link href="/mentor" className="text-sm underline">
        ← Mentor workspace
      </Link>
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-card bg-mist" aria-busy />}>
        <Review params={params} />
      </Suspense>
    </div>
  );
}

async function Review({ params }: Props) {
  const { id } = await params;
  const user = await requireUser("review_submissions", `/mentor/submissions/${id}`);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const s = await getSubmissionForReview(user, id);
  if (!s) notFound();

  return (
    <>
      <h1 className="mt-4 text-2xl font-bold">Review submission</h1>
      <p className="text-subtle">
        {s.studentName} · {s.courseTitle}
      </p>
      <Card className="mt-6 space-y-3 p-5">
        <p className="text-sm font-semibold">{typeLabel[s.type]}</p>
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all underline">
          {s.url} <ExternalLink className="size-4 shrink-0" aria-hidden />
        </a>
        <p className="whitespace-pre-line text-ink-muted">{s.description}</p>
      </Card>
      <Card className="mt-4 p-5">
        <ReviewForm id={s.id} defaultFeedback={s.feedback} />
      </Card>
    </>
  );
}
