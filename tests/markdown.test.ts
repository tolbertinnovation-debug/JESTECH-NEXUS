import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { Markdown } from "@/components/markdown";

const html = (src: string) => renderToStaticMarkup(createElement(Markdown, { source: src }));

describe("Markdown", () => {
  it("renders bold, italic and inline code", () => {
    expect(html("A **bold** and *soft* `code` line")).toContain("<strong>bold</strong> and <em>soft</em> <code>code</code>");
  });
  it("renders bullet and numbered lists", () => {
    const out = html("- one\n- two\n\n1. first\n2. second");
    expect(out).toContain("<ul><li>one</li><li>two</li></ul>");
    expect(out).toContain("<ol><li>first</li><li>second</li></ol>");
  });
  it("renders fenced code verbatim", () => {
    expect(html("```\n<h1>x</h1>\n```")).toContain("<pre><code>&lt;h1&gt;x&lt;/h1&gt;</code></pre>");
  });
  it("never renders raw HTML from text", () => {
    expect(html('<img src=x onerror="alert(1)">')).not.toContain("<img");
  });
});
