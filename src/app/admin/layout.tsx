import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
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
      <aside className="z-20 min-w-0 bg-ink px-4 pt-3 pb-3 text-paper lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:p-5">
        <div className="mb-3 flex items-center justify-between lg:mb-6">
          <Link href="/admin" className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <LogoMark className="h-7 w-auto" />
            Nexus Admin
          </Link>
          <Link href="/" className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs text-paper/75 hover:bg-paper/10 lg:hidden">
            View site <ExternalLink className="size-3.5" aria-hidden />
          </Link>
        </div>
        <SideNav links={links} dark />
        <Link href="/" className="mt-auto hidden items-center gap-2 pt-6 text-sm text-paper/70 hover:text-paper lg:inline-flex">
          <ExternalLink className="size-4" aria-hidden /> View site
        </Link>
      </aside>
      <main id="main" className="min-w-0 flex-1 bg-mist/60 p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
