import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Award } from "lucide-react";
import { Badge, Button, ButtonLink, Card, EmptyState, ProgressBar } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { percent } from "@/lib/format";
import { logoutAction } from "@/modules/accounts/actions";
import { togglePrivateProgressAction } from "@/modules/learning/actions";
import { BADGES } from "@/modules/learning/engine";
import { getDashboard, getLeaderboard } from "@/modules/learning/queries";

export const metadata: Metadata = { title: "My dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-mist" aria-busy />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireUser(undefined, "/dashboard");
  const [data, leaderboard] = await Promise.all([getDashboard(user.id), user.privateProgress ? [] : getLeaderboard()]);
  const inProgress = data.courses.filter((c) => !c.completedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-subtle">Pick up where you left off.</p>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        {[
          ["Courses in progress", inProgress.length, false],
          ["Points earned", data.points, true],
          ["Badges", data.badges.length, false],
        ].map(([label, value, accent]) => (
          <div key={String(label)} className="rounded-card bg-mist p-4">
            <dd className={"font-display text-2xl font-bold " + (accent ? "text-brand-ink" : "")}>{String(value)}</dd>
            <dt className="text-xs text-subtle sm:text-sm">{String(label)}</dt>
          </div>
        ))}
      </dl>

      <section id="courses" aria-labelledby="my-courses">
        <h2 id="my-courses" className="text-lg font-bold">
          My courses
        </h2>
        {data.courses.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="You haven't started a course yet">
              <ButtonLink href="/courses" size="sm" className="mt-2">
                Explore courses
              </ButtonLink>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.courses.map((c) => {
              const pct = percent(c.done, c.total);
              return (
                <li key={c.id}>
                  <Card className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/courses/${c.slug}`} className="font-semibold hover:underline">
                        {c.title}
                      </Link>
                      <span className="text-sm font-semibold">{pct}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={pct} label={`${c.title} progress`} />
                    </div>
                    <p className="mt-2 text-xs text-subtle">
                      {c.completedAt ? (
                        "Completed"
                      ) : c.next ? (
                        <>
                          Next: Module {c.next.modulePosition},{" "}
                          <Link href={`/courses/${c.slug}/lessons/${c.next.slug}`} className="underline">
                            {c.next.title}
                          </Link>
                        </>
                      ) : (
                        <>
                          All lessons done —{" "}
                          <Link href="/dashboard/submissions" className="underline">
                            submit your project
                          </Link>{" "}
                          to earn the certificate
                        </>
                      )}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4" id="badges">
          <h2 className="font-display font-semibold">Badges</h2>
          {data.badges.length === 0 ? (
            <p className="mt-2 text-sm text-subtle">Complete your first lesson to earn a badge.</p>
          ) : (
            <ul className="mt-2 flex flex-wrap gap-2">
              {data.badges.map((b) => {
                const meta = BADGES[b.badgeKey as keyof typeof BADGES];
                return (
                  <li key={b.badgeKey}>
                    <Badge title={meta?.description}>
                      <Award className="mr-1 size-3" aria-hidden />
                      {meta?.name ?? b.badgeKey}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="font-display font-semibold">Leaderboard</h2>
          {user.privateProgress ? (
            <p className="mt-2 text-sm text-subtle">
              <strong>Private progress mode</strong> is on. You are tracking only your own growth and are hidden from
              the leaderboard.
            </p>
          ) : (
            <ol className="mt-2 space-y-1 text-sm">
              {leaderboard.map((r, i) => (
                <li key={r.id} className={"flex justify-between " + (r.id === user.id ? "font-semibold" : "")}>
                  <span>
                    {i + 1}. {r.id === user.id ? "You" : r.name.split(" ")[0]}
                  </span>
                  <span>{r.points} pts</span>
                </li>
              ))}
            </ol>
          )}
          <form action={togglePrivateProgressAction} className="mt-3">
            <Button type="submit" variant="secondary" size="sm">
              {user.privateProgress ? "Show me on the leaderboard" : "Switch to private progress mode"}
            </Button>
          </form>
        </Card>
      </div>

      <form action={logoutAction} className="lg:hidden">
        <Button type="submit" variant="ghost" size="sm">
          Log out
        </Button>
      </form>
    </div>
  );
}
