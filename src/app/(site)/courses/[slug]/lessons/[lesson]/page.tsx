import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { CourseIcon } from "@/components/brand";
import { Markdown } from "@/components/markdown";
import { SaveOfflineButton } from "@/components/offline";
import { Button, ButtonLink, ProgressBar } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { percent } from "@/lib/format";
import { flattenLessons, getAllLessonParams, getCourse, getLesson } from "@/modules/courses/queries";
import { completeLessonAction } from "@/modules/learning/actions";
import { getCourseProgress } from "@/modules/learning/queries";

type Props = { params: Promise<{ slug: string; lesson: string }> };

export async function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lesson } = await params;
  const row = await getLesson(slug, lesson);
  return row ? { title: row.lesson.title, description: row.lesson.summary } : {};
}

export default async function LessonPage({ params }: Props) {
  const { slug, lesson: lessonSlug } = await params;
  const [course, row] = await Promise.all([getCourse(slug), getLesson(slug, lessonSlug)]);
  if (!course || !row) notFound();

  const { lesson } = row;
  const all = flattenLessons(course);
  const idx = all.findIndex((l) => l.id === lesson.id);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const here = `/courses/${slug}/lessons/${lesson.slug}`;

  return (
    <article>
      <div className="bg-ink text-paper">
        <div className="container-page flex min-h-12 items-center justify-between gap-3 text-sm">
          <Link href={`/courses/${slug}`} className="inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="size-4" aria-hidden /> {course.title}
          </Link>
          <span className="text-paper/70">
            Module {row.modulePosition} of {course.modules.length}
          </span>
        </div>
      </div>
      <div className="flex h-32 items-center justify-center bg-brand sm:h-40" aria-hidden>
        <CourseIcon name={course.icon} className="size-12 text-ink" />
      </div>

      <div className="container-page max-w-3xl py-8">
        <p className="eyebrow">{row.moduleTitle}</p>
        <h1 className="mt-1 text-3xl font-bold">{lesson.title}</h1>
        <p className="mt-2 text-lg text-ink-muted">{lesson.summary}</p>
        <p className="mt-1 text-sm text-subtle">About {lesson.estMinutes} minutes</p>

        <div className="mt-6">
          <Markdown source={lesson.body} />
        </div>

        {lesson.checklist.length > 0 && (
          <section className="mt-8 rounded-card border border-line p-5" aria-labelledby="checklist">
            <h2 id="checklist" className="font-display font-semibold">
              Checklist
            </h2>
            <ul className="mt-3 space-y-2">
              {lesson.checklist.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-6">
          <SaveOfflineButton urls={[here]} label="Save lesson offline" />
        </div>

        <Suspense fallback={<CompleteBox lessonId={lesson.id} done={false} pct={0} signedIn={false} next={next ? `/courses/${slug}/lessons/${next.slug}` : `/courses/${slug}`} here={here} />}>
          <LessonProgress
            courseId={course.id}
            lessonId={lesson.id}
            total={all.length}
            next={next ? `/courses/${slug}/lessons/${next.slug}` : `/courses/${slug}`}
            here={here}
          />
        </Suspense>

        <nav className="mt-8 flex justify-between gap-3 border-t border-line pt-6" aria-label="Lesson navigation">
          {prev ? (
            <ButtonLink href={`/courses/${slug}/lessons/${prev.slug}`} variant="ghost">
              <ArrowLeft className="size-4" aria-hidden /> Previous
            </ButtonLink>
          ) : (
            <span />
          )}
          {next ? (
            <ButtonLink href={`/courses/${slug}/lessons/${next.slug}`} variant="ghost">
              Next <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          ) : (
            <ButtonLink href={`/courses/${slug}`} variant="ghost">
              Back to course
            </ButtonLink>
          )}
        </nav>
      </div>
    </article>
  );
}

async function LessonProgress({
  courseId,
  lessonId,
  total,
  next,
  here,
}: {
  courseId: string;
  lessonId: string;
  total: number;
  next: string;
  here: string;
}) {
  const user = await getCurrentUser();
  if (!user) return <CompleteBox lessonId={lessonId} done={false} pct={0} signedIn={false} next={next} here={here} />;
  const p = await getCourseProgress(user.id, courseId);
  return (
    <CompleteBox
      lessonId={lessonId}
      done={p.completedLessonIds.has(lessonId)}
      pct={percent(p.completedLessonIds.size, total)}
      signedIn
      next={next}
      here={here}
    />
  );
}

function CompleteBox({
  lessonId,
  done,
  pct,
  signedIn,
  next,
  here,
}: {
  lessonId: string;
  done: boolean;
  pct: number;
  signedIn: boolean;
  next: string;
  here: string;
}) {
  return (
    <div className="mt-6 space-y-3">
      {signedIn && (
        <>
          <ProgressBar value={pct} label="Course progress" />
          <p className="text-xs text-subtle">{pct}% complete</p>
        </>
      )}
      {!signedIn ? (
        <ButtonLink href={`/register?next=${encodeURIComponent(here)}`} size="lg" className="w-full">
          Create a free account to track progress
        </ButtonLink>
      ) : done ? (
        <p className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-mist font-semibold">
          <CheckCircle2 className="size-5 text-brand" aria-hidden /> Lesson complete
        </p>
      ) : (
        <form action={completeLessonAction}>
          <input type="hidden" name="lessonId" value={lessonId} />
          <input type="hidden" name="next" value={next} />
          <Button type="submit" size="lg" className="w-full">
            Mark lesson complete
          </Button>
        </form>
      )}
    </div>
  );
}
