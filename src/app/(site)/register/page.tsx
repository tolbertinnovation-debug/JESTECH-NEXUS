import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/format";

export const metadata: Metadata = { title: "Join free" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Already signed in? Skip the form. Renders nothing otherwise. */
async function RedirectIfSignedIn({ searchParams }: Props) {
  const next = (await searchParams).next;
  if (await getCurrentUser()) redirect(safeNext(next));
  return null;
}

export default function Page({ searchParams }: Props) {
  return (
    <div className="container-page flex justify-center py-12">
      <Suspense fallback={null}>
        <RedirectIfSignedIn searchParams={searchParams} />
      </Suspense>
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold">Create your free account</h1>
        <p className="mt-1 mb-6 text-sm text-subtle">Track progress, earn badges and certificates, and submit projects.</p>
        <Suspense fallback={<div className="h-80" aria-busy />}>
          <RegisterForm />
        </Suspense>
      </Card>
    </div>
  );
}
