import Link from "next/link";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { AdminTitle, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
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
  const [o, audit] = await Promise.all([getOverview(), can(user.role, "manage_users") ? recentAudit(8) : []]);

  const stats = [
    { label: "Courses", value: o.counts.courses },
    { label: "Resources", value: o.counts.resources },
    { label: "Awaiting approval", value: o.counts.awaitingApproval, accent: true },
    { label: "New inquiries", value: o.counts.newInquiries },
  ];

  return (
    <>
      <AdminTitle title="Overview" intro={`Signed in as ${user.name}.`} />
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-card border border-line bg-paper p-4">
            <dd className={"font-display text-3xl font-bold " + (s.accent ? "text-brand-ink" : "")}>{s.value}</dd>
            <dt className="text-sm text-subtle">{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-3">
          <h2 className="font-display font-semibold">Content review queue</h2>
          <Table head={["Item", "Owner / reviewer", "Status"]}>
            {o.queue.length + o.resQueue.length === 0 && (
              <tr>
                <Td className="text-subtle">Everything is published.</Td>
                <Td />
                <Td />
              </tr>
            )}
            {o.queue.map((q) => (
              <tr key={q.id}>
                <Td>
                  <Link href={`/admin/courses/${q.id}`} className="font-semibold underline">
                    {q.title}
                  </Link>
                  <span className="block text-xs text-subtle">Course</span>
                </Td>
                <Td>{q.owner ?? "—"}</Td>
                <Td>
                  <StatusBadge status={q.status} />
                </Td>
              </tr>
            ))}
            {o.resQueue.map((q) => (
              <tr key={q.id}>
                <Td>
                  <Link href={`/admin/library/${q.id}`} className="font-semibold underline">
                    {q.title}
                  </Link>
                  <span className="block text-xs text-subtle">Library resource</span>
                </Td>
                <Td>{q.reviewedBy ?? "—"}</Td>
                <Td>
                  <StatusBadge status={q.status} />
                </Td>
              </tr>
            ))}
          </Table>
        </div>

        <Panel title="Recent inquiries">
          {o.recentInquiries.length === 0 ? (
            <p className="text-sm text-subtle">No new inquiries.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {o.recentInquiries.map((i) => (
                <li key={i.id} className="flex gap-2">
                  <Mail className="mt-0.5 size-4 shrink-0 text-subtle" aria-hidden />
                  <Link href="/admin/inquiries" className="hover:underline">
                    <span className="font-medium">{inquiryLabel[i.type]}</span>
                    <span className="block text-xs text-subtle">{i.subject}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {audit.length > 0 && (
        <Panel title="Recent activity" className="mt-6">
          <ul className="space-y-1 text-sm">
            {audit.map((a) => (
              <li key={a.id} className="flex flex-wrap justify-between gap-2">
                <span>
                  <span className="font-medium">{a.actor ?? "System"}</span> · {a.action}
                </span>
                <span className="text-xs text-subtle">{a.createdAt.toLocaleString("en-GB")}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
