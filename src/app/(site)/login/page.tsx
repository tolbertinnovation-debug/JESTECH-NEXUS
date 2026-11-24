import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/format";

export const metadata: Metadata = { title: "Log in" };

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
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 mb-6 text-sm text-subtle">Log in to continue learning.</p>
        <Suspense fallback={<div className="h-80" aria-busy />}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
