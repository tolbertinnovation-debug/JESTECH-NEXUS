"""Builds the sample library files in public/files from the seed content.

Usage: npx tsx scripts/dump-seed.ts > /tmp/seed.json && python3 scripts/build-sample-files.py /tmp/seed.json
Real files will replace these once JesTech supplies reviewed content.
"""
import json
import re
import sys
import zipfile
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

OUT = Path(__file__).resolve().parent.parent / "public" / "files"
ORANGE = HexColor("#FF6D00")

h1 = ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=20, leading=24, spaceAfter=6)
h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=14, leading=18, spaceBefore=12, spaceAfter=4, textColor=ORANGE)
h3 = ParagraphStyle("h3", fontName="Helvetica-Bold", fontSize=11, leading=14, spaceBefore=6, spaceAfter=2)
body = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, spaceAfter=4)
note = ParagraphStyle("note", parent=body, fontSize=8.5, textColor=HexColor("#5c5c5c"))


def inline(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


def md_flowables(md: str):
    out, bullets = [], []

    def flush():
        if bullets:
            out.append(ListFlowable([ListItem(Paragraph(inline(b), body)) for b in bullets], bulletType="bullet", leftIndent=12))
            bullets.clear()

    for block in md.split("\n"):
        line = block.strip()
        if line.startswith("- "):
            bullets.append(line[2:])
            continue
        flush()
        if not line:
            continue
        if line.startswith("### "):
            out.append(Paragraph(inline(line[4:]), h3))
        elif line.startswith("Draft lesson"):
            continue
        else:
            out.append(Paragraph(inline(line), body))
    flush()
    return out


def build_pdf(path: Path, title: str, subtitle: str, sections):
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=18 * mm, bottomMargin=18 * mm, title=title, author="JesTech")
    story = [Paragraph("JesTech Nexus", ParagraphStyle("brand", parent=h3, textColor=ORANGE)), Paragraph(title, h1), Paragraph(subtitle, body)]
    story.append(Paragraph("Draft for review. Content must be checked by qualified reviewers and tested with intended users before launch.", note))
    story.append(Spacer(1, 6))
    for heading, flowables in sections:
        story.append(Paragraph(heading, h2))
        story.extend(flowables)
    doc.build(story)


def build_epub(path: Path, title: str, chapters):
    with zipfile.ZipFile(path, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>', compress_type=zipfile.ZIP_DEFLATED)
        items, spine, nav = [], [], []
        for i, (heading, html) in enumerate(chapters, 1):
            name = f"ch{i}.xhtml"
            z.writestr(f"OEBPS/{name}", f'<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>{heading}</title></head><body><h1>{heading}</h1>{html}</body></html>', compress_type=zipfile.ZIP_DEFLATED)
            items.append(f'<item id="c{i}" href="{name}" media-type="application/xhtml+xml"/>')
            spine.append(f'<itemref idref="c{i}"/>')
            nav.append(f'<li><a href="{name}">{heading}</a></li>')
        z.writestr("OEBPS/nav.xhtml", f'<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol>{"".join(nav)}</ol></nav></body></html>', compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", f'<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">jestech-{path.stem}</dc:identifier><dc:title>{title}</dc:title><dc:language>en</dc:language><dc:creator>JesTech</dc:creator><meta property="dcterms:modified">2026-11-24T00:00:00Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>{"".join(items)}</manifest><spine>{"".join(spine)}</spine></package>', compress_type=zipfile.ZIP_DEFLATED)


def course(seed, slug):
    return next(c for c in seed["courses"] if c["slug"] == slug)


def main():
    seed = json.loads(Path(sys.argv[1]).read_text())
    OUT.mkdir(parents=True, exist_ok=True)

    cassava = course(seed, "grow-cassava")
    sections = []
    for i, m in enumerate(cassava["modules"], 1):
        flow = []
        for lesson in m["lessons"]:
            flow += md_flowables(lesson["body"])
            flow.append(Paragraph("<b>Checklist</b>", h3))
            flow.append(ListFlowable([ListItem(Paragraph("[ ]  " + inline(c), body)) for c in lesson["checklist"]], bulletType="bullet", start="", leftIndent=12))
        sections.append((f"{i}. {m['title']}", flow))
    build_pdf(OUT / "cassava-field-guide.pdf", "Cassava Production Field Guide", cassava["audience"], sections)

    def outline_pdf(name, title, slug):
        c = course(seed, slug)
        secs = [(f"{i}. {m['title']}", [Paragraph(inline(m["lessons"][0]["summary"]), body)]) for i, m in enumerate(c["modules"], 1)]
        build_pdf(OUT / name, title, c["summary"], secs)

    outline_pdf("teachers-guide-digital-literacy.pdf", "Teacher's Guide to Digital Literacy", "digital-literacy-for-teachers")
    outline_pdf("intro-cybersecurity-awareness.pdf", "Introduction to Cybersecurity Awareness", "cybersecurity-awareness")

    biz = course(seed, "start-a-small-business")
    build_epub(OUT / "small-business-workbook.epub", "Starting a Small Business: Workbook", [(m["title"], f"<p>{m['lessons'][0]['summary']}</p>") for m in biz["modules"]])

    for f in sorted(OUT.iterdir()):
        print(f.name, f.stat().st_size)


if __name__ == "__main__":
    main()
