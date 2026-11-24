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
    <header className="relative z-30 bg-ink text-paper">
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

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="container-page flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-paper">JesTech Nexus</span>
          <span className="mx-2 text-paper/40">|</span>
          Journey Empowering Solutions Through Technology
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/about" className="hover:text-paper">
            About
          </Link>
          <Link href="/contact" className="hover:text-paper">
            Contact
          </Link>
          <Link href="/report" className="hover:text-paper">
            Report an issue
          </Link>
          <Link href="/privacy" className="hover:text-paper">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
