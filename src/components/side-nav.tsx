"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  Award,
  BookOpen,
  Download,
  Flag,
  Globe,
  Inbox,
  LayoutDashboard,
  Library,
  Lightbulb,
  PenLine,
  UserCog,
  Users,
} from "lucide-react";
import { cx } from "./ui";

const icons = { Award, BookOpen, Download, Flag, Globe, Inbox, LayoutDashboard, Library, Lightbulb, PenLine, UserCog, Users };

/** Icons are passed by name so server components can configure this client component. */
export type SideLink = { href: string; label: string; icon: keyof typeof icons; exact?: boolean };

type Props = { links: SideLink[]; dark?: boolean };

export function SideNav(props: Props) {
  return (
    <Suspense fallback={<SideNavInner {...props} pathname="" />}>
      <SideNavWithPath {...props} />
    </Suspense>
  );
}

function SideNavWithPath(props: Props) {
  return <SideNavInner {...props} pathname={usePathname()} />;
}

function SideNavInner({ links, dark, pathname }: Props & { pathname: string }) {
  return (
    <nav aria-label="Section" className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map(({ href, label, icon, exact }) => {
        const Icon = icons[icon];
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm whitespace-nowrap transition-colors",
              active
                ? dark
                  ? "bg-brand font-semibold text-ink"
                  : "bg-ink font-semibold text-paper"
                : dark
                  ? "text-paper/80 hover:bg-paper/10 hover:text-paper"
                  : "text-ink-muted hover:bg-mist",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
