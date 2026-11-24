"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React resets uncontrolled fields after a form action runs, which wipes what people typed
 * when validation fails. Submitting through onSubmit keeps the values; the `action` prop on the
 * same form still works before JavaScript loads (progressive enhancement).
 */
export function keepValuesOnSubmit(formAction: (fd: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const fd = new FormData(e.currentTarget, submitter);
    startTransition(() => formAction(fd));
  };
}
