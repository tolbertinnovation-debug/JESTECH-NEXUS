import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { InlineAction, Panel } from "@/components/admin-ui";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { deleteLessonAction, saveLessonAction } from "@/modules/admin/actions";
import { getCourseForEdit, getLessonForEdit } from "@/modules/admin/queries";

export const metadata = { title: "Edit lesson" };

type Props = {
  params: Promise<{ id: string; lessonId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function LessonEditorPage(props: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <LessonEditor {...props} />
    </Suspense>
  );
}

const uuid = /^[0-9a-f-]{36}$/;

async function LessonEditor({ params, searchParams }: Props) {
  const { id, lessonId } = await params;
  const sp = await searchParams;
  await requireUser("edit_content", `/admin/courses/${id}`);
  if (!uuid.test(id) || (lessonId !== "new" && !uuid.test(lessonId))) notFound();

  const [course, lesson] = await Promise.all([
    getCourseForEdit(id),
    lessonId === "new" ? null : getLessonForEdit(lessonId),
  ]);
  if (!course || (lessonId !== "new" && !lesson)) notFound();
  const moduleId = lesson?.moduleId ?? (typeof sp.module === "string" ? sp.module : course.modules[0]?.id);

  return (
    <>
      <Link href={`/admin/courses/${id}`} className="text-sm underline">
        ← {course.title}
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-bold">{lesson ? `Edit: ${lesson.title}` : "New lesson"}</h1>
      <Panel>
        {sp.saved && <p className="mb-4 rounded-md bg-brand-tint p-3 text-sm font-medium">Lesson created.</p>}
        <AdminForm action={saveLessonAction}>
          <input type="hidden" name="id" value={lesson?.id ?? ""} />
          <input type="hidden" name="courseId" value={id} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Module" htmlFor="moduleId">
              <Select id="moduleId" name="moduleId" defaultValue={moduleId}>
                {course.modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.position}. {m.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Title" htmlFor="title">
              <Input id="title" name="title" defaultValue={lesson?.title} required />
            </Field>
            <Field label="Web address (slug)" htmlFor="slug">
              <Input id="slug" name="slug" defaultValue={lesson?.slug} required />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <Field label="Summary" htmlFor="summary">
              <Input id="summary" name="summary" defaultValue={lesson?.summary} />
            </Field>
            <Field label="Minutes" htmlFor="estMinutes">
              <Input id="estMinutes" name="estMinutes" type="number" min={1} max={240} defaultValue={lesson?.estMinutes ?? 10} />
            </Field>
          </div>
          <Field
            label="Lesson content"
            htmlFor="body"
            hint='Plain text. Blank line = new paragraph. "### " = heading. "- " = bullet. **bold**.'
          >
            <Textarea id="body" name="body" defaultValue={lesson?.body} rows={16} className="font-mono text-sm" />
          </Field>
          <Field label="Checklist" htmlFor="checklist" hint="One item per line">
            <Textarea id="checklist" name="checklist" defaultValue={lesson?.checklist.join("\n")} rows={4} />
          </Field>
          <fieldset className="space-y-4 rounded-card border border-line p-4">
            <legend className="px-1 text-sm font-semibold">Lesson video (optional)</legend>
            <p className="text-xs text-subtle">
              A self-hosted MP4 (for example /videos/…/lesson.mp4) or a YouTube link. Only use videos JesTech owns or has
              permission to share, and record the credit.
            </p>
            <Field label="Video link" htmlFor="videoUrl">
              <Input id="videoUrl" name="videoUrl" defaultValue={lesson?.videoUrl ?? ""} placeholder="/videos/… .mp4 or https://www.youtube.com/watch?v=…" />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Poster image" htmlFor="videoPoster" hint="Shown before the video plays">
                <Input id="videoPoster" name="videoPoster" defaultValue={lesson?.videoPoster ?? ""} />
              </Field>
              <Field label="Subtitles (.vtt)" htmlFor="videoCaptions">
                <Input id="videoCaptions" name="videoCaptions" defaultValue={lesson?.videoCaptions ?? ""} />
              </Field>
              <Field label="Length (seconds)" htmlFor="videoDurationSec">
                <Input id="videoDurationSec" name="videoDurationSec" type="number" min={0} defaultValue={lesson?.videoDurationSec ?? ""} />
              </Field>
              <Field label="File size (bytes)" htmlFor="videoSizeBytes" hint="Shown so learners know the data cost">
                <Input id="videoSizeBytes" name="videoSizeBytes" type="number" min={0} defaultValue={lesson?.videoSizeBytes ?? ""} />
              </Field>
            </div>
            <Field label="Credit / source" htmlFor="videoCredit">
              <Input id="videoCredit" name="videoCredit" defaultValue={lesson?.videoCredit ?? ""} />
            </Field>
          </fieldset>
        </AdminForm>
      </Panel>
      {lesson && (
        <div className="mt-4">
          <InlineAction action={deleteLessonAction} fields={{ id: lesson.id, courseId: id }} label="Delete lesson" />
        </div>
      )}
    </>
  );
}
