import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { Logo } from "./brand";
import { SiteNav } from "./site-nav";
import { ButtonLink } from "./ui";

async function AccountArea() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <Link href="/login" className="rounded-md px-3 py-2 text-sm text-paper/90 hover:text-paper">
          Log in
        </Link>
        <ButtonLink href="/register" size="sm">
          Join free
        </ButtonLink>
      </>
    );
  }
  return (
    <>
      {can(user.role, "edit_content") && (
        <Link href="/admin" className="rounded-md px-3 py-2 text-sm text-paper/90 hover:text-paper">
          Admin
        </Link>
      )}
      {can(user.role, "review_submissions") && (
        <Link href="/mentor" className="rounded-md px-3 py-2 text-sm text-paper/90 hover:text-paper">
          Mentor
        </Link>
      )}
      <ButtonLink href="/dashboard" size="sm">
        My dashboard
      </ButtonLink>
    </>
  );
}

function AccountFallback() {
  return (
    <ButtonLink href="/register" size="sm">
      Join free
    </ButtonLink>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-paper/10 bg-ink text-paper">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <SiteNav
          account={
            <Suspense fallback={<AccountFallback />}>
              <AccountArea />
            </Suspense>
          }
        />
      </div>
    </header>
  );
}

const footerColumns = [
  {
    title: "Learn",
    links: [
      ["/courses", "Courses"],
      ["/library", "Digital library"],
      ["/offline", "Saved on this device"],
    ],
  },
  {
    title: "Connect",
    links: [
      ["/experts", "Experts"],
      ["/partners", "Partners"],
      ["/innovation", "Innovation"],
    ],
  },
  {
    title: "JesTech",
    links: [
      ["/about", "About"],
      ["/contact", "Contact"],
      ["/report", "Report an issue"],
      ["/privacy", "Privacy"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper/75">
      <div className="container-page grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Logo className="text-paper" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Journey Empowering Solutions Through Technology. Practical skills, local knowledge and expertise for
            Liberia.
          </p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="font-display text-sm font-semibold text-paper">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-block py-0.5 hover:text-brand">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-paper/10">
        <p className="container-page py-5 text-xs text-paper/55">
          JesTech Nexus · Built mobile-first for low-bandwidth connections. Lessons and files can be saved for offline use.
        </p>
      </div>
    </footer>
  );
}
