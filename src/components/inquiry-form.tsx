"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { reportIssueAction, submitInquiryAction, type FormState } from "@/modules/inquiries/actions";
import { keepValuesOnSubmit } from "./use-keep-values";
import { Button, Field, Honeypot, Input, Select, Textarea } from "./ui";

type InquiryType = "CONSULTATION" | "PARTNERSHIP" | "CONTACT" | "SOLUTION";

const copy: Record<InquiryType, { subject: string; message: string; placeholder: string; submit: string; done: string }> = {
  CONSULTATION: {
    subject: "Subject area",
    message: "Describe your problem",
    placeholder: "Tell us what you need help with",
    submit: "Send inquiry",
    done: "Thank you. Your inquiry has been received and our team will follow up.",
  },
  PARTNERSHIP: {
    subject: "Collaboration area",
    message: "How would you like to work together?",
    placeholder: "Tell us about your organisation and the collaboration you have in mind",
    submit: "Send partnership inquiry",
    done: "Thank you. Our team will review your partnership inquiry and follow up.",
  },
  CONTACT: {
    subject: "Subject",
    message: "Message",
    placeholder: "How can we help?",
    submit: "Send message",
    done: "Thank you. Your message has been received.",
  },
  SOLUTION: {
    subject: "Solution title",
    message: "Describe your proposed solution",
    placeholder: "What is your idea, who would it help, and what would you need to test it?",
    submit: "Propose solution",
    done: "Thank you. Your proposal has been received and will be reviewed.",
  },
};

export function InquiryForm({
  type,
  subjectOptions,
  experts,
  challenges,
  defaultExpertId,
  defaultChallengeId,
  showOrganisation,
  footnote,
}: {
  type: InquiryType;
  subjectOptions?: readonly string[];
  experts?: Array<{ id: string; name: string; title: string }>;
  challenges?: Array<{ id: string; title: string }>;
  defaultExpertId?: string;
  defaultChallengeId?: string;
  showOrganisation?: boolean;
  footnote?: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitInquiryAction, {});
  const c = copy[type];
  const e = state.errors ?? {};
  const id = (n: string) => `${type.toLowerCase()}-${n}`;

  if (state.ok) {
    return (
      <div role="status" className="flex gap-3 rounded-card bg-brand-tint p-5">
        <CheckCircle2 className="size-6 shrink-0 text-brand-ink" aria-hidden />
        <p>{c.done}</p>
      </div>
    );
  }

  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="relative space-y-4" noValidate>
      <input type="hidden" name="type" value={type} />
      <Honeypot />
      {e.form && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
          {e.form}
        </p>
      )}

      {experts && experts.length > 0 && (
        <Field label="Expert (optional)" htmlFor={id("expert")}>
          <Select id={id("expert")} name="expertId" defaultValue={defaultExpertId ?? ""}>
            <option value="">Any suitable expert</option>
            {experts.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name} — {x.title}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {challenges && (
        <Field label="Challenge" htmlFor={id("challenge")}>
          <Select id={id("challenge")} name="challengeId" defaultValue={defaultChallengeId ?? ""} required>
            <option value="" disabled>
              Select a challenge
            </option>
            {challenges.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field label={c.subject} htmlFor={id("subject")} error={e.subject}>
        {subjectOptions ? (
          <Select id={id("subject")} name="subject" defaultValue="" required>
            <option value="" disabled>
              Select
            </option>
            {subjectOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        ) : (
          <Input id={id("subject")} name="subject" required maxLength={160} />
        )}
      </Field>

      <Field label={c.message} htmlFor={id("message")} error={e.message}>
        <Textarea id={id("message")} name="message" placeholder={c.placeholder} required maxLength={4000} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor={id("name")} error={e.name}>
          <Input id={id("name")} name="name" autoComplete="name" required maxLength={120} />
        </Field>
        <Field label="Preferred contact" htmlFor={id("contact")} error={e.contact} hint="Email or phone">
          <Input id={id("contact")} name="contact" autoComplete="email" placeholder="Email or phone" required maxLength={160} />
        </Field>
      </div>

      {showOrganisation && (
        <Field label="Organisation" htmlFor={id("org")}>
          <Input id={id("org")} name="organisation" autoComplete="organization" maxLength={160} />
        </Field>
      )}

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" className="mt-1 size-4 accent-brand" required />
        <span>
          I agree that JesTech may store these details and contact me about this request.
          {e.consent && <span className="block font-medium text-red-700">{e.consent}</span>}
        </span>
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : c.submit}
      </Button>
      {footnote && <p className="text-xs text-subtle">{footnote}</p>}
    </form>
  );
}

export function ReportIssueForm({ defaultPage }: { defaultPage?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(reportIssueAction, {});
  const e = state.errors ?? {};
  if (state.ok)
    return (
      <div role="status" className="flex gap-3 rounded-card bg-brand-tint p-5">
        <CheckCircle2 className="size-6 shrink-0 text-brand-ink" aria-hidden />
        <p>Thank you. The team will review this and correct the material if needed.</p>
      </div>
    );
  return (
    <form action={action} onSubmit={keepValuesOnSubmit(action)} className="relative space-y-4" noValidate>
      <Honeypot />
      <Field label="Page, course or resource" htmlFor="issue-page" error={e.page}>
        <Input id="issue-page" name="page" defaultValue={defaultPage} required maxLength={300} />
      </Field>
      <Field label="What is wrong or outdated?" htmlFor="issue-message" error={e.message}>
        <Textarea id="issue-message" name="message" required maxLength={3000} />
      </Field>
      <Field label="Contact (optional)" htmlFor="issue-contact" hint="So we can tell you when it is fixed">
        <Input id="issue-contact" name="contact" maxLength={160} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Report issue"}
      </Button>
    </form>
  );
}
