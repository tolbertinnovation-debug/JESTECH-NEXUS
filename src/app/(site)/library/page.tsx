import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Download, FileText, Signal } from "lucide-react";
import { FilterGroup, SearchBox, flatParams, type Params } from "@/components/filters";
import { Badge, ButtonLink, EmptyState, buttonClass } from "@/components/ui";
import { formatBytes, licenceLabel } from "@/lib/format";
import {
  LIBRARY_AUDIENCES,
  LIBRARY_FORMATS,
  LIBRARY_SUBJECTS,
  getLibraryLanguages,
  searchLibrary,
} from "@/modules/library/queries";

export const metadata: Metadata = {
  title: "Digital library",
  description: "Search books, guides, manuals, notes and videos. Read online or download for offline use.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function LibraryPage({ searchParams }: Props) {
  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold">Digital library</h1>
          <p className="mt-2 max-w-2xl text-paper/80">
            Every resource shows its source, licence and file size. Read online, or download permitted files for
            offline use.
          </p>
          <div className="mt-5 max-w-2xl">
            <Suspense fallback={<SearchBox action="/library" current={{}} placeholder="Search books, guides, manuals, notes and videos" dark />}>
              <LibrarySearch searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
      <Suspense fallback={<div className="container-page h-96 py-8" aria-busy />}>
        <LibraryResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function LibrarySearch({ searchParams }: Props) {
  const current = flatParams(await searchParams);
  return <SearchBox action="/library" current={current} placeholder="Search books, guides, manuals, notes and videos" dark />;
}

async function LibraryResults({ searchParams }: Props) {
  const current: Params = flatParams(await searchParams);
  const [list, languages] = await Promise.all([searchLibrary(current), getLibraryLanguages()]);

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[14rem_1fr]">
      <aside className="space-y-5" aria-label="Filters">
        <FilterGroup label="Subject" name="subject" base="/library" current={current} options={LIBRARY_SUBJECTS.map((v) => ({ value: v, label: v }))} />
        <FilterGroup label="Audience" name="audience" base="/library" current={current} options={LIBRARY_AUDIENCES.map((v) => ({ value: v, label: v }))} />
        <FilterGroup label="Format" name="format" base="/library" current={current} options={LIBRARY_FORMATS.map((v) => ({ value: v, label: v === "VIDEO" ? "Video" : v }))} />
        <FilterGroup label="Language" name="language" base="/library" current={current} options={languages.map((v) => ({ value: v, label: v }))} />
        <div className="rounded-card border border-brand bg-brand-tint p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <Signal className="size-4" aria-hidden /> Low-data friendly
          </p>
          <p className="mt-1 text-ink-muted">Compressed files, with sizes shown before you download.</p>
        </div>
      </aside>

      <section aria-live="polite">
        <p className="mb-4 text-sm text-subtle">
          {list.length} {list.length === 1 ? "resource" : "resources"}
        </p>
        {list.length === 0 ? (
          <EmptyState title="No resources match your search">
            <Link href="/library" className="font-semibold text-brand-ink underline">
              Clear filters
            </Link>
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {list.map((r) => (
              <li key={r.slug} className="flex flex-col gap-4 rounded-card border border-line p-4 sm:flex-row sm:items-center">
                <div className="flex flex-1 gap-4">
                  <span className="inline-flex h-14 w-11 shrink-0 items-center justify-center rounded-md bg-ink" aria-hidden>
                    <FileText className="size-5 text-brand" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display font-semibold">
                      <Link href={`/library/${r.slug}`} className="hover:underline">
                        {r.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-subtle">
                      {r.source} | {r.subject} · {r.kind}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="dark">{r.format}</Badge>
                      <Badge tone="muted">{formatBytes(r.sizeBytes)}</Badge>
                      <Badge tone="tint">{licenceLabel[r.licence]}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  {r.readOnlineUrl && (
                    <ButtonLink href={`/library/${r.slug}`} size="sm" className="flex-1">
                      Read online
                    </ButtonLink>
                  )}
                  {r.downloadable && r.fileUrl && (
                    <a href={r.fileUrl} download className={buttonClass("secondary", "sm", "flex-1")}>
                      <Download className="size-4" aria-hidden /> Download
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
