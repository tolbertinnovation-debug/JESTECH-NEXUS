import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Award } from "lucide-react";
import { Card, EmptyState } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getMyCertificates } from "@/modules/learning/queries";

export const metadata: Metadata = { title: "Certificates" };

export default function CertificatesPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-card bg-mist" aria-busy />}>
      <Certificates />
    </Suspense>
  );
}

async function Certificates() {
  const user = await requireUser("learn", "/dashboard/certificates");
  const list = await getMyCertificates(user.id);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Certificates</h1>
      <p className="text-sm text-subtle">
        Certificates are issued automatically when you finish every lesson and a mentor approves your project.
      </p>
      {list.length === 0 ? (
        <EmptyState title="No certificates yet">Keep going — you are closer than you think.</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((c) => (
            <li key={c.code}>
              <Card className="flex items-center gap-3 p-4">
                <Award className="size-8 text-brand" aria-hidden />
                <div>
                  <Link href={`/certificates/${c.code}`} className="font-semibold underline">
                    {c.courseTitle}
                  </Link>
                  <p className="text-xs text-subtle">
                    {c.issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {c.code}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
