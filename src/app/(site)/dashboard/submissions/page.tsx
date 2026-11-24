import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge, ButtonLink, Card, EmptyState } from "@/components/ui";
import { SubmissionForm } from "@/components/submission-form";
import { requireUser } from "@/lib/auth";
import { getEnrolledCourses, getMySubmissions } from "@/modules/learning/queries";

export const metadata: Metadata = { title: "Submissions" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const statusTone = { SUBMITTED: "brand", CHANGES_REQUESTED: "muted", APPROVED: "dark" } as const;
const statusLabel = { SUBMITTED: "Submitted", CHANGES_REQUESTED: "Changes requested", APPROVED: "Approved" } as const;

export default function SubmissionsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-mist" aria-busy />}>
      <Submissions searchParams={searchParams} />
    </Suspense>
  );
}

async function Submissions({ searchParams }: Props) {
  const user = await requireUser("learn", "/dashboard/submissions");
  const course = (await searchParams).course;
  const [courses, list] = await Promise.all([getEnrolledCourses(user.id), getMySubmissions(user.id)]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Submit your project</h1>
      <Card className="p-5">
        {courses.length === 0 ? (
          <EmptyState title="Enrol in a course to submit its project">
            <ButtonLink href="/courses" size="sm" className="mt-2">
              Explore courses
            </ButtonLink>
          </EmptyState>
        ) : (
          <SubmissionForm courses={courses} defaultCourseId={typeof course === "string" ? course : undefined} />
        )}
      </Card>

      <section>
        <h2 className="text-lg font-bold">My submissions</h2>
        {list.length === 0 ? (
          <p className="mt-2 text-sm text-subtle">No submissions yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {list.map((s) => (
              <li key={s.id}>
                <Card className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{s.courseTitle}</p>
                    <Badge tone={statusTone[s.status]}>{statusLabel[s.status]}</Badge>
                  </div>
                  <a href={s.url} className="mt-1 block truncate text-sm underline" target="_blank" rel="noopener noreferrer">
                    {s.url}
                  </a>
                  <p className="mt-1 text-sm text-ink-muted">{s.description}</p>
                  {s.feedback && (
                    <div className="mt-3 rounded-md bg-mist p-3 text-sm">
                      <p className="font-semibold">Mentor feedback</p>
                      <p className="mt-1 whitespace-pre-line">{s.feedback}</p>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
