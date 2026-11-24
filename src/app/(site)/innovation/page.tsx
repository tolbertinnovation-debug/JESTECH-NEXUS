import type { Metadata } from "next";
import Link from "next/link";
import { Badge, ButtonLink, Card, EmptyState, PageHeader } from "@/components/ui";
import { getInnovation } from "@/modules/directory/queries";

export const metadata: Metadata = {
  title: "Local innovation and impact",
  description: "Real community challenges, solution proposals, case studies and prototypes.",
};

export default async function InnovationPage() {
  const { challenges, items } = await getInnovation();
  const open = challenges.filter((c) => c.status === "OPEN");

  return (
    <>
      <PageHeader
        title="Local innovation and impact"
        intro="Real problems from local communities. Propose a solution and collaborate with experts and partners. Only verified activities and outcomes are reported."
      />
      <div className="container-page space-y-10 py-8">
        <section aria-labelledby="open-challenges">
          <h2 id="open-challenges" className="text-xl font-bold">
            Open challenges
          </h2>
          {open.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No open challenges right now" />
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {open.map((c) => (
                <li key={c.id}>
                  <Card className="flex h-full flex-col p-5">
                    <div>
                      <Badge tone="dark">Open challenge</Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-bold">
                      <Link href={`/innovation/challenges/${c.slug}`} className="hover:underline">
                        {c.title}
                      </Link>
                    </h3>
                    {c.community && <p className="text-sm text-subtle">{c.community}</p>}
                    <p className="mt-2 text-sm text-ink-muted">{c.context}</p>
                    <div className="mt-auto pt-4">
                      <ButtonLink href={`/innovation/challenges/${c.slug}#propose`} size="sm">
                        Propose a solution
                      </ButtonLink>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="showcase">
          <h2 id="showcase" className="text-xl font-bold">
            Case studies and prototypes
          </h2>
          {items.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Verified projects will be showcased here" />
            </div>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {items.map((i) => (
                <li key={i.id}>
                  <Card className="h-full p-5">
                    <Badge tone={i.type === "CASE_STUDY" ? "tint" : "muted"}>
                      {i.type === "CASE_STUDY" ? "Case study" : "Prototype"}
                    </Badge>
                    <h3 className="mt-3 font-display font-semibold">{i.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{i.summary}</p>
                    {i.sources.length > 0 && (
                      <p className="mt-2 text-xs text-subtle">Sources: {i.sources.join("; ")}</p>
                    )}
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
