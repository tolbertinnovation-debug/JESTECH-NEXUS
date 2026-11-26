import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ListChecks, PlayCircle } from "lucide-react";
import { CourseIcon } from "@/components/brand";
import { AskGrandpa } from "@/components/ask-grandpa";
import { LessonVideo } from "@/components/lesson-video";
import { Markdown } from "@/components/markdown";
import { SaveOfflineButton } from "@/components/offline";
import { Button, ButtonLink, ProgressBar } from "@/components/ui";
import { assistantConfigured } from "@/lib/assistant/provider";
import { getCurrentUser } from "@/lib/auth";
import { formatBytes, formatDuration, percent, atLeastOne, PLACEHOLDER_SLUG } from "@/lib/format";
import { flattenLessons, getAllLessonParams, getCourse, getLesson } from "@/modules/courses/queries";
import { completeLessonAction } from "@/modules/learning/actions";
import { getCourseProgress } from "@/modules/learning/queries";

type Props = { params: Promise<{ slug: string; lesson: string }> };

export async function generateStaticParams() {
  return atLeastOne(await getAllLessonParams(), { slug: PLACEHOLDER_SLUG, lesson: PLACEHOLDER_SLUG });
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

  const video = lesson.videoUrl ? { ...lesson, videoUrl: lesson.videoUrl } : null;
  const selfHosted = video && video.videoUrl.startsWith("/");
  const offlineUrls = [
    here,
    ...(selfHosted ? [video.videoUrl, video.videoPoster, video.videoCaptions].filter((u): u is string => !!u) : []),
  ];

  return (
    <article>
      <div className="bg-ink text-paper">
        <div className="container-page flex min-h-12 items-center justify-between gap-3 text-sm">
          <Link href={`/courses/${slug}`} className="inline-flex min-w-0 items-center gap-1 hover:underline">
            <ArrowLeft className="size-4 shrink-0" aria-hidden /> <span className="truncate">{course.title}</span>
          </Link>
          <span className="shrink-0 text-paper/70">
            Lesson {idx + 1} of {all.length}
          </span>
        </div>
        {/* Position in the course: one segment per lesson */}
        <div className="container-page flex gap-1 pb-3" aria-hidden>
          {all.map((l, i) => (
            <span key={l.id} className={`h-1 flex-1 rounded-full ${i <= idx ? "bg-brand" : "bg-paper/20"}`} />
          ))}
        </div>
      </div>

      <div className="container-page max-w-3xl py-6 sm:py-8">
        <p className="eyebrow">
          Module {row.modulePosition} · {row.moduleTitle}
        </p>
        <h1 className="mt-1 text-3xl leading-tight font-bold sm:text-4xl">{lesson.title}</h1>
        {lesson.summary && <p className="mt-2 text-lg text-ink-muted">{lesson.summary}</p>}
        <ul className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-ink-muted">
          <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
            <Clock className="size-3.5" aria-hidden /> About {lesson.estMinutes} min
          </li>
          {video && (
            <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
              <PlayCircle className="size-3.5" aria-hidden /> Video {formatDuration(video.videoDurationSec) ?? ""}
            </li>
          )}
          {lesson.checklist.length > 0 && (
            <li className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1">
              <ListChecks className="size-3.5" aria-hidden /> {lesson.checklist.length}-step checklist
            </li>
          )}
        </ul>

        <div className="mt-6">
          {video ? (
            <LessonVideo video={video} title={`${lesson.title} (lesson video)`} />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-card bg-brand sm:h-40" aria-hidden>
              <CourseIcon name={course.icon} className="size-12 text-ink" />
            </div>
          )}
        </div>

        <div className="mt-8">
          <Markdown source={lesson.body} />
        </div>

        {lesson.checklist.length > 0 && (
          <section className="mt-8 rounded-card border border-line bg-paper p-5 sm:p-6" aria-labelledby="checklist">
            <h2 id="checklist" className="flex items-center gap-2 font-display text-lg font-semibold">
              <ListChecks className="size-5 text-brand" aria-hidden /> Checklist
            </h2>
            <ol className="mt-4 space-y-3">
              {lesson.checklist.map((item, i) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-ink">
                    {i + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SaveOfflineButton urls={offlineUrls} label={selfHosted ? "Save lesson and video offline" : "Save lesson offline"} />
          {selfHosted && video.videoSizeBytes && (
            <span className="text-xs text-subtle">Uses about {formatBytes(video.videoSizeBytes)} of storage</span>
          )}
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

        <nav className="mt-10 space-y-3 border-t border-line pt-6" aria-label="Lesson navigation">
          {next ? (
            <Link
              href={`/courses/${slug}/lessons/${next.slug}`}
              className="group flex items-center justify-between gap-4 rounded-card bg-ink p-5 text-paper transition-colors hover:bg-ink-soft"
            >
              <span className="min-w-0">
                <span className="eyebrow">Up next · Module {next.modulePosition}</span>
                <span className="mt-1 block truncate font-display text-lg font-semibold">{next.title}</span>
              </span>
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-ink transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-5" aria-hidden />
              </span>
            </Link>
          ) : (
            <Link
              href={`/courses/${slug}`}
              className="flex items-center justify-between gap-4 rounded-card bg-brand-tint p-5"
            >
              <span>
                <span className="eyebrow">Last lesson</span>
                <span className="mt-1 block font-display text-lg font-semibold">Back to the course and its practical activity</span>
              </span>
              <ArrowRight className="size-5 shrink-0" aria-hidden />
            </Link>
          )}
          {prev && (
            <Link
              href={`/courses/${slug}/lessons/${prev.slug}`}
              className="inline-flex min-h-11 items-center gap-1 text-sm text-subtle hover:text-ink"
            >
              <ArrowLeft className="size-4" aria-hidden /> Previous: {prev.title}
            </Link>
          )}
        </nav>
      </div>
      {assistantConfigured() && (
        <AskGrandpa
          courseSlug={slug}
          lessonSlug={lesson.slug}
          topic={lesson.title}
          suggestions={[
            "Explain this lesson simply",
            "Give me a local example",
            "Quiz me with 3 questions",
            ...(lesson.checklist[0] ? [`Help me: ${lesson.checklist[0]}`] : []),
          ]}
        />
      )}
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
