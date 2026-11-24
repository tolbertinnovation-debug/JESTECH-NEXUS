"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/modules/accounts/actions";
import { keepValuesOnSubmit } from "./use-keep-values";
import { Button, Field, Input } from "./ui";

/** Where to return after auth, read in the browser so the form works before any server streaming. */
function useNext() {
  const v = useSearchParams().get("next");
  return v && v.startsWith("/") && !v.startsWith("//") ? v : undefined;
}

export function LoginForm() {
  const next = useNext();
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      {e.form && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
          {e.form}
        </p>
      )}
      <Field label="Email" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-sm">
        New to Nexus?{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold underline">
          Create a free account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const next = useNext();
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Full name" htmlFor="name" error={e.name}>
        <Input id="name" name="name" autoComplete="name" defaultValue={state.values?.name} required />
      </Field>
      <Field label="Email" htmlFor="email" error={e.email}>
        <Input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </Field>
      <Field label="Password" htmlFor="password" error={e.password} hint="At least 8 characters">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create free account"}
      </Button>
      <p className="text-center text-xs text-subtle">
        You only need an account to track progress, save items and submit projects. See our{" "}
        <Link href="/privacy" className="underline">
          privacy summary
        </Link>
        .
      </p>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
