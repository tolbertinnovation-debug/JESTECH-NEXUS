import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/inquiry-form";
import { Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the JesTech Nexus team." };

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" intro="Questions about courses, the library or working with JesTech? Send us a message." />
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_20rem]">
        <Card className="p-5 sm:p-6">
          <InquiryForm type="CONTACT" />
        </Card>
        <aside className="space-y-3 text-sm text-ink-muted">
          <p>
            Looking for expert help? Use the{" "}
            <Link className="font-semibold text-ink underline" href="/experts#inquiry">
              consultation inquiry
            </Link>
            .
          </p>
          <p>
            Representing an organisation? See{" "}
            <Link className="font-semibold text-ink underline" href="/partners#partner">
              partner with us
            </Link>
            .
          </p>
          <p>
            Found something wrong or outdated?{" "}
            <Link className="font-semibold text-ink underline" href="/report">
              Report an issue
            </Link>
            .
          </p>
        </aside>
      </div>
    </>
  );
}
