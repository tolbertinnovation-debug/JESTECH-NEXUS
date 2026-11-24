"use client";

import { useActionState } from "react";
import { reviewSubmissionAction, type ReviewState } from "@/modules/mentor/actions";
import { keepValuesOnSubmit } from "./use-keep-values";
import { Button, Field, Textarea } from "./ui";

export function ReviewForm({ id, defaultFeedback }: { id: string; defaultFeedback?: string | null }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(reviewSubmissionAction, {});
  const e = state.errors ?? {};
  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      {e.form && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
          {e.form}
        </p>
      )}
      <Field label="Feedback" htmlFor="feedback" error={e.feedback}>
        <Textarea
          id="feedback"
          name="feedback"
          defaultValue={defaultFeedback ?? ""}
          placeholder="Write constructive feedback"
          rows={5}
          required
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="decision" value="APPROVED" disabled={pending}>
          Approve
        </Button>
        <Button type="submit" name="decision" value="CHANGES_REQUESTED" variant="secondary" disabled={pending}>
          Request changes
        </Button>
      </div>
    </form>
  );
}
