import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { SaveOfflineButton } from "@/components/offline";
import { Badge, buttonClass } from "@/components/ui";
import { formatBytes, licenceLabel, atLeastOne, PLACEHOLDER_SLUG } from "@/lib/format";
import { getResource, getResourceSlugs } from "@/modules/library/queries";
import { downloadHref } from "@/lib/storage";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return atLeastOne(await getResourceSlugs(), { slug: PLACEHOLDER_SLUG });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getResource((await params).slug);
  return r ? { title: r.title, description: r.description } : {};
}

export default async function ResourcePage({ params }: Props) {
  const r = await getResource((await params).slug);
  if (!r) notFound();

  const rows: Array<[string, string]> = [
    ["Author or source", r.source],
    ["Published", r.publishedOn ?? "Not known"],
    ["Licence", `${licenceLabel[r.licence]} — ${r.licenceNote}`],
    ["Format and size", `${r.format}, ${formatBytes(r.sizeBytes)}`],
    ["Language", r.language],
    ["Audience", r.audiences.join(", ") || "Everyone"],
    ["Reviewed by", r.reviewedBy ?? "Awaiting review"],
  ];

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href="/library" className="text-sm underline">
        ← Back to library
      </Link>
      <div className="mt-4">
        <Badge tone="tint">{r.subject}</Badge>
      </div>
      <h1 className="mt-2 text-3xl font-bold">{r.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">{r.description}</p>

      <table className="mt-6 w-full border-collapse text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-b border-line">
              <th scope="row" className="w-40 py-3 pr-4 text-left align-top font-semibold sm:w-56">
                {k}
              </th>
              <td className="py-3 text-ink-muted">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {r.readOnlineUrl && (
          <a href={r.readOnlineUrl} target="_blank" rel="noopener" className={buttonClass("primary")}>
            Read online
          </a>
        )}
        {r.downloadable && r.fileUrl && (
          <>
            <a href={downloadHref(r.fileUrl)} download className={buttonClass("secondary")}>
              <Download className="size-4" aria-hidden /> Download for offline ({formatBytes(r.sizeBytes)})
            </a>
            <SaveOfflineButton urls={[`/library/${r.slug}`, r.fileUrl]} title={r.title} label="Save in app" />
          </>
        )}
        <Link href={`/report?page=${encodeURIComponent(`/library/${r.slug}`)}`} className="text-sm text-subtle underline">
          Report an issue with this resource
        </Link>
      </div>
    </div>
  );
}
