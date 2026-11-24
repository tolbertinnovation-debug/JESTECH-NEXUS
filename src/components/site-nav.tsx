"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cx } from "./ui";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/library", label: "Library" },
  { href: "/experts", label: "Experts" },
  { href: "/partners", label: "Partners" },
  { href: "/innovation", label: "Innovation" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

/** Desktop links + thumb-friendly mobile drawer. `account` is the server-rendered login/user area. */
export function SiteNav({ account }: { account: ReactNode }) {
  // The pathname is request data on dynamic routes; the fallback is the same nav without highlighting.
  return (
    <Suspense fallback={<NavInner account={account} pathname="" />}>
      <NavWithPath account={account} />
    </Suspense>
  );
}

function NavWithPath({ account }: { account: ReactNode }) {
  return <NavInner account={account} pathname={usePathname()} />;
}

function NavInner({ account, pathname }: { account: ReactNode; pathname: string }) {
  // Menu is "open for this path" — navigating anywhere closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
        {navLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={isActive(pathname, l.href) ? "page" : undefined}
            className={cx(
              "rounded-md px-3 py-2 text-sm transition-colors",
              isActive(pathname, l.href) ? "text-brand font-semibold" : "text-paper/90 hover:text-paper",
            )}
          >
            {l.label}
          </Link>
        ))}
        <div className="ml-2 flex items-center gap-2">{account}</div>
      </nav>

      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-md text-paper lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpenAt(open ? null : pathname)}
      >
        {open ? <X aria-hidden /> : <Menu aria-hidden />}
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full z-40 border-t border-paper/10 bg-ink lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(pathname, l.href) ? "page" : undefined}
                className={cx(
                  "flex min-h-12 items-center rounded-md px-3 text-base",
                  isActive(pathname, l.href) ? "text-brand font-semibold" : "text-paper",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-paper/10 px-3 pt-4">
              {account}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
