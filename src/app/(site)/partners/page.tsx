import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";
import { FilterGroup, flatParams } from "@/components/filters";
import { InquiryForm } from "@/components/inquiry-form";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { PARTNER_CATEGORIES, getApprovedPartners } from "@/modules/directory/queries";

export const metadata: Metadata = {
  title: "Partners and institutions",
  description: "Institutions, NGOs, companies and communities working with JesTech Nexus.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const areas = [
  "Content partnership",
  "Outreach",
  "Pilot programme",
  "Expert contribution",
  "Training support",
  "Innovation challenge",
] as const;

export default function PartnersPage({ searchParams }: Props) {
  return (
    <>
      <PageHeader
        title="Partners and institutions"
        intro="Schools, ministries, NGOs, businesses and communities collaborating on content, outreach, pilots, expertise and programmes."
      />
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_24rem]">
        <section>
          <Suspense fallback={<div className="h-64" aria-busy />}>
            <PartnerList searchParams={searchParams} />
          </Suspense>
          <div className="mt-6 flex gap-3 rounded-card border border-brand bg-brand-tint p-4 text-sm">
            <BadgeCheck className="size-5 shrink-0 text-brand-ink" aria-hidden />
            <p>
              Organisations appear here only after a relationship is formally agreed. No ministry or institution is
              shown as a partner without a formal agreement.
            </p>
          </div>
        </section>
        <aside id="partner" className="scroll-mt-4">
          <Card className="p-5">
            <h2 className="text-lg font-bold">Partner with us</h2>
            <p className="mt-1 mb-4 text-sm text-subtle">Tell us how your organisation would like to collaborate.</p>
            <InquiryForm type="PARTNERSHIP" subjectOptions={areas} showOrganisation />
          </Card>
        </aside>
      </div>
    </>
  );
}

async function PartnerList({ searchParams }: Props) {
  const current = flatParams(await searchParams);
  const list = await getApprovedPartners(current.category);
  return (
    <>
      <FilterGroup
        label="Category"
        name="category"
        base="/partners"
        current={current}
        options={Object.entries(PARTNER_CATEGORIES).map(([value, label]) => ({ value, label }))}
      />
      {list.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Partners will be listed here once agreements are in place">
            Interested in working together? Use the partnership form.
          </EmptyState>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <li key={p.id} className="rounded-card border border-line p-4 text-center">
              <div className="flex h-20 items-center justify-center rounded-md bg-mist">
                {p.logoUrl ? (
                  // Approved logos are small; plain img keeps this page light.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logoUrl} alt={`${p.name} logo`} className="max-h-16 max-w-[80%]" loading="lazy" />
                ) : (
                  <span className="text-sm text-subtle">{p.name}</span>
                )}
              </div>
              <h2 className="mt-3 font-display font-semibold">{p.name}</h2>
              <p className="text-sm text-subtle">{p.collaborationArea}</p>
              {p.website && (
                <a href={p.website} className="mt-1 inline-block text-sm underline" rel="noopener" target="_blank">
                  Website
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
