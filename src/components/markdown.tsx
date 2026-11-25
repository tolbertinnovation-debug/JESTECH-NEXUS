import { Fragment, type ReactNode } from "react";

/**
 * Tiny, safe renderer for the lesson markdown subset: paragraphs, "### " headings,
 * "- " bullet lists, **bold**, `inline code` and ``` fenced code blocks.
 * Produces React elements only — never raw HTML, so lesson text can't inject markup.
 */
function inline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.length > 2 && p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  let code: string[] | null = null;
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
    if (raw.trim().startsWith("```")) {
      if (code) {
        out.push(
          <pre key={out.length}>
            <code>{code.join("\n")}</code>
          </pre>,
        );
        code = null;
      } else {
        flush();
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(raw);
      continue;
    }
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
