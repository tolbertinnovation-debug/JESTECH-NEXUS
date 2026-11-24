import type { Metadata } from "next";
import { BookOpen, Download, Globe, Layers, Lightbulb, Users } from "lucide-react";
import { ButtonLink, Card, IconTile, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description: "JesTech Nexus: a digital innovation and talent ecosystem for Liberia.",
};

const pillars = [
  { icon: BookOpen, title: "Learn and apply", text: "Structured courses in AI, web development, cybersecurity, data analysis, design, digital productivity, agriculture and entrepreneurship, each ending in a practical activity." },
  { icon: Download, title: "Knowledge access", text: "A searchable digital library. Read online, or download permitted files with visible sizes for offline use in low-connectivity areas." },
  { icon: Users, title: "Local expertise", text: "Approved expert profiles and a simple consultation inquiry form connect people with qualified professionals." },
  { icon: Globe, title: "Partners", text: "Institutions, NGOs, companies and communities collaborate with us. Only formally agreed partners are listed." },
  { icon: Lightbulb, title: "Local innovation", text: "Real community challenges, solution proposals, case studies and prototypes, with only verified outcomes reported." },
  { icon: Layers, title: "Run responsibly", text: "Role-based tools let authorised staff manage courses, resources, experts, partners and inquiries." },
];

const principles = [
  ["Local impact first", "Education, agriculture, livelihoods, public services and community needs lead."],
  ["Learning connected to action", "Projects, activities and evidence of skills, not only certificates."],
  ["Built for Liberian conditions", "Mobile-first, lightweight pages, compressed files and offline downloads."],
  ["Trust and honesty", "Expert review before publication, sources and dates shown, no unsupported impact claims."],
  ["No implied endorsement", "No ministry or institution is shown as a partner until a formal agreement exists."],
  ["Hybrid by design", "Online first, growing into in-person classes, workshops and mentorship."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journey Empowering Solutions Through Technology"
        title="About JesTech Nexus"
        intro="A digital innovation and talent ecosystem where learning, local knowledge, expert consultation and partnerships come together to solve real challenges in Liberia. Nexus sits alongside JesTech Academy as part of one JesTech family."
      />
      <div className="container-page space-y-12 py-10">
        <section>
          <h2 className="text-2xl font-bold">The platform at a glance</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Card className="h-full p-5">
                  <IconTile>
                    <Icon className="size-5" />
                  </IconTile>
                  <h3 className="mt-3 font-display font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Guiding principles</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {principles.map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" aria-hidden />
                <p>
                  <strong>{t}.</strong> <span className="text-ink-muted">{d}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-card bg-ink p-8 text-center text-paper">
          <p className="eyebrow">The guiding principle</p>
          <p className="mx-auto mt-3 max-w-2xl font-display text-2xl font-bold">
            Help people learn, apply knowledge, access expertise, and contribute to solutions that matter locally.
          </p>
          <ButtonLink href="/register" className="mt-6">
            Join Nexus
          </ButtonLink>
        </section>
      </div>
    </>
  );
}
