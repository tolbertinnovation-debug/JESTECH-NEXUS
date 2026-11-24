import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/inquiry-form";
import { Badge, Card } from "@/components/ui";
import { getChallenge, getInnovation } from "@/modules/directory/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { challenges } = await getInnovation();
  return challenges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getChallenge((await params).slug);
  return c ? { title: c.title, description: c.context } : {};
}

export default async function ChallengePage({ params }: Props) {
  const c = await getChallenge((await params).slug);
  if (!c) notFound();

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_24rem]">
      <article>
        <Link href="/innovation" className="text-sm underline">
          ← All challenges
        </Link>
        <div className="mt-4">
          <Badge tone={c.status === "OPEN" ? "dark" : "muted"}>{c.status === "OPEN" ? "Open challenge" : "Closed"}</Badge>
        </div>
        <h1 className="mt-2 text-3xl font-bold">{c.title}</h1>
        {c.community && <p className="mt-1 text-subtle">{c.community}</p>}
        <h2 className="mt-6 text-lg font-bold">The problem</h2>
        <p className="mt-2 text-ink-muted">{c.context}</p>
        <h2 className="mt-6 text-lg font-bold">What a good solution looks like</h2>
        <p className="mt-2 text-ink-muted">{c.goals}</p>
      </article>
      {c.status === "OPEN" && (
        <aside id="propose" className="scroll-mt-4">
          <Card className="p-5">
            <h2 className="text-lg font-bold">Propose a solution</h2>
            <p className="mt-1 mb-4 text-sm text-subtle">Individuals, teams, learners and organisations are welcome.</p>
            <InquiryForm type="SOLUTION" challenges={[{ id: c.id, title: c.title }]} defaultChallengeId={c.id} showOrganisation />
          </Card>
        </aside>
      )}
    </div>
  );
}
