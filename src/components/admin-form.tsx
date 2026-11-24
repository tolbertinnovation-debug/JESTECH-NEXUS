"use client";

import { useActionState, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ActionState } from "@/modules/admin/actions";
import { keepValuesOnSubmit } from "./use-keep-values";
import { Button } from "./ui";

/** Wraps server-rendered fields with validation summary, pending state and a success note. */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  resetOnSuccess,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  resetOnSuccess?: boolean;
}) {
  // Pass the server action straight through so the form also works before JavaScript loads.
  const [state, formAction, pending] = useActionState(action, {});
  // Count successful saves (adjusting state during render) so "create" forms can remount empty.
  const [seen, setSeen] = useState(state);
  const [round, setRound] = useState(0);
  if (state !== seen) {
    setSeen(state);
    if (state.ok && resetOnSuccess) setRound(round + 1);
  }
  return (
    <form action={formAction} onSubmit={keepValuesOnSubmit(formAction)} className="space-y-4" key={round}>
      {state.errors && state.errors.length > 0 && (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-1 list-disc pl-5">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {state.ok && state.message && (
        <p role="status" className="flex items-center gap-2 rounded-md bg-brand-tint p-3 text-sm font-medium">
          <CheckCircle2 className="size-4 text-brand-ink" aria-hidden /> {state.message}
        </p>
      )}
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
