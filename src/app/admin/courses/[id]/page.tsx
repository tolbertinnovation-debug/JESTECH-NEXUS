import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { CourseFields } from "@/components/admin-fields";
import { AdminTitle, InlineAction, Panel, StatusBadge } from "@/components/admin-ui";
import { Button, Input } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { addModuleAction, deleteModuleAction, saveCourseAction, setCourseStatusAction } from "@/modules/admin/actions";
import { getCourseForEdit, resourceOptions } from "@/modules/admin/queries";

export const metadata = { title: "Edit course" };

type Props = { params: Promise<{ id: string }> };

export default function EditCoursePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <EditCourse params={params} />
    </Suspense>
  );
}

async function EditCourse({ params }: Props) {
  const { id } = await params;
  const user = await requireUser("edit_content", `/admin/courses/${id}`);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [course, resources] = await Promise.all([getCourseForEdit(id), resourceOptions()]);
  if (!course) notFound();
  const canPublish = can(user.role, "publish_content");

  return (
    <>
      <Link href="/admin/courses" className="text-sm underline">
        ← All courses
      </Link>
      <AdminTitle title={course.title}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={course.status} />
          {course.status !== "DRAFT" && <InlineAction action={setCourseStatusAction} fields={{ id, status: "DRAFT" }} label="Back to draft" />}
          {course.status === "DRAFT" && <InlineAction action={setCourseStatusAction} fields={{ id, status: "IN_REVIEW" }} label="Send for review" />}
          {canPublish && course.status !== "PUBLISHED" && (
            <InlineAction action={setCourseStatusAction} fields={{ id, status: "PUBLISHED" }} label="Publish" variant="primary" />
          )}
          {canPublish && course.status === "PUBLISHED" && <InlineAction action={setCourseStatusAction} fields={{ id, status: "ARCHIVED" }} label="Archive" />}
          {course.status === "PUBLISHED" && (
            <Link href={`/courses/${course.slug}`} className="text-xs underline">
              View live
            </Link>
          )}
        </div>
      </AdminTitle>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Panel title="Details">
          <AdminForm action={saveCourseAction}>
            <CourseFields c={course} resources={resources} />
          </AdminForm>
        </Panel>

        <Panel title="Modules and lessons">
          <ol className="space-y-4">
            {course.modules.map((m) => (
              <li key={m.id} className="rounded-md border border-line p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">
                    {m.position}. {m.title}
                  </p>
                  {m.lessons.length === 0 && (
                    <InlineAction action={deleteModuleAction} fields={{ id: m.id, courseId: id }} label="Remove" />
                  )}
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.lessons.map((l) => (
                    <li key={l.id}>
                      <Link href={`/admin/courses/${id}/lessons/${l.id}`} className="underline">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={`/admin/courses/${id}/lessons/new?module=${m.id}`} className="mt-2 inline-block text-xs font-semibold text-brand-ink underline">
                  + Add lesson
                </Link>
              </li>
            ))}
          </ol>
          <form action={addModuleAction} className="mt-4 flex gap-2">
            <input type="hidden" name="courseId" value={id} />
            <label htmlFor="new-module" className="sr-only">
              New module title
            </label>
            <Input id="new-module" name="title" placeholder="New module title" required minLength={2} />
            <Button type="submit" variant="secondary">
              Add
            </Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
