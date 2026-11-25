import Link from "next/link";
import { Suspense } from "react";
import { AdminTitle, StatusBadge } from "@/components/admin-ui";
import { Badge, Button, Select, Textarea, cx } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { updateInquiryAction } from "@/modules/admin/actions";
import { listInquiries } from "@/modules/admin/queries";

export const metadata = { title: "Inquiries" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const typeLabel = {
  CONSULTATION: "Consultation",
  PARTNERSHIP: "Partnership",
  CONTACT: "Contact",
  SOLUTION: "Solution proposal",
} as const;
const statuses = ["NEW", "IN_PROGRESS", "CLOSED"] as const;

export default function AdminInquiries(props: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Inquiries {...props} />
    </Suspense>
  );
}

async function Inquiries({ searchParams }: Props) {
  await requireUser("manage_inquiries", "/admin/inquiries");
  const s = (await searchParams).status;
  const status = statuses.find((x) => x === s);
  const list = await listInquiries(status);

  return (
    <>
      <AdminTitle title="Inquiries" intro="Consultation requests, partnership inquiries, contact messages and solution proposals." />
      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter by status">
        {[undefined, ...statuses].map((x) => (
          <Link
            key={x ?? "all"}
            href={x ? `/admin/inquiries?status=${x}` : "/admin/inquiries"}
            aria-current={status === x ? "true" : undefined}
            className={cx(
              "min-h-9 rounded-full border px-3 py-1.5 text-sm",
              status === x ? "border-ink bg-ink text-paper" : "border-line bg-paper",
            )}
          >
            {x ? x.replace("_", " ").toLowerCase() : "All"}
          </Link>
        ))}
      </nav>
      {list.length === 0 ? (
        <p className="rounded-card border border-line bg-paper p-6 text-subtle">No inquiries.</p>
      ) : (
        <ul className="space-y-3">
          {list.map(({ inquiry: i, expertName, challengeTitle }) => (
            <li key={i.id} className="rounded-card border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="dark">{typeLabel[i.type]}</Badge>
                  <StatusBadge status={i.status} />
                </div>
                <span className="text-xs text-subtle">{i.createdAt.toLocaleString("en-GB")}</span>
              </div>
              <p className="mt-2 font-semibold">{i.subject}</p>
              <p className="text-sm text-subtle">
                {i.name}
                {i.organisation && ` · ${i.organisation}`} · {i.contact}
                {expertName && ` · for ${expertName}`}
                {challengeTitle && ` · challenge: ${challengeTitle}`}
              </p>
              <p className="mt-2 text-sm whitespace-pre-line">{i.message}</p>
              <form action={updateInquiryAction} className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-start">
                <input type="hidden" name="id" value={i.id} />
                <label className="sr-only" htmlFor={`st-${i.id}`}>
                  Status
                </label>
                <Select id={`st-${i.id}`} name="status" defaultValue={i.status}>
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="CLOSED">Closed</option>
                </Select>
                <label className="sr-only" htmlFor={`nt-${i.id}`}>
                  Internal notes
                </label>
                <Textarea id={`nt-${i.id}`} name="notes" defaultValue={i.notes ?? ""} rows={1} placeholder="Internal notes (follow-up, assigned expert…)" />
                <Button type="submit" variant="secondary">
                  Update
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
