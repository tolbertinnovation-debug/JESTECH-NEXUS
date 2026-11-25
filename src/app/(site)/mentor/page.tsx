import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Badge, Card, EmptyState } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getAssignedStudents, getReviewQueue } from "@/modules/mentor/data";

export const metadata: Metadata = { title: "Mentor workspace" };

const tone = { SUBMITTED: "brand", CHANGES_REQUESTED: "muted", APPROVED: "dark" } as const;
const label = { SUBMITTED: "Submitted", CHANGES_REQUESTED: "Changes requested", APPROVED: "Reviewed" } as const;

export default function MentorPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold">Mentor workspace</h1>
      <p className="mt-1 text-subtle">Review assigned students&apos; projects and give constructive feedback.</p>
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-card bg-mist" aria-busy />}>
        <Workspace />
      </Suspense>
    </div>
  );
}

async function Workspace() {
  const user = await requireUser("review_submissions", "/mentor");
  const [students, queue] = await Promise.all([getAssignedStudents(user), getReviewQueue(user)]);

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <Card className="h-fit p-5">
        <h2 className="font-display font-semibold">Assigned students</h2>
        {students.length === 0 ? (
          <p className="mt-2 text-sm text-subtle">No students assigned yet. An admin assigns students in Users and roles.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {students.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2">
                <span>{s.name}</span>
                {s.latestStatus ? <Badge tone={tone[s.latestStatus]}>{label[s.latestStatus]}</Badge> : <Badge tone="outline">In progress</Badge>}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <section>
        <h2 className="font-display font-semibold">Submissions</h2>
        {queue.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Nothing to review yet" />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-card border border-line">
            {queue.map((s) => (
              <li key={s.id}>
                <Link href={`/mentor/submissions/${s.id}`} className="flex flex-wrap items-center justify-between gap-2 p-4 hover:bg-mist">
                  <span>
                    <span className="font-semibold">{s.studentName}</span>
                    <span className="block text-sm text-subtle">{s.courseTitle}</span>
                  </span>
                  <Badge tone={tone[s.status]}>{label[s.status]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
