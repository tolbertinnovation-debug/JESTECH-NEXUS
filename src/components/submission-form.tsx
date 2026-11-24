"use client";

import { useActionState, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitProjectAction, type SubmitState } from "@/modules/learning/actions";
import { keepValuesOnSubmit } from "./use-keep-values";
import { Button, Field, Input, Select, Textarea, cx } from "./ui";

const types = [
  { value: "LIVE_LINK", label: "Live website link", hint: "https://your-site.example" },
  { value: "GITHUB", label: "GitHub repo", hint: "https://github.com/you/project" },
  { value: "DRIVE", label: "Google Drive", hint: "Share link set to 'Anyone with the link'" },
  { value: "DESIGN", label: "Graphic design", hint: "Link to Figma, Canva or an image" },
  { value: "SCREENSHOT", label: "Screenshots", hint: "Link to a shared folder or image" },
  { value: "FILE", label: "File link", hint: "Link to your uploaded file" },
] as const;

type Props = { courses: Array<{ id: string; title: string }>; defaultCourseId?: string };

/** Remounts the inner form for each new submission so its state starts fresh. */
export function SubmissionForm(props: Props) {
  const [round, setRound] = useState(0);
  return <SubmissionFormInner key={round} {...props} onAgain={() => setRound((r) => r + 1)} />;
}

function SubmissionFormInner({ courses, defaultCourseId, onAgain }: Props & { onAgain: () => void }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitProjectAction, {});
  const [type, setType] = useState<(typeof types)[number]["value"]>("LIVE_LINK");
  const e = state.errors ?? {};
  const current = types.find((t) => t.value === type)!;

  if (state.ok) {
    return (
      <div role="status" className="space-y-3 rounded-card bg-brand-tint p-5">
        <p className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="size-5 text-brand-ink" aria-hidden /> Submitted for review
        </p>
        <p className="text-sm">A mentor will review your project and leave feedback here.</p>
        <Button variant="secondary" size="sm" onClick={onAgain}>
          Submit another project
        </Button>
      </div>
    );
  }

  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="space-y-4" noValidate>
      {e.form && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
          {e.form}
        </p>
      )}
      <Field label="Course" htmlFor="sub-course">
        <Select id="sub-course" name="courseId" defaultValue={defaultCourseId ?? courses[0]?.id} required>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Project type</legend>
        <input type="hidden" name="type" value={type} />
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={type === t.value}
              onClick={() => setType(t.value)}
              className={cx(
                "min-h-9 rounded-full border px-3 text-sm",
                type === t.value ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Link" htmlFor="sub-url" error={e.url} hint={current.hint}>
        <Input id="sub-url" name="url" type="url" inputMode="url" placeholder="https://" required />
      </Field>
      <Field label="Short description" htmlFor="sub-desc" error={e.description}>
        <Textarea id="sub-desc" name="description" placeholder="What did you build and what did you learn?" required />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
