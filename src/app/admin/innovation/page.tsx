import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { AdminTitle, InlineAction, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
import { Badge, Field, Input, Select, Textarea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import {
  createChallengeAction,
  createInnovationItemAction,
  updateChallengeAction,
  verifyInnovationItemAction,
} from "@/modules/admin/actions";
import { listInnovation } from "@/modules/admin/queries";

export const metadata = { title: "Innovation" };

export default function AdminInnovation() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Innovation />
    </Suspense>
  );
}

async function Innovation() {
  await requireUser("manage_listings", "/admin/innovation");
  const { challenges, items } = await listInnovation();
  return (
    <>
      <AdminTitle title="Innovation" intro="Challenges, case studies and prototypes. Only verified outcomes are published." />

      <h2 className="mb-3 font-display font-semibold">Challenges</h2>
      <Table head={["Challenge", "Status", "Visibility", "Actions"]}>
        {challenges.map((c) => (
          <tr key={c.id}>
            <Td>
              <span className="font-semibold">{c.title}</span>
              <span className="block text-xs text-subtle">{c.community}</span>
            </Td>
            <Td>
              <StatusBadge status={c.status} />
            </Td>
            <Td>{c.published ? <Badge tone="dark">Published</Badge> : <Badge tone="muted">Hidden</Badge>}</Td>
            <Td className="space-x-1 whitespace-nowrap">
              <InlineAction
                action={updateChallengeAction}
                fields={{ id: c.id, published: c.published ? "false" : "true" }}
                label={c.published ? "Unpublish" : "Publish"}
                variant={c.published ? "secondary" : "primary"}
              />
              <InlineAction
                action={updateChallengeAction}
                fields={{ id: c.id, status: c.status === "OPEN" ? "CLOSED" : "OPEN" }}
                label={c.status === "OPEN" ? "Close" : "Reopen"}
              />
            </Td>
          </tr>
        ))}
      </Table>

      <h2 className="mt-8 mb-3 font-display font-semibold">Case studies and prototypes</h2>
      <Table head={["Item", "Type", "Visibility", "Actions"]}>
        {items.map((i) => (
          <tr key={i.id}>
            <Td>
              <span className="font-semibold">{i.title}</span>
              {i.sources.length > 0 && <span className="block text-xs text-subtle">{i.sources.length} source(s)</span>}
            </Td>
            <Td>{i.type === "CASE_STUDY" ? "Case study" : "Prototype"}</Td>
            <Td>{i.published ? <Badge tone="dark">Verified & published</Badge> : <Badge tone="muted">Unverified</Badge>}</Td>
            <Td>
              <InlineAction
                action={verifyInnovationItemAction}
                fields={{ id: i.id, publish: i.published ? "false" : "true" }}
                label={i.published ? "Unpublish" : "Verify & publish"}
                variant={i.published ? "secondary" : "primary"}
              />
            </Td>
          </tr>
        ))}
      </Table>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel title="New challenge">
          <AdminForm action={createChallengeAction} submitLabel="Create challenge" resetOnSuccess>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" htmlFor="c-title">
                <Input id="c-title" name="title" required />
              </Field>
              <Field label="Slug" htmlFor="c-slug">
                <Input id="c-slug" name="slug" required />
              </Field>
            </div>
            <Field label="Community" htmlFor="c-community">
              <Input id="c-community" name="community" />
            </Field>
            <Field label="The problem" htmlFor="c-context">
              <Textarea id="c-context" name="context" rows={3} required />
            </Field>
            <Field label="What a good solution looks like" htmlFor="c-goals">
              <Textarea id="c-goals" name="goals" rows={3} required />
            </Field>
          </AdminForm>
        </Panel>
        <Panel title="New case study or prototype">
          <AdminForm action={createInnovationItemAction} submitLabel="Save" resetOnSuccess>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type" htmlFor="i-type">
                <Select id="i-type" name="type">
                  <option value="CASE_STUDY">Case study</option>
                  <option value="PROTOTYPE">Prototype</option>
                </Select>
              </Field>
              <Field label="Title" htmlFor="i-title">
                <Input id="i-title" name="title" required />
              </Field>
            </div>
            <Field label="Summary" htmlFor="i-summary">
              <Textarea id="i-summary" name="summary" rows={3} required />
            </Field>
            <Field label="Sources" htmlFor="i-sources" hint="One per line. Required for case studies.">
              <Textarea id="i-sources" name="sources" rows={2} />
            </Field>
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
