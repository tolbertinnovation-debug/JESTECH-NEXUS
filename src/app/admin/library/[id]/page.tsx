import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { ResourceFields } from "@/components/admin-fields";
import { AdminTitle, InlineAction, Panel, StatusBadge } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { saveResourceAction, setResourceStatusAction } from "@/modules/admin/actions";
import { getResourceForEdit } from "@/modules/admin/queries";

export const metadata = { title: "Edit resource" };

type Props = { params: Promise<{ id: string }> };

export default function EditResourcePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <EditResource params={params} />
    </Suspense>
  );
}

async function EditResource({ params }: Props) {
  const { id } = await params;
  const user = await requireUser("edit_content", `/admin/library/${id}`);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const r = await getResourceForEdit(id);
  if (!r) notFound();
  const canPublish = can(user.role, "publish_content");

  return (
    <>
      <Link href="/admin/library" className="text-sm underline">
        ← Library
      </Link>
      <AdminTitle title={r.title}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={r.status} />
          {r.status === "DRAFT" && <InlineAction action={setResourceStatusAction} fields={{ id, status: "IN_REVIEW" }} label="Send for review" />}
          {r.status !== "DRAFT" && <InlineAction action={setResourceStatusAction} fields={{ id, status: "DRAFT" }} label="Back to draft" />}
          {canPublish && r.status !== "PUBLISHED" && (
            <InlineAction action={setResourceStatusAction} fields={{ id, status: "PUBLISHED" }} label="Publish" variant="primary" />
          )}
          {canPublish && r.status === "PUBLISHED" && <InlineAction action={setResourceStatusAction} fields={{ id, status: "ARCHIVED" }} label="Archive" />}
        </div>
      </AdminTitle>
      <Panel>
        <AdminForm action={saveResourceAction}>
          <ResourceFields r={r} />
        </AdminForm>
      </Panel>
    </>
  );
}
