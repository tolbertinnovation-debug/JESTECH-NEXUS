import Link from "next/link";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin-form";
import { CourseFields } from "@/components/admin-fields";
import { AdminTitle, Panel, StatusBadge, Table, Td } from "@/components/admin-ui";
import { requireUser } from "@/lib/auth";
import { saveCourseAction } from "@/modules/admin/actions";
import { listCourses, resourceOptions } from "@/modules/admin/queries";

export const metadata = { title: "Courses" };

export default function AdminCourses() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Courses />
    </Suspense>
  );
}

async function Courses() {
  await requireUser("edit_content", "/admin/courses");
  const [list, resources] = await Promise.all([listCourses(), resourceOptions()]);
  return (
    <>
      <AdminTitle title="Courses & lessons" intro="Editors create and edit content and send it for review. Admins publish." />
      <Table head={["Course", "Category", "Modules", "Status"]}>
        {list.map((c) => (
          <tr key={c.id}>
            <Td>
              <Link href={`/admin/courses/${c.id}`} className="font-semibold underline">
                {c.title}
              </Link>
              <span className="block text-xs text-subtle">/courses/{c.slug}</span>
            </Td>
            <Td>{c.category}</Td>
            <Td>{c.modules}</Td>
            <Td>
              <StatusBadge status={c.status} />
            </Td>
          </tr>
        ))}
      </Table>
      <Panel title="New course" className="mt-6">
        <AdminForm action={saveCourseAction} submitLabel="Create course">
          <CourseFields resources={resources} />
        </AdminForm>
      </Panel>
    </>
  );
}
