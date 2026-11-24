import { Fragment, type ReactNode } from "react";

/**
 * Tiny, safe renderer for the lesson markdown subset: paragraphs, "### " headings,
 * "- " bullet lists and **bold**. Produces React elements only — never raw HTML.
 */
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
  );
}

export function Markdown({ source }: { source: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`}>
          {list.map((li, i) => (
            <li key={i}>{inline(li)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flush();
    if (!line) continue;
    if (line.startsWith("### ")) out.push(<h3 key={out.length}>{inline(line.slice(4))}</h3>);
    else out.push(<p key={out.length}>{inline(line)}</p>);
  }
  flush();
  return <div className="prose-lesson">{out}</div>;
}
