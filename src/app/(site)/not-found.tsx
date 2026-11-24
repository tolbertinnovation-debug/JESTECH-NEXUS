import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-start gap-4 py-20">
      <p className="eyebrow">Page not found</p>
      <h1 className="text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="text-ink-muted">It may have moved, or it is not published yet.</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/courses" variant="secondary">
          Browse courses
        </ButtonLink>
      </div>
    </div>
  );
}
