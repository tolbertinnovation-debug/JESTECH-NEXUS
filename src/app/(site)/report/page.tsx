import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportIssueForm } from "@/components/inquiry-form";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Report an issue",
  description: "Report outdated or inaccurate material so it can be reviewed and corrected.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function FormWithPage({ searchParams }: Props) {
  const page = (await searchParams).page;
  return <ReportIssueForm defaultPage={typeof page === "string" ? page.slice(0, 300) : undefined} />;
}

export default function ReportPage({ searchParams }: Props) {
  return (
    <>
      <PageHeader
        title="Report an issue"
        intro="Anyone can report outdated or inaccurate material. Every report is reviewed and corrected where needed."
      />
      <div className="container-page max-w-2xl py-10">
        <Card className="p-5 sm:p-6">
          <Suspense fallback={<ReportIssueForm />}>
            <FormWithPage searchParams={searchParams} />
          </Suspense>
        </Card>
      </div>
    </>
  );
}
