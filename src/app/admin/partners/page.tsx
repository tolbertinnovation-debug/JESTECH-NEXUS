import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { AdminTitle, InlineAction, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createPartnerAction, setPartnerStatusAction } from "@/modules/admin/actions";
import { listPartners } from "@/modules/admin/queries";
import { PARTNER_CATEGORIES } from "@/modules/directory/queries";

export const metadata = { title: "Partners" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AdminPartners(props: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Partners {...props} />
    </Suspense>
  );
}

async function Partners({ searchParams }: Props) {
  await requireUser("manage_listings", "/admin/partners");
  const [list, sp] = await Promise.all([listPartners(), searchParams]);
  return (
    <>
      <AdminTitle
        title="Partners"
        intro="A partner can be approved only with a formal agreement reference. No implied endorsement."
      />
      {sp.error === "agreement" && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          Enter the formal agreement reference before approving this partner.
        </p>
      )}
      <Table head={["Partner", "Category", "Agreement", "Status", "Actions"]}>
        {list.map((p) => (
          <tr key={p.id}>
            <Td>
              <span className="font-semibold">{p.name}</span>
              <span className="block text-xs text-subtle">{p.collaborationArea}</span>
            </Td>
            <Td>{PARTNER_CATEGORIES[p.category]}</Td>
            <Td>{p.agreementRef ?? <span className="text-subtle">None recorded</span>}</Td>
            <Td>
              <StatusBadge status={p.status} />
            </Td>
            <Td>
              {p.status !== "APPROVED" ? (
                <form action={setPartnerStatusAction} className="flex flex-col gap-1">
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  {!p.agreementRef && (
                    <>
                      <label htmlFor={`ag-${p.id}`} className="text-xs">
                        Agreement reference
                      </label>
                      <input id={`ag-${p.id}`} name="agreementRef" className="min-h-8 rounded border border-line px-2 text-xs" />
                    </>
                  )}
                  <button type="submit" className="min-h-8 w-fit rounded-md bg-brand px-2.5 text-xs font-semibold">
                    Approve
                  </button>
                </form>
              ) : (
                <InlineAction action={setPartnerStatusAction} fields={{ id: p.id, status: "HIDDEN" }} label="Hide" />
              )}
            </Td>
          </tr>
        ))}
      </Table>
      <Panel title="Add partner" className="mt-6">
        <AdminForm action={createPartnerAction} submitLabel="Add partner" resetOnSuccess>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Organisation name" htmlFor="name">
              <Input id="name" name="name" required />
            </Field>
            <Field label="Category" htmlFor="category">
              <Select id="category" name="category">
                {Object.entries(PARTNER_CATEGORIES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Collaboration area" htmlFor="collaborationArea">
              <Input id="collaborationArea" name="collaborationArea" required />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Website" htmlFor="website" hint="https://…">
              <Input id="website" name="website" type="url" />
            </Field>
            <Field label="Approved logo link" htmlFor="logoUrl">
              <Input id="logoUrl" name="logoUrl" />
            </Field>
            <Field label="Agreement reference" htmlFor="agreementRef" hint="Required to approve">
              <Input id="agreementRef" name="agreementRef" />
            </Field>
          </div>
          <Field label="Description" htmlFor="description">
            <Textarea id="description" name="description" rows={2} />
          </Field>
        </AdminForm>
      </Panel>
    </>
  );
}
