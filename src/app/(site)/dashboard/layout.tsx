import { Suspense } from "react";
import { SideNav } from "@/components/side-nav";
import { getCurrentUser } from "@/lib/auth";
import { initials } from "@/lib/format";
import { roleLabels } from "@/lib/rbac";
import { logoutAction } from "@/modules/accounts/actions";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const, exact: true },
  { href: "/dashboard/submissions", label: "Submissions", icon: "PenLine" as const },
  { href: "/dashboard/certificates", label: "Certificates", icon: "Award" as const },
  { href: "/dashboard/saved", label: "Saved items", icon: "Download" as const },
];

async function Profile() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="mb-4 hidden flex-col items-center text-center lg:flex">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-ink font-display font-bold text-brand" aria-hidden>
        {initials(user.name)}
      </span>
      <p className="mt-2 font-semibold">{user.name}</p>
      <p className="text-xs text-subtle">{roleLabels[user.role]} account</p>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-10">
      {/* min-w-0 lets the tab row scroll sideways on phones instead of widening the page */}
      <aside className="min-w-0 lg:border-r lg:border-line lg:pr-4">
        <Suspense fallback={null}>
          <Profile />
        </Suspense>
        <SideNav links={links} />
        <form action={logoutAction} className="mt-2 hidden lg:block">
          <button type="submit" className="min-h-11 px-3 text-sm text-subtle underline">
            Log out
          </button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
