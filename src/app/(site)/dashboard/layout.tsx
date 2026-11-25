import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { SideNav } from "@/components/side-nav";
import { getCurrentUser } from "@/lib/auth";
import { initials } from "@/lib/format";
import { roleLabels } from "@/lib/rbac";
import { logoutAction } from "@/modules/accounts/actions";

const links = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" as const, exact: true },
  { href: "/dashboard/submissions", label: "Submissions", icon: "PenLine" as const },
  { href: "/dashboard/certificates", label: "Certificates", icon: "Award" as const },
  { href: "/dashboard/saved", label: "Saved items", icon: "Download" as const },
];

async function Profile() {
  const user = await getCurrentUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-3 lg:flex-col lg:text-center">
      <span
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-brand lg:size-16 lg:text-lg"
        aria-hidden
      >
        {initials(user.name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{user.name}</p>
        <p className="text-xs text-subtle">{roleLabels[user.role]} account</p>
      </div>
      <form action={logoutAction} className="lg:hidden">
        <button type="submit" className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm text-subtle hover:bg-mist">
          <LogOut className="size-4" aria-hidden /> Log out
        </button>
      </form>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-mist/50">
      <div className="container-page grid grid-cols-1 gap-5 py-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8 lg:py-10">
        {/* min-w-0 lets the tab row scroll sideways on phones instead of widening the page */}
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-line bg-paper p-4 lg:p-5">
            <Suspense fallback={<div className="h-11" />}>
              <Profile />
            </Suspense>
          </div>
          <SideNav links={links} />
          <form action={logoutAction} className="hidden lg:block">
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-subtle hover:text-ink">
              <LogOut className="size-4" aria-hidden /> Log out
            </button>
          </form>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
