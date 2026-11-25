import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Award, BookOpen, CheckCircle2, Lock, Star, Trophy } from "lucide-react";
import { CourseIcon } from "@/components/brand";
import { Button, ButtonLink, EmptyState, ProgressBar, cx } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { initials, percent } from "@/lib/format";
import { togglePrivateProgressAction } from "@/modules/learning/actions";
import { BADGES, type BadgeKey } from "@/modules/learning/engine";
import { getDashboard, getLeaderboard } from "@/modules/learning/queries";

export const metadata: Metadata = { title: "My dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="h-16 animate-pulse rounded-card bg-paper" />
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-paper" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-card bg-paper" />
    </div>
  );
}

async function Dashboard() {
  const user = await requireUser(undefined, "/dashboard");
  const [data, leaderboard] = await Promise.all([getDashboard(user.id), user.privateProgress ? [] : getLeaderboard()]);
  const inProgress = data.courses.filter((c) => !c.completedAt);
  const current = inProgress.find((c) => c.next) ?? inProgress[0];
  const earned = new Set(data.badges.map((b) => b.badgeKey));

  const stats = [
    { label: "Courses in progress", value: inProgress.length, icon: BookOpen },
    { label: "Points earned", value: data.points, icon: Star, accent: true },
    { label: "Badges", value: data.badges.length, icon: Award },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="text-subtle">Pick up where you left off.</p>
      </header>

      <dl className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-card border border-line bg-paper p-3 sm:p-4">
            <Icon className={cx("size-5", accent ? "text-brand" : "text-ink-muted")} aria-hidden />
            <dd className={cx("mt-2 font-display text-2xl font-bold sm:text-3xl", accent && "text-brand-ink")}>{value}</dd>
            <dt className="text-xs leading-tight text-subtle sm:text-sm">{label}</dt>
          </div>
        ))}
      </dl>

      {current && (
        <section aria-labelledby="continue" className="overflow-hidden rounded-card bg-ink text-paper">
          <div className="flex items-start gap-4 p-5 sm:p-6">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-ink" aria-hidden>
              <CourseIcon name={current.icon} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p id="continue" className="eyebrow">
                Continue learning
              </p>
              <p className="mt-1 font-display text-xl leading-snug font-semibold">{current.title}</p>
              {current.next ? (
                <p className="mt-1 text-sm text-paper/70">
                  Next: Module {current.next.modulePosition} · {current.next.title}
                </p>
              ) : (
                <p className="mt-1 text-sm text-paper/70">All lessons done. Submit your project to earn the certificate.</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 overflow-hidden rounded-full bg-paper/15">
                  <div className="h-2 rounded-full bg-brand" style={{ width: `${percent(current.done, current.total)}%` }} />
                </div>
                <span className="text-sm font-semibold">{percent(current.done, current.total)}%</span>
              </div>
            </div>
          </div>
          <Link
            href={current.next ? `/courses/${current.slug}/lessons/${current.next.slug}` : "/dashboard/submissions"}
            className="flex min-h-12 items-center justify-between bg-brand px-5 font-display font-semibold text-ink hover:bg-brand-dark sm:px-6"
          >
            {current.next ? "Resume lesson" : "Submit your project"} <ArrowRight className="size-5" aria-hidden />
          </Link>
        </section>
      )}

      <section aria-labelledby="my-courses" className="rounded-card border border-line bg-paper p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="my-courses" className="text-lg font-bold">
            My courses
          </h2>
          <Link href="/courses" className="text-sm font-semibold text-brand-ink hover:underline">
            Browse all
          </Link>
        </div>
        {data.courses.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="You haven't started a course yet">
              <ButtonLink href="/courses" size="sm" className="mt-2">
                Explore courses
              </ButtonLink>
            </EmptyState>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {data.courses.map((c) => {
              const pct = percent(c.done, c.total);
              return (
                <li key={c.id}>
                  <Link href={`/courses/${c.slug}`} className="group flex items-center gap-3 py-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-mist text-ink-muted" aria-hidden>
                      <CourseIcon name={c.icon} className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold group-hover:underline">{c.title}</span>
                        <span className="shrink-0 text-sm font-semibold">
                          {c.completedAt ? <CheckCircle2 className="size-5 text-brand" aria-label="Completed" /> : `${pct}%`}
                        </span>
                      </span>
                      <span className="mt-1.5 block">
                        <ProgressBar value={pct} label={`${c.title} progress`} />
                      </span>
                      <span className="mt-1 block text-xs text-subtle">
                        {c.done} of {c.total} lessons · {c.category}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <section aria-labelledby="badges" className="rounded-card border border-line bg-paper p-4 sm:p-5">
          <h2 id="badges" className="text-lg font-bold">
            Badges
          </h2>
          <p className="text-sm text-subtle">
            {earned.size} of {Object.keys(BADGES).length} earned
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {(Object.keys(BADGES) as BadgeKey[]).map((key) => {
              const has = earned.has(key);
              return (
                <li
                  key={key}
                  className={cx("rounded-xl border p-3 text-center", has ? "border-brand/40 bg-brand-tint" : "border-dashed border-line")}
                >
                  <span
                    className={cx(
                      "mx-auto inline-flex size-11 items-center justify-center rounded-full",
                      has ? "bg-brand text-ink" : "bg-mist text-subtle",
                    )}
                    aria-hidden
                  >
                    {has ? <Award className="size-5" /> : <Lock className="size-4" />}
                  </span>
                  <p className={cx("mt-2 text-sm font-semibold", !has && "text-subtle")}>{BADGES[key].name}</p>
                  <p className="text-xs text-subtle">{has ? "Earned" : BADGES[key].description}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="leaderboard" className="rounded-card border border-line bg-paper p-4 sm:p-5">
          <h2 id="leaderboard" className="flex items-center gap-2 text-lg font-bold">
            <Trophy className="size-5 text-brand" aria-hidden /> Leaderboard
          </h2>
          {user.privateProgress ? (
            <p className="mt-2 text-sm text-subtle">
              <strong className="text-ink">Private progress mode is on.</strong> You are tracking only your own growth and
              are hidden from the leaderboard.
            </p>
          ) : leaderboard.length <= 1 ? (
            <p className="mt-2 text-sm text-subtle">
              You&apos;re one of the first learners here. As classmates join, you&apos;ll see how you compare.
            </p>
          ) : (
            <ol className="mt-3 space-y-1.5">
              {leaderboard.map((r, i) => {
                const me = r.id === user.id;
                return (
                  <li
                    key={r.id}
                    className={cx("flex items-center gap-3 rounded-lg px-2 py-1.5", me && "bg-brand-tint font-semibold")}
                  >
                    <span className="w-5 text-center text-sm font-bold text-subtle">{i + 1}</span>
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-brand" aria-hidden>
                      {initials(r.name)}
                    </span>
                    <span className="flex-1 truncate text-sm">{me ? "You" : r.name.split(" ")[0]}</span>
                    <span className="text-sm font-semibold">{r.points} pts</span>
                  </li>
                );
              })}
            </ol>
          )}
          <form action={togglePrivateProgressAction} className="mt-4">
            <Button type="submit" variant="secondary" size="sm">
              {user.privateProgress ? "Show me on the leaderboard" : "Switch to private progress mode"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
