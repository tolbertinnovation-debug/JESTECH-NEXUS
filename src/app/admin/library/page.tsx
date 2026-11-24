import Link from "next/link";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { ResourceFields } from "@/components/admin-fields";
import { AdminTitle, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth";
import { formatBytes, licenceLabel } from "@/lib/format";
import { saveResourceAction } from "@/modules/admin/actions";
import { listResources } from "@/modules/admin/queries";

export const metadata = { title: "Library" };

export default function AdminLibrary() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Library />
    </Suspense>
  );
}

async function Library() {
  await requireUser("edit_content", "/admin/library");
  const list = await listResources();
  return (
    <>
      <AdminTitle
        title="Library"
        intro="Only material JesTech owns, has permission to share, or that is openly licensed may be published. Record the licence for every resource."
      />
      <Table head={["Resource", "Format", "Licence", "Status"]}>
        {list.map((r) => (
          <tr key={r.id}>
            <Td>
              <Link href={`/admin/library/${r.id}`} className="font-semibold underline">
                {r.title}
              </Link>
              <span className="block text-xs text-subtle">{r.subject}</span>
            </Td>
            <Td>
              {r.format} · {formatBytes(r.sizeBytes)}
            </Td>
            <Td>{licenceLabel[r.licence]}</Td>
            <Td>
              <StatusBadge status={r.status} />
            </Td>
          </tr>
        ))}
      </Table>
      <Panel title="New resource" className="mt-6">
        <p className="mb-4 text-sm text-subtle">
          File uploads will connect to cloud storage (Cloudflare R2) at deployment. Until then, link to a file under
          /files/ or an https:// address.
        </p>
        <AdminForm action={saveResourceAction} submitLabel="Create resource">
          <ResourceFields />
        </AdminForm>
      </Panel>
    </>
  );
}
