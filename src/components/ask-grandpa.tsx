"use client";

import { lazy, Suspense, useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

export type AskGrandpaProps = {
  courseSlug: string;
  lessonSlug?: string;
  /** Shown in the panel header and welcome message */
  topic: string;
  suggestions: string[];
};

// The chat panel is only downloaded when a learner opens it, so lesson pages stay light.
const Panel = lazy(() => import("./ask-grandpa-panel"));

/** Floating "Ask Grandpa" button that opens the AI tutor for the current course or lesson. */
export function AskGrandpa(props: AskGrandpaProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink py-2 pr-5 pl-2 font-display text-sm font-semibold text-paper shadow-lg ring-2 ring-brand/60 transition-transform hover:scale-[1.03] sm:right-6 sm:bottom-6 print:hidden"
          aria-haspopup="dialog"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand text-ink" aria-hidden>
            <MessageCircleQuestion className="size-5" />
          </span>
          Ask Grandpa
        </button>
      )}
      {open && (
        <Suspense fallback={null}>
          <Panel {...props} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
