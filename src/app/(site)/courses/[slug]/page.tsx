import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, CheckCircle2, Download, FileText, ListChecks, PlayCircle, ShieldCheck } from "lucide-react";
import { AskGrandpa } from "@/components/ask-grandpa";
import { Badge, Button, ButtonLink, Card, ProgressBar } from "@/components/ui";
import { assistantConfigured } from "@/lib/assistant/provider";
import { getCurrentUser } from "@/lib/auth";
import { formatBytes, formatDuration, formatLabel, levelLabel, percent, atLeastOne, PLACEHOLDER_SLUG } from "@/lib/format";
import { flattenLessons, getCourse, getPublishedCourseSlugs, type CourseWithModules } from "@/modules/courses/queries";
import { enrolAction } from "@/modules/learning/actions";
import { getCourseProgress } from "@/modules/learning/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return atLeastOne(await getPublishedCourseSlugs(), { slug: PLACEHOLDER_SLUG });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).slug);
  return course ? { title: course.title, description: course.summary } : {};
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();
  const lessons = flattenLessons(course);
  const first = lessons[0];
  const lessonCount = lessons.length;
  const videoCount = lessons.filter((l) => l.videoDurationSec).length;

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-page grid grid-cols-1 gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="tint">
                {course.category === "Agriculture" ? "Agriculture and livelihoods" : course.category}
              </Badge>
              {course.isPilot && <Badge tone="brand">Pilot course</Badge>}
            </div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-paper/80">{course.audience}</p>
            <p className="mt-3 text-sm text-paper/60">
              {levelLabel[course.level]} · {formatLabel[course.format]} · {course.modules.length} modules
            </p>
          </div>
          <Card className="p-5 text-ink">
            <h2 className="font-display font-semibold">Start learning</h2>
            <Suspense fallback={<EnrolBox course={course} firstLessonSlug={first?.slug} state={null} />}>
              <EnrolState course={course} firstLessonSlug={first?.slug} />
            </Suspense>
            {course.guide?.fileUrl && (
              <a
                href={course.guide.fileUrl}
                download
                className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-ink px-4 text-sm font-semibold hover:bg-mist"
              >
                <Download className="size-4" aria-hidden /> Download guide ({course.guide.format},{" "}
                {formatBytes(course.guide.sizeBytes)})
              </a>
            )}
          </Card>
        </div>
      </section>

      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="text-xl font-bold">
            Course modules
          </h2>
          <Suspense fallback={<ModuleList course={course} done={new Set()} />}>
            <ModuleListWithProgress course={course} />
          </Suspense>

          {course.activities[0] && (
            <Card className="mt-6 p-5">
              <p className="eyebrow">Practical activity</p>
              <h3 className="mt-1 text-lg font-bold">{course.activities[0].title}</h3>
              <p className="mt-2 text-ink-muted">{course.activities[0].prompt}</p>
              <ButtonLink href={`/dashboard/submissions?course=${course.id}`} variant="secondary" className="mt-4">
                Submit your project
              </ButtonLink>
            </Card>
          )}
        </section>

        <aside className="space-y-4">
          <Card className="p-5">
            <h2 className="font-display font-semibold">You will be able to</h2>
            <p className="mt-2 text-sm text-ink-muted">{course.outcomes}</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-display font-semibold">Resources</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {course.guide && (
                <li className="flex items-center gap-2">
                  <FileText className="size-4 text-brand" aria-hidden />
                  <Link href={`/library/${course.guide.slug}`} className="underline">
                    {course.guide.title}
                  </Link>
                  <span className="text-subtle">({course.guide.format}, {formatBytes(course.guide.sizeBytes)})</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <ListChecks className="size-4 text-brand" aria-hidden /> Practical checklists in every lesson
              </li>
              {videoCount > 0 && (
                <li className="flex items-center gap-2">
                  <PlayCircle className="size-4 text-brand" aria-hidden />
                  {videoCount === lessonCount ? "A short narrated video in every lesson" : `${videoCount} narrated lesson videos`}
                </li>
              )}
            </ul>
          </Card>
          {course.reviewNote && (
            <div className="rounded-card border border-brand bg-brand-tint p-5">
              <h2 className="flex items-center gap-2 font-display font-semibold">
                <ShieldCheck className="size-5 text-brand-ink" aria-hidden /> Reviewed by experts
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{course.reviewNote}</p>
              {course.reviewedBy && <p className="mt-1 text-xs text-subtle">Reviewer: {course.reviewedBy}</p>}
            </div>
          )}
        </aside>
      </div>
      {assistantConfigured() && (
        <AskGrandpa
          courseSlug={course.slug}
          topic={course.title}
          suggestions={["What will I learn in this course?", "Which lesson should I start with?", "Is this course right for me?"]}
        />
      )}
    </>
  );
}

type EnrolState = Awaited<ReturnType<typeof getCourseProgress>> | null;

async function EnrolState({ course, firstLessonSlug }: { course: CourseWithModules; firstLessonSlug?: string }) {
  const user = await getCurrentUser();
  const state = user ? await getCourseProgress(user.id, course.id) : null;
  return <EnrolBox course={course} firstLessonSlug={firstLessonSlug} state={state} />;
}

function EnrolBox({
  course,
  firstLessonSlug,
  state,
}: {
  course: CourseWithModules;
  firstLessonSlug?: string;
  state: EnrolState;
}) {
  const lessons = flattenLessons(course);
  if (state?.enrolled) {
    const pct = percent(state.completedLessonIds.size, lessons.length);
    const next = lessons.find((l) => !state.completedLessonIds.has(l.id)) ?? lessons[0];
    return (
      <div className="mt-3 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Your progress</span>
          <span className="font-semibold">{pct}%</span>
        </div>
        <ProgressBar value={pct} label="Course progress" />
        {state.certificateCode ? (
          <ButtonLink href={`/certificates/${state.certificateCode}`} className="w-full">
            <CheckCircle2 className="size-4" aria-hidden /> View certificate
          </ButtonLink>
        ) : (
          next && (
            <ButtonLink href={`/courses/${course.slug}/lessons/${next.slug}`} className="w-full">
              Continue: {next.title}
            </ButtonLink>
          )
        )}
      </div>
    );
  }
  return (
    <form action={enrolAction} className="mt-3 space-y-2">
      <input type="hidden" name="courseId" value={course.id} />
      <Button type="submit" className="w-full">
        Enrol free
      </Button>
      {firstLessonSlug && (
        <p className="text-center text-xs text-subtle">
          or{" "}
          <Link href={`/courses/${course.slug}/lessons/${firstLessonSlug}`} className="underline">
            preview the first lesson
          </Link>{" "}
          without an account
        </p>
      )}
    </form>
  );
}

async function ModuleListWithProgress({ course }: { course: CourseWithModules }) {
  const user = await getCurrentUser();
  const done = user ? (await getCourseProgress(user.id, course.id)).completedLessonIds : new Set<string>();
  return <ModuleList course={course} done={done} />;
}

function ModuleList({ course, done }: { course: CourseWithModules; done: Set<string> }) {
  return (
    <ol className="mt-4 space-y-2">
      {course.modules.map((m) => {
        const lesson = m.lessons[0];
        const complete = m.lessons.length > 0 && m.lessons.every((l) => done.has(l.id));
        return (
          <li key={m.id}>
            <Link
              href={lesson ? `/courses/${course.slug}/lessons/${lesson.slug}` : "#"}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-line px-3 py-2 transition-colors hover:border-ink"
            >
              <span
                className={
                  "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                  (complete ? "bg-ink text-paper" : "bg-brand text-ink")
                }
                aria-hidden
              >
                {complete ? <Check className="size-4" /> : m.position}
              </span>
              <span className="flex-1 font-medium">
                {m.title}
                {complete && <span className="sr-only"> (completed)</span>}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs text-subtle">
                {lesson?.videoDurationSec ? (
                  <>
                    <PlayCircle className="size-4 text-brand" aria-hidden />
                    <span className="sr-only">Video, </span>
                    {formatDuration(lesson.videoDurationSec)}
                  </>
                ) : (
                  <span className="hidden sm:inline">Lesson + checklist</span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
