import type { Metadata } from "next";
import Link from "next/link";
import { SideNav } from "@/components/side-nav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · JesTech Nexus" }, robots: { index: false } };

const links = [
  { href: "/admin", label: "Overview", icon: "LayoutDashboard" as const, exact: true },
  { href: "/admin/courses", label: "Courses & lessons", icon: "BookOpen" as const },
  { href: "/admin/library", label: "Library", icon: "Library" as const },
  { href: "/admin/experts", label: "Experts", icon: "Users" as const },
  { href: "/admin/partners", label: "Partners", icon: "Globe" as const },
  { href: "/admin/innovation", label: "Innovation", icon: "Lightbulb" as const },
  { href: "/admin/inquiries", label: "Inquiries", icon: "Inbox" as const },
  { href: "/admin/reports", label: "Issue reports", icon: "Flag" as const },
  { href: "/admin/users", label: "Users and roles", icon: "UserCog" as const },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="bg-ink p-4 text-paper lg:w-60 lg:shrink-0">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-7 w-8 items-center justify-center rounded-md bg-brand text-sm text-ink">JT</span>
            Admin
          </Link>
          <Link href="/" className="text-xs text-paper/70 underline lg:hidden">
            View site
          </Link>
        </div>
        <SideNav links={links} dark />
        <Link href="/" className="mt-6 hidden text-sm text-paper/70 underline lg:block">
          ← View site
        </Link>
      </aside>
      <main id="main" className="min-w-0 flex-1 bg-mist/60 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
