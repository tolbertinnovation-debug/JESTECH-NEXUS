import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BadgeCheck } from "lucide-react";
import { getCertificate } from "@/modules/learning/queries";
import { PrintButton } from "@/components/print-button";

type Props = { params: Promise<{ code: string }> };

export const metadata: Metadata = { title: "Certificate of completion", robots: { index: false } };

export default function CertificatePage({ params }: Props) {
  return (
    <div className="container-page py-10">
      <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-card bg-mist" aria-busy />}>
        <Certificate params={params} />
      </Suspense>
    </div>
  );
}

async function Certificate({ params }: Props) {
  const code = (await params).code;
  if (!/^JTN-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) notFound();
  const c = await getCertificate(code);
  if (!c) notFound();
  const date = c.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <p className="mx-auto mb-4 flex max-w-3xl items-center gap-2 text-sm font-semibold text-ink-muted print:hidden">
        <BadgeCheck className="size-5 text-brand" aria-hidden /> Verified: this certificate was issued by JesTech Nexus.
      </p>
      <article className="mx-auto max-w-3xl border-4 border-ink p-2">
        <div className="border border-brand px-6 py-12 text-center sm:px-12">
          <p className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-7 w-8 items-center justify-center rounded-md bg-brand text-sm">JT</span>
            JesTech Nexus
          </p>
          <p className="eyebrow mt-6">Certificate of completion</p>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{c.name}</h1>
          <p className="mt-4 text-ink-muted">has successfully completed</p>
          <p className="mt-1 font-display text-xl font-bold">{c.courseTitle}</p>
          <div className="mt-10 flex flex-col justify-between gap-2 text-xs text-subtle sm:flex-row">
            <span>Issued {date}</span>
            <span>Verification code: {c.code}</span>
          </div>
        </div>
      </article>
      <div className="mx-auto mt-4 max-w-3xl print:hidden">
        <PrintButton />
      </div>
    </>
  );
}
