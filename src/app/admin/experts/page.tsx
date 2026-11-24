import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { AdminTitle, InlineAction, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createExpertAction, setExpertStatusAction } from "@/modules/admin/actions";
import { listExperts } from "@/modules/admin/queries";
import { EXPERT_AREAS } from "@/modules/directory/queries";

export const metadata = { title: "Experts" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AdminExperts(props: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Experts {...props} />
    </Suspense>
  );
}

async function Experts({ searchParams }: Props) {
  await requireUser("manage_listings", "/admin/experts");
  const [list, sp] = await Promise.all([listExperts(), searchParams]);
  return (
    <>
      <AdminTitle
        title="Experts"
        intro="Confirm identity, qualifications or experience, and consent before approving. Approved experts appear publicly."
      />
      {sp.error === "verify" && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          Tick both “consent confirmed” and “identity & qualifications verified” before approving.
        </p>
      )}
      <Table head={["Expert", "Area", "Status", "Actions"]}>
        {list.map((x) => (
          <tr key={x.id}>
            <Td>
              <span className="font-semibold">{x.name}</span>
              <span className="block text-xs text-subtle">{x.title}</span>
            </Td>
            <Td>{x.area}</Td>
            <Td>
              <StatusBadge status={x.status} />
            </Td>
            <Td>
              {x.status !== "APPROVED" ? (
                <form action={setExpertStatusAction} className="flex flex-col gap-1 text-xs">
                  <input type="hidden" name="id" value={x.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <label className="flex items-center gap-1">
                    <input type="checkbox" name="consent" className="accent-brand" /> Consent confirmed
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" name="verified" className="accent-brand" /> Identity & qualifications verified
                  </label>
                  <button type="submit" className="mt-1 min-h-8 w-fit rounded-md bg-brand px-2.5 font-semibold">
                    Approve
                  </button>
                </form>
              ) : (
                <InlineAction action={setExpertStatusAction} fields={{ id: x.id, status: "HIDDEN" }} label="Hide" />
              )}
            </Td>
          </tr>
        ))}
      </Table>
      <Panel title="Add expert" className="mt-6">
        <AdminForm action={createExpertAction} submitLabel="Add expert" resetOnSuccess>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Name" htmlFor="name">
              <Input id="name" name="name" required />
            </Field>
            <Field label="Title" htmlFor="title" hint="e.g. Agriculture specialist">
              <Input id="title" name="title" required />
            </Field>
            <Field label="Slug" htmlFor="slug">
              <Input id="slug" name="slug" required />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Area" htmlFor="area">
              <Select id="area" name="area">
                {EXPERT_AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tags" htmlFor="tags" hint="Comma separated">
              <Input id="tags" name="tags" />
            </Field>
          </div>
          <Field label="Short bio" htmlFor="bio">
            <Textarea id="bio" name="bio" rows={3} required />
          </Field>
        </AdminForm>
      </Panel>
    </>
  );
}
