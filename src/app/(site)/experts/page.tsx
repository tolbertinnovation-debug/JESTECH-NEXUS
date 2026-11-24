import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterGroup, flatParams } from "@/components/filters";
import { InquiryForm } from "@/components/inquiry-form";
import { Badge, Card, EmptyState, PageHeader, buttonClass } from "@/components/ui";
import { initials } from "@/lib/format";
import { EXPERT_AREAS, getApprovedExperts, getExpertOptions } from "@/modules/directory/queries";

export const metadata: Metadata = {
  title: "Experts and consultancy",
  description: "Approved technical professionals, trainers and consultants. Send a consultation inquiry.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ExpertsPage({ searchParams }: Props) {
  const options = await getExpertOptions();
  return (
    <>
      <PageHeader title="Experts and consultancy" intro="Approved technical professionals, trainers and consultants." />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_24rem]">
        <Suspense fallback={<div className="h-64" aria-busy />}>
          <ExpertList searchParams={searchParams} />
        </Suspense>
        <aside id="inquiry" className="scroll-mt-4">
          <Card className="p-5">
            <h2 className="text-lg font-bold">Consultation inquiry</h2>
            <p className="mt-1 mb-4 text-sm text-subtle">We will connect you with a suitable expert.</p>
            <InquiryForm
              type="CONSULTATION"
              subjectOptions={EXPERT_AREAS}
              experts={options}
              footnote="Educational information is not professional advice."
            />
          </Card>
        </aside>
      </div>
    </>
  );
}

async function ExpertList({ searchParams }: Props) {
  const current = flatParams(await searchParams);
  const list = await getApprovedExperts(current.area);
  return (
    <section>
      <FilterGroup label="Area" name="area" base="/experts" current={current} options={EXPERT_AREAS.map((v) => ({ value: v, label: v }))} />
      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No approved experts in this area yet">
            Send an inquiry and we will find the right person.
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((x) => (
            <li key={x.id} className="flex flex-col gap-4 rounded-card border border-line p-4 sm:flex-row sm:items-center">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-brand" aria-hidden>
                {initials(x.name)}
              </span>
              <div className="flex-1">
                <h2 className="font-display font-semibold">{x.name}</h2>
                <p className="text-sm text-subtle">{x.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {x.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="mt-2 text-sm text-ink-muted">{x.bio}</p>
              </div>
              <a href="#inquiry" className={buttonClass("primary", "sm")}>
                Request consultation
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm text-subtle">
        Every expert profile is reviewed and approved by an admin before it appears, with identity, qualifications
        and consent confirmed.
      </p>
    </section>
  );
}
