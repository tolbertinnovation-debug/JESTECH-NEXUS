import { Suspense } from "react";
import { AdminTitle, InlineAction, StatusBadge, Table, Td } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth";
import { updateIssueAction } from "@/modules/admin/actions";
import { listIssues } from "@/modules/admin/queries";

export const metadata = { title: "Issue reports" };

export default function AdminReports() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Reports />
    </Suspense>
  );
}

async function Reports() {
  await requireUser("manage_inquiries", "/admin/reports");
  const list = await listIssues();
  return (
    <>
      <AdminTitle title="Issue reports" intro="Reports of outdated or inaccurate material. Review, correct the content, then close." />
      <Table head={["Page", "Report", "Status", "Actions"]}>
        {list.length === 0 && (
          <tr>
            <Td className="text-subtle">No reports.</Td>
            <Td />
            <Td />
            <Td />
          </tr>
        )}
        {list.map((r) => (
          <tr key={r.id}>
            <Td className="max-w-48 break-words">{r.page}</Td>
            <Td>
              <p className="whitespace-pre-line">{r.message}</p>
              <p className="mt-1 text-xs text-subtle">
                {r.contact ?? "No contact"} · {r.createdAt.toLocaleDateString("en-GB")}
              </p>
            </Td>
            <Td>
              <StatusBadge status={r.status} />
            </Td>
            <Td className="space-x-1 whitespace-nowrap">
              {r.status === "NEW" && <InlineAction action={updateIssueAction} fields={{ id: r.id, status: "IN_PROGRESS" }} label="Start" />}
              {r.status !== "CLOSED" && (
                <InlineAction action={updateIssueAction} fields={{ id: r.id, status: "CLOSED" }} label="Close" variant="primary" />
              )}
            </Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
