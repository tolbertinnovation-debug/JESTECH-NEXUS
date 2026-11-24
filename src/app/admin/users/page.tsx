import { Suspense } from "react";
import { AdminTitle, Table, Td } from "@/components/admin-ui";
import { Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { roleLabels } from "@/lib/rbac";
import { assignMentorAction, setUserRoleAction } from "@/modules/admin/actions";
import { listUsers } from "@/modules/admin/queries";

export const metadata = { title: "Users and roles" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const roles = ["STUDENT", "MENTOR", "EDITOR", "ADMIN"] as const;
const selectCls = "min-h-9 rounded-md border border-line bg-paper px-2 text-sm";
const btnCls = "min-h-9 rounded-md border border-ink px-2.5 text-xs font-semibold hover:bg-mist";

export default function AdminUsers(props: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-card bg-paper" aria-busy />}>
      <Users {...props} />
    </Suspense>
  );
}

async function Users({ searchParams }: Props) {
  const me = await requireUser("manage_users", "/admin/users");
  const [list, sp] = await Promise.all([listUsers(), searchParams]);
  const mentors = list.filter((u) => u.role === "MENTOR" || u.role === "ADMIN");

  return (
    <>
      <AdminTitle title="Users and roles" intro="Least privilege: give people only the role they need." />
      {sp.error === "self" && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
          You can&apos;t change your own role. Ask another admin.
        </p>
      )}
      <Table head={["User", "Role", "Mentor", "Joined"]}>
        {list.map((u) => (
          <tr key={u.id}>
            <Td>
              <span className="font-semibold">{u.name}</span>
              <span className="block text-xs text-subtle">{u.email}</span>
            </Td>
            <Td>
              {u.id === me.id ? (
                <Badge tone="dark">{roleLabels[u.role]} (you)</Badge>
              ) : (
                <form action={setUserRoleAction} className="flex gap-1">
                  <input type="hidden" name="id" value={u.id} />
                  <label htmlFor={`role-${u.id}`} className="sr-only">
                    Role for {u.name}
                  </label>
                  <select id={`role-${u.id}`} name="role" defaultValue={u.role} className={selectCls}>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={btnCls}>
                    Set
                  </button>
                </form>
              )}
            </Td>
            <Td>
              {u.role === "STUDENT" ? (
                <form action={assignMentorAction} className="flex gap-1">
                  <input type="hidden" name="studentId" value={u.id} />
                  <label htmlFor={`mentor-${u.id}`} className="sr-only">
                    Mentor for {u.name}
                  </label>
                  <select id={`mentor-${u.id}`} name="mentorId" defaultValue={u.mentorId ?? ""} className={selectCls}>
                    <option value="">None</option>
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={btnCls}>
                    Assign
                  </button>
                </form>
              ) : (
                <span className="text-subtle">—</span>
              )}
            </Td>
            <Td>{u.createdAt.toLocaleDateString("en-GB")}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
