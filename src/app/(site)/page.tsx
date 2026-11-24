import Link from "next/link";
import { Award, BookOpen, Download, FileText, Globe, Lightbulb, Users } from "lucide-react";
import { HeroArt } from "@/components/brand";
import { Badge, ButtonLink } from "@/components/ui";
import { getFeaturedCourse } from "@/modules/courses/queries";

const trust = [
  { icon: BookOpen, label: "Practical courses" },
  { icon: Download, label: "Offline downloads" },
  { icon: Award, label: "Digital certificates" },
  { icon: Users, label: "Mentor support" },
];

const sections = [
  { href: "/courses", icon: BookOpen, title: "Courses", sub: "Learn and apply" },
  { href: "/library", icon: FileText, title: "Library", sub: "Read or download" },
  { href: "/experts", icon: Users, title: "Experts", sub: "Get consultation" },
  { href: "/partners", icon: Globe, title: "Partners", sub: "Collaborate" },
  { href: "/innovation", icon: Lightbulb, title: "Innovation", sub: "Local solutions" },
];

export default async function HomePage() {
  const featured = await getFeaturedCourse();

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
          <div className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
            <p className="eyebrow">Learn. Build. Innovate.</p>
            <h1 className="mt-3 text-4xl leading-tight font-bold sm:text-5xl">
              Skills and knowledge that <span className="text-brand">work for Liberia</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-paper/80">
              Practical courses, a digital library, local experts and partners, all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/courses" size="lg">
                Explore courses
              </ButtonLink>
              <ButtonLink href="/library" size="lg" variant="inverse">
                Browse the library
              </ButtonLink>
            </div>
          </div>
          <HeroArt className="h-56 w-full sm:h-72 lg:h-full" />
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-mist">
        <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-sm font-semibold sm:grid-cols-4">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-5 text-brand" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Explore */}
      <section className="container-page py-12">
        <h2 className="text-2xl font-bold">Explore Nexus</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map(({ href, icon: Icon, title, sub }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full flex-col items-center rounded-card border border-line p-5 text-center transition-colors hover:border-brand"
              >
                <Icon className="size-7 text-brand" aria-hidden strokeWidth={1.75} />
                <span className="mt-3 font-display font-semibold">{title}</span>
                <span className="text-sm text-subtle">{sub}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Highlights */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {featured && (
            <article className="rounded-card bg-ink p-6 text-paper sm:p-8">
              <Badge tone="tint">Featured course</Badge>
              <h3 className="mt-3 text-2xl font-bold">{featured.title}</h3>
              <p className="mt-2 text-paper/80">{featured.summary}</p>
              <ButtonLink href={`/courses/${featured.slug}`} className="mt-5">
                View course
              </ButtonLink>
            </article>
          )}
          <article className="rounded-card bg-brand-tint p-6 sm:p-8">
            <Badge tone="dark">Local innovation</Badge>
            <h3 className="mt-3 text-2xl font-bold">Community challenges</h3>
            <p className="mt-2 text-ink-muted">
              Real problems from local communities. Propose a solution, collaborate with experts and partners.
            </p>
            <ButtonLink href="/innovation" className="mt-5">
              See open challenges
            </ButtonLink>
          </article>
        </div>
      </section>

      {/* Sign-up band */}
      <section className="bg-brand">
        <div className="container-page flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <p className="font-display text-xl font-bold">Ready to start learning? Create a free account.</p>
          <ButtonLink href="/register" variant="dark" size="lg">
            Join Nexus
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
