import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Inbox, Library, Lightbulb, Mail, Users } from "lucide-react";
import { Panel, StatusBadge } from "@/components/admin-ui";
import { cx } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { getOverview, recentAudit } from "@/modules/admin/queries";

const inquiryLabel = {
  CONSULTATION: "Consultation request",
  PARTNERSHIP: "Partnership inquiry",
  CONTACT: "Contact message",
  SOLUTION: "Solution proposal",
} as const;

export default function AdminHome() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  const user = await requireUser("edit_content", "/admin");
  const isAdmin = can(user.role, "manage_users");
  const [o, audit] = await Promise.all([getOverview(), isAdmin ? recentAudit(8) : []]);

  const stats = [
    { label: "Courses", value: o.counts.courses, icon: BookOpen, href: "/admin/courses" },
    { label: "Library resources", value: o.counts.resources, icon: Library, href: "/admin/library" },
    { label: "Awaiting approval", value: o.counts.awaitingApproval, icon: Clock, href: "/admin/courses", accent: o.counts.awaitingApproval > 0 },
    { label: "New inquiries", value: o.counts.newInquiries, icon: Inbox, href: "/admin/inquiries", accent: o.counts.newInquiries > 0 },
  ];

  const actions = [
    { label: "New course", href: "/admin/courses", icon: BookOpen, show: true },
    { label: "Add library resource", href: "/admin/library", icon: Library, show: true },
    { label: "Add an expert", href: "/admin/experts", icon: Users, show: can(user.role, "manage_listings") },
    { label: "Post a challenge", href: "/admin/innovation", icon: Lightbulb, show: can(user.role, "manage_listings") },
  ].filter((a) => a.show);

  const queue = [
    ...o.queue.map((q) => ({ id: q.id, title: q.title, kind: "Course", who: q.owner, status: q.status, href: `/admin/courses/${q.id}` })),
    ...o.resQueue.map((q) => ({ id: q.id, title: q.title, kind: "Library resource", who: q.reviewedBy, status: q.status, href: `/admin/library/${q.id}` })),
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Admin dashboard</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-subtle">Here is what needs your attention on JesTech Nexus.</p>
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, accent }) => (
          <Link
            key={label}
            href={href}
            className={cx(
              "group rounded-card border bg-paper p-4 transition-colors hover:border-ink",
              accent ? "border-brand/50" : "border-line",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cx("inline-flex size-9 items-center justify-center rounded-lg", accent ? "bg-brand text-ink" : "bg-mist text-ink-muted")}
                aria-hidden
              >
                <Icon className="size-4.5" />
              </span>
              <ArrowRight className="size-4 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
            </div>
            <dd className={cx("mt-3 font-display text-3xl font-bold", accent && "text-brand-ink")}>{value}</dd>
            <dt className="text-sm text-subtle">{label}</dt>
          </Link>
        ))}
      </dl>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="sr-only">
          Quick actions
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {actions.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex min-h-14 items-center gap-3 rounded-card bg-ink px-4 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
              >
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-ink" aria-hidden>
                  <Icon className="size-4" />
                </span>
                <span className="leading-tight">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel title="Content review queue">
          {queue.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-subtle">
              <CheckCircle2 className="size-5 text-brand" aria-hidden /> Everything is published. Nothing is waiting for review.
            </p>
          ) : (
            <ul className="-mx-2 divide-y divide-line">
              {queue.map((q) => (
                <li key={q.id}>
                  <Link href={q.href} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-mist">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{q.title}</span>
                      <span className="block text-xs text-subtle">
                        {q.kind}
                        {q.who ? ` · ${q.who}` : ""}
                      </span>
                    </span>
                    <StatusBadge status={q.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent inquiries">
          {o.recentInquiries.length === 0 ? (
            <p className="text-sm text-subtle">No new inquiries. Consultation, partnership and contact messages appear here.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {o.recentInquiries.map((i) => (
                <li key={i.id}>
                  <Link href="/admin/inquiries" className="flex gap-3 hover:underline">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mist" aria-hidden>
                      <Mail className="size-4 text-ink-muted" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{inquiryLabel[i.type]}</span>
                      <span className="block truncate text-xs text-subtle">{i.subject}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inquiries" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
            All inquiries <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Panel>
      </div>

      {audit.length > 0 && (
        <Panel title="Recent activity">
          <ul className="space-y-2 text-sm">
            {audit.map((a) => (
              <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <span>
                  <span className="font-medium">{a.actor ?? "System"}</span>{" "}
                  <span className="text-subtle">{a.action.replaceAll(".", " ")}</span>
                </span>
                <span className="text-xs text-subtle">{a.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
