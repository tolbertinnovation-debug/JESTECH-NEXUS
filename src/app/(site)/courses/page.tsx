import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CourseIcon } from "@/components/brand";
import { FilterGroup, SearchBox, flatParams, type Params } from "@/components/filters";
import { Badge, EmptyState, cx } from "@/components/ui";
import { formatLabel, levelLabel } from "@/lib/format";
import { COURSE_CATEGORIES, getCatalog } from "@/modules/courses/queries";

export const metadata: Metadata = {
  title: "Course catalog",
  description: "Practical courses in technology, agriculture, education and entrepreneurship.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function CoursesPage({ searchParams }: Props) {
  return (
    <>
      <section className="border-b border-line bg-mist">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course catalog</h1>
            <p className="mt-1 text-subtle">Filter by category, level and format. Every course ends in a practical activity.</p>
          </div>
          <div className="sm:w-80">
            <Suspense fallback={<SearchBox action="/courses" current={{}} placeholder="Search courses" />}>
              <CatalogSearch searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function CatalogSearch({ searchParams }: Props) {
  const current = flatParams(await searchParams);
  return <SearchBox action="/courses" current={current} placeholder="Search courses" />;
}

async function Catalog({ searchParams }: Props) {
  const current: Params = flatParams(await searchParams);
  const list = await getCatalog(current);

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[14rem_1fr]">
      <aside className="space-y-5" aria-label="Filters">
        <FilterGroup
          label="Category"
          name="category"
          base="/courses"
          current={current}
          options={COURSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
        <FilterGroup
          label="Level"
          name="level"
          base="/courses"
          current={current}
          options={[
            { value: "BEGINNER", label: "Beginner" },
            { value: "INTERMEDIATE", label: "Intermediate" },
          ]}
        />
        <FilterGroup
          label="Format"
          name="format"
          base="/courses"
          current={current}
          options={Object.entries(formatLabel).map(([value, label]) => ({ value, label }))}
        />
      </aside>

      <section aria-live="polite">
        <p className="mb-4 text-sm text-subtle">
          {list.length} {list.length === 1 ? "course" : "courses"}
        </p>
        {list.length === 0 ? (
          <EmptyState title="No courses match these filters">
            <Link href="/courses" className="font-semibold text-brand-ink underline">
              Clear filters
            </Link>
          </EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-line transition-colors hover:border-ink"
                >
                  <div
                    className={cx(
                      "flex h-24 items-center justify-center",
                      c.isPilot ? "bg-brand text-ink" : "bg-ink-soft text-paper",
                    )}
                  >
                    <CourseIcon name={c.icon} className="size-8" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-display font-semibold group-hover:underline">{c.title}</h2>
                    <p className="text-sm text-subtle">
                      {c.category} · {levelLabel[c.level]} · {c.moduleCount} modules
                    </p>
                    <p className="line-clamp-2 text-sm text-ink-muted">{c.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      <Badge tone="muted">{formatLabel[c.format]}</Badge>
                      {c.isPilot && <Badge tone="dark">Pilot course</Badge>}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="container-page grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-3" aria-busy>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-56 animate-pulse rounded-card bg-mist" />
      ))}
    </div>
  );
}
