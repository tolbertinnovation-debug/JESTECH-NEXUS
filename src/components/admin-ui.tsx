import type { ReactNode } from "react";
import { Badge } from "./ui";

export const statusTone = {
  DRAFT: "muted",
  IN_REVIEW: "brand",
  PUBLISHED: "dark",
  ARCHIVED: "outline",
  PENDING: "brand",
  APPROVED: "dark",
  HIDDEN: "outline",
  NEW: "brand",
  IN_PROGRESS: "muted",
  CLOSED: "outline",
  OPEN: "dark",
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusTone }) {
  return <Badge tone={statusTone[status]}>{status.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}</Badge>;
}

export function AdminTitle({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {intro && <p className="mt-1 max-w-2xl text-sm text-subtle">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={"rounded-card border border-line bg-paper p-5 " + (className ?? "")}>
      {title && <h2 className="mb-4 font-display font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="relative overflow-x-auto rounded-card border border-line bg-paper">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead className="bg-ink text-left text-paper">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={"px-4 py-3 align-top " + (className ?? "")}>{children}</td>;
}

/** Small inline form button for status changes. */
export function InlineAction({
  action,
  fields,
  label,
  variant = "secondary",
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <form action={action} className="inline">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className={
          "min-h-8 rounded-md px-2.5 text-xs font-semibold " +
          (variant === "primary" ? "bg-brand text-ink hover:bg-brand-dark" : "border border-ink hover:bg-mist")
        }
      >
        {label}
      </button>
    </form>
  );
}
