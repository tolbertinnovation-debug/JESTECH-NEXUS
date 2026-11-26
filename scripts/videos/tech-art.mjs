/**
 * Illustrations for the technology, business and teaching lesson videos.
 * Built from Lucide icons (ISC licence, same set as the website) plus simple drawn
 * devices, documents and charts in the JesTech palette. Every scene is a 600x600 SVG.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const ICON_DIR = path.join(path.dirname(require.resolve("lucide-static/package.json")), "icons");

const C = {
  orange: "#FF6D00",
  orangeDark: "#C45400",
  tint: "#FFF1E6",
  sky: "#FFF7F0",
  ink: "#1A1A1A",
  white: "#FFFFFF",
  mist: "#F1F1F1",
  line: "#E0E0E0",
  muted: "#8A8A8A",
  green: "#2E7D32",
  red: "#C62828",
  blue: "#1E6FB8",
};

const cache = new Map();
function iconInner(name) {
  if (!cache.has(name)) {
    const raw = readFileSync(path.join(ICON_DIR, `${name}.svg`), "utf8");
    cache.set(name, raw.replace(/<!--.*?-->/gs, "").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""));
  }
  return cache.get(name);
}

/** A Lucide icon centred at (x, y), `size` px wide. */
const icon = (name, x, y, size, color = C.ink, sw = 2) =>
  `<g transform="translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${iconInner(name)}</g>`;

const svg = (body, bg = C.sky) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600"><rect width="600" height="600" rx="36" fill="${bg}"/>${body}</svg>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = (x, y, s, size = 26, color = C.ink, weight = 700, anchor = "middle", mono = false) =>
  `<text x="${x}" y="${y}" font-family="${mono ? "ui-monospace, Menlo, Consolas, monospace" : "Poppins, Inter, sans-serif"}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${esc(s)}</text>`;

const card = (x, y, w, h, fill = C.white, r = 22) =>
  `<rect x="${x + 4}" y="${y + 8}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity="0.06"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${C.line}" stroke-width="2"/>`;

const circle = (x, y, r, fill = C.orange) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

const chip = (x, y, label, fill = C.ink, color = C.white, size = 22) => {
  const w = label.length * size * 0.58 + 36;
  return `<rect x="${x - w / 2}" y="${y - size}" width="${w}" height="${size * 1.75}" rx="${size * 0.88}" fill="${fill}"/>${text(x, y + size * 0.18, label, size, color, 700)}`;
};

const tick = (x, y, ok = true, r = 26) =>
  `<g transform="translate(${x} ${y})"><circle r="${r}" fill="${ok ? C.green : C.red}"/>` +
  (ok
    ? `<path d="M-${r * 0.45} 0 L-${r * 0.1} ${r * 0.36} L${r * 0.5} -${r * 0.34}" stroke="#fff" stroke-width="${r * 0.22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M-${r * 0.36} -${r * 0.36} L${r * 0.36} ${r * 0.36} M${r * 0.36} -${r * 0.36} L-${r * 0.36} ${r * 0.36}" stroke="#fff" stroke-width="${r * 0.22}" stroke-linecap="round"/>`) +
  `</g>`;

/** Phone frame; `inner` is drawn in the screen's coordinate space (origin = screen top-left). */
const phone = (x, y, w, h, inner = "", screen = C.white) =>
  `<rect x="${x + 6}" y="${y + 10}" width="${w}" height="${h}" rx="${w * 0.14}" fill="#000" opacity="0.08"/>` +
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w * 0.14}" fill="${C.ink}"/>` +
  `<rect x="${x + 12}" y="${y + 34}" width="${w - 24}" height="${h - 60}" rx="10" fill="${screen}"/>` +
  `<rect x="${x + w / 2 - 22}" y="${y + 14}" width="44" height="8" rx="4" fill="#444"/>` +
  `<g transform="translate(${x + 12} ${y + 34})">${inner}</g>`;

/** Browser window; `inner` origin = page content top-left. */
const browser = (x, y, w, h, inner = "", url = "your-site.com") =>
  card(x, y, w, h, C.white, 18) +
  `<path d="M${x} ${y + 18} a18 18 0 0 1 18 -18 h${w - 36} a18 18 0 0 1 18 18 v28 h-${w}z" fill="${C.ink}"/>` +
  circle(x + 24, y + 23, 6, "#FF5F57") +
  circle(x + 44, y + 23, 6, "#FEBC2E") +
  circle(x + 64, y + 23, 6, "#28C840") +
  `<rect x="${x + 88}" y="${y + 12}" width="${w - 108}" height="22" rx="11" fill="#333"/>` +
  text(x + 104, y + 29, url, 14, "#ddd", 500, "start") +
  `<g transform="translate(${x} ${y + 46})">${inner}</g>`;

const codeLines = (x, y, lines, size = 20, gap = 32) =>
  lines.map(([t, color = C.ink], i) => text(x, y + i * gap, t, size, color, 600, "start", true)).join("");

const bars = (x, y, w, values, colors) =>
  values
    .map((v, i) => {
      const bw = w / values.length - 14;
      return `<rect x="${x + i * (bw + 14)}" y="${y - v}" width="${bw}" height="${v}" rx="6" fill="${colors?.[i] ?? C.orange}"/>`;
    })
    .join("");

/** Generic composition: a big orange medallion with the main icon, and satellite icon cards. */
function hero(main, satellites = [], caption) {
  const spots = [
    [470, 105],
    [470, 245],
    [105, 420],
    [470, 385],
  ];
  return svg(
    `<circle cx="270" cy="260" r="190" fill="${C.orange}" opacity="0.12"/>` +
      circle(270, 260, 140) +
      icon(main, 270, 260, 150, C.ink, 1.8) +
      satellites
        .map(([name, color = C.ink, ok], i) => {
          const [sx, sy] = spots[i];
          return card(sx - 55, sy - 55, 110, 110) + icon(name, sx, sy, 58, color, 2) + (ok === undefined ? "" : tick(sx + 44, sy - 44, ok, 18));
        })
        .join("") +
      (caption ? chip(270, 520, caption) : ""),
  );
}

/* ----------------------------------------------------------------- scenes */

export const techArt = {
  /* AI literacy */
  "ai-what": () => hero("brain-circuit", [["message-square-text"], ["languages"], ["scan-face"]], "Learns from examples"),
  "ai-limits": () => hero("bot", [["triangle-alert", C.orangeDark], ["map-pin"], ["search-check", C.green]], "Always check"),
  "ai-prompt": () =>
    svg(
      card(70, 70, 460, 460) +
        text(300, 125, "A good prompt", 30) +
        [
          ["Task", "Explain the steps…"],
          ["Context", "I teach in Gbarnga…"],
          ["Details", "Simple English, short"],
          ["Format", "5 bullet points"],
        ]
          .map(([k, v], i) => chip(170, 200 + i * 86, k, i % 2 ? C.ink : C.orange, i % 2 ? C.white : C.ink, 22) + text(245, 207 + i * 86, v, 22, C.ink, 500, "start"))
          .join(""),
    ),
  "ai-chat": () =>
    svg(
      phone(170, 50, 260, 500, [
        `<rect x="70" y="30" width="150" height="54" rx="16" fill="${C.orange}"/>`,
        text(145, 64, "Explain…", 20, C.ink, 600),
        `<rect x="16" y="104" width="190" height="96" rx="16" fill="${C.mist}"/>`,
        `<rect x="34" y="126" width="140" height="10" rx="5" fill="#bbb"/><rect x="34" y="148" width="150" height="10" rx="5" fill="#bbb"/><rect x="34" y="170" width="100" height="10" rx="5" fill="#bbb"/>`,
        `<rect x="70" y="222" width="150" height="54" rx="16" fill="${C.orange}"/>`,
        text(145, 256, "Shorter?", 20, C.ink, 600),
        `<rect x="16" y="298" width="170" height="70" rx="16" fill="${C.mist}"/>`,
        `<rect x="34" y="320" width="120" height="10" rx="5" fill="#bbb"/><rect x="34" y="342" width="90" height="10" rx="5" fill="#bbb"/>`,
      ].join("")) + card(440, 380, 110, 110) + icon("lock", 495, 435, 56, C.red),
    ),
  "ai-check": () => hero("search-check", [["file-text"], ["book-open-check", C.green], ["user-check"]], "Check facts & sources"),
  "ai-bias": () => hero("scale", [["users"], ["map-pin"], ["circle-help"]], "Does it fit us?"),
  "ai-study": () => hero("graduation-cap", [["sparkles", C.orange], ["notebook-pen"], ["mail"]], "Learn, don't copy"),
  "ai-honest": () => hero("shield-check", [["copy-x", C.red, false], ["pen-line", C.green, true], ["eye"]], "Make it yours"),
  privacy: () => hero("lock", [["key-round", C.ink, false], ["id-card", C.ink, false], ["users", C.ink, false]], "Never share"),
  deepfake: () => hero("audio-lines", [["phone-incoming", C.red], ["triangle-alert", C.orangeDark], ["phone-outgoing", C.green]], "Call back to check"),
  "ai-project": () => hero("rocket", [["lightbulb"], ["bot"], ["list-checks", C.green]], "Plan, check, submit"),

  /* Web development */
  "web-how": () =>
    svg(
      phone(40, 170, 140, 260, text(58, 110, "URL", 22, C.ink)) +
        `<path d="M200 300 H250" stroke="${C.ink}" stroke-width="6" stroke-dasharray="10 8"/><path d="M240 288 l14 12 l-14 12" stroke="${C.ink}" stroke-width="6" fill="none"/>` +
        circle(300, 300, 62) +
        icon("globe", 300, 300, 80) +
        `<path d="M374 300 H424" stroke="${C.ink}" stroke-width="6" stroke-dasharray="10 8"/><path d="M414 288 l14 12 l-14 12" stroke="${C.ink}" stroke-width="6" fill="none"/>` +
        card(440, 230, 120, 140) +
        icon("server", 500, 300, 70) +
        text(110, 470, "Browser", 24) +
        text(300, 410, "Internet", 24) +
        text(500, 410, "Server", 24),
    ),
  "web-three": () =>
    svg(
      [
        ["HTML", "file-code", "Content", C.orange],
        ["CSS", "palette", "The look", C.ink],
        ["JS", "mouse-pointer-click", "Behaviour", C.blue],
      ]
        .map(([t, ic, sub, col], i) => {
          const x = 40 + i * 180;
          return card(x, 140, 160, 320) + circle(x + 80, 230, 52, col) + icon(ic, x + 80, 230, 56, C.white) + text(x + 80, 340, t, 34) + text(x + 80, 384, sub, 20, C.muted, 600);
        })
        .join(""),
    ),
  html: () =>
    svg(
      browser(40, 70, 520, 460,
        codeLines(30, 50, [
          ["<h1>Mary's Tailoring</h1>", C.orangeDark],
          ["<p>School uniforms</p>"],
          ['<a href="tel:…">Call</a>', C.blue],
          ['<img src="shop.jpg"', C.green],
          ['     alt="Our shop">', C.green],
        ], 21, 44) +
          `<rect x="30" y="270" width="460" height="2" fill="${C.line}"/>` +
          text(30, 320, "Mary's Tailoring", 30, C.ink, 700, "start") +
          text(30, 356, "School uniforms", 20, C.muted, 500, "start"),
        "index.html"),
    ),
  css: () =>
    svg(
      card(40, 70, 300, 300, C.ink) +
        codeLines(64, 120, [["h1 {", "#fff"], ["  color: #FF6D00;", C.orange], ["  font-size: 32px;", "#9fd"], ["}", "#fff"], ["p {", "#fff"], ["  line-height: 1.6;", "#9fd"], ["}", "#fff"]], 20, 34) +
        browser(250, 300, 310, 230, text(24, 64, "Mary's Tailoring", 26, C.orange, 700, "start") + `<rect x="24" y="96" width="240" height="10" rx="5" fill="#ccc"/><rect x="24" y="122" width="200" height="10" rx="5" fill="#ccc"/>`),
    ),
  "box-model": () =>
    svg(
      `<rect x="60" y="80" width="480" height="440" rx="10" fill="${C.tint}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="12 8"/>` +
        text(300, 120, "margin", 24, C.orangeDark) +
        `<rect x="120" y="150" width="360" height="320" rx="8" fill="${C.ink}"/>` +
        text(300, 186, "border", 22, C.white) +
        `<rect x="140" y="205" width="320" height="245" rx="6" fill="#d9ecff"/>` +
        text(300, 240, "padding", 22, C.blue) +
        `<rect x="190" y="265" width="220" height="150" rx="6" fill="${C.white}" stroke="${C.line}" stroke-width="2"/>` +
        text(300, 350, "content", 26),
    ),
  flex: () =>
    svg(
      `<rect x="50" y="170" width="500" height="200" rx="18" fill="${C.white}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="14 10"/>` +
        [0, 1, 2].map((i) => `<rect x="${80 + i * 160}" y="205" width="120" height="130" rx="14" fill="${[C.orange, C.ink, C.orange][i]}"/>`).join("") +
        [0, 1].map((i) => `<path d="M${208 + i * 160} 270 h24" stroke="${C.blue}" stroke-width="5"/><path d="M${208 + i * 160} 258 v24 M${232 + i * 160} 258 v24" stroke="${C.blue}" stroke-width="5"/>`).join("") +
        text(300, 140, "display: flex", 30, C.ink, 700, "middle", true) +
        text(300, 430, "gap", 26, C.blue, 700, "middle", true),
    ),
  responsive: () =>
    svg(
      card(40, 160, 300, 220, C.ink, 14) +
        `<rect x="52" y="172" width="276" height="180" rx="6" fill="${C.white}"/>` +
        [0, 1, 2].map((i) => `<rect x="${66 + i * 88}" y="210" width="76" height="110" rx="8" fill="${C.orange}" opacity="${1 - i * 0.2}"/>`).join("") +
        `<rect x="10" y="380" width="360" height="16" rx="8" fill="#555"/>` +
        phone(400, 140, 160, 320, [0, 1, 2].map((i) => `<rect x="14" y="${16 + i * 82}" width="108" height="70" rx="8" fill="${C.orange}" opacity="${1 - i * 0.2}"/>`).join("")) +
        text(190, 470, "Computer", 24) +
        text(480, 500, "Phone", 24),
    ),
  form: () =>
    svg(
      card(100, 60, 400, 480) +
        [["Your name", "Mary K."], ["Phone number", "0777 …"]]
          .map(([l, v], i) => text(140, 130 + i * 120, l, 22, C.ink, 700, "start") + `<rect x="140" y="${145 + i * 120}" width="320" height="56" rx="12" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>` + text(160, 182 + i * 120, v, 22, C.muted, 500, "start"))
          .join("") +
        `<rect x="140" y="400" width="320" height="64" rx="14" fill="${C.orange}"/>` +
        text(300, 441, "Send", 26) +
        circle(500, 90, 40, C.blue) +
        icon("accessibility", 500, 90, 50, C.white),
    ),
  js: () =>
    svg(
      browser(40, 60, 520, 270, `<rect x="140" y="50" width="240" height="64" rx="14" fill="${C.orange}"/>` + text(260, 91, "Show hours", 24) + text(260, 170, "Mon–Sat, 8am–6pm", 24, C.ink, 600)) +
        icon("mouse-pointer-click", 410, 200, 60) +
        card(40, 360, 520, 180, C.ink) +
        codeLines(66, 405, [['button.addEventListener(', "#9fd"], ['  "click", () => {', C.orange], ["    hours.hidden = !hours.hidden;", "#fff"], ["  });", "#9fd"]], 19, 32),
    ),
  publish: () => hero("rocket", [["file-code"], ["image-down", C.green], ["link"], ["smartphone"]], "Live on the web"),

  /* Cybersecurity */
  "security-why": () => hero("shield-alert", [["wallet"], ["message-circle"], ["user-round"]], "What attackers want"),
  password: () =>
    svg(
      card(60, 120, 480, 150) +
        text(90, 170, "Passphrase", 24, C.ink, 700, "start") +
        `<rect x="90" y="185" width="420" height="56" rx="12" fill="${C.mist}"/>` +
        text(110, 223, "river-mango-blue-taxi", 26, C.ink, 600, "start", true) +
        `<rect x="90" y="300" width="420" height="16" rx="8" fill="${C.line}"/><rect x="90" y="300" width="390" height="16" rx="8" fill="${C.green}"/>` +
        text(90, 350, "Strong: long and unique", 24, C.green, 700, "start") +
        circle(300, 460, 62) +
        icon("key-round", 300, 460, 70),
    ),
  "two-step": () =>
    svg(
      phone(190, 50, 220, 450, text(98, 120, "Login code", 22, C.muted, 600) + text(98, 190, "482 916", 40, C.ink, 700, "middle", true) + `<rect x="24" y="240" width="148" height="56" rx="14" fill="${C.orange}"/>` + text(98, 276, "Confirm", 22)) +
        card(430, 380, 120, 120) +
        icon("lock-keyhole", 490, 440, 64, C.green) +
        chip(300, 560, "Never share codes", C.red),
    ),
  phishing: () => hero("mail-warning", [["timer", C.red], ["gift", C.orangeDark], ["key-round", C.red, false], ["link", C.red, false]], "Signs of a scam"),
  "stop-check": () => hero("octagon-x", [["phone", C.green], ["badge-check", C.green], ["flag"]], "Stop · Check · Report"),
  momo: () =>
    svg(
      phone(150, 40, 240, 480, circle(108, 90, 52) + icon("wallet", 108, 90, 56) + text(108, 186, "Enter PIN", 22, C.muted, 600) + [0, 1, 2, 3].map((i) => circle(48 + i * 40, 230, 12, C.ink)).join("") + `<rect x="24" y="290" width="168" height="56" rx="14" fill="${C.ink}"/>` + text(108, 326, "Confirm", 22, C.white)) +
        card(420, 140, 130, 130) +
        icon("eye-off", 485, 205, 64, C.red) +
        card(420, 320, 130, 130) +
        icon("phone-call", 485, 385, 60, C.green) +
        chip(300, 570, "Your PIN is yours alone", C.ink),
    ),
  "phone-secure": () => hero("smartphone", [["lock"], ["refresh-cw", C.green], ["store"], ["map-pin"]], "Lock · Update · Back up"),

  /* Data analysis */
  question: () => hero("circle-help", [["search"], ["target"], ["clipboard-list"]], "Specific · Measurable · Useful"),
  spreadsheet: () => svg(sheet(60, 110, [["Date", "Market", "Item", "LRD"], ["1 Nov", "Red Light", "Rice", "250"], ["1 Nov", "Duala", "Rice", "240"], ["2 Nov", "Red Light", "Gari", "150"], ["2 Nov", "Duala", "Gari", "160"]])),
  clean: () =>
    svg(
      sheet(60, 110, [["Market", "Item", "Price"], ["Red Light", "Rice", "250"], ["redlight", "Rice", "USD 1.3"], ["Red Light", "Rice", "250"], ["Duala", "Gari", "15000"]]) +
        tick(520, 240, false, 22) +
        tick(520, 306, false, 22) +
        tick(520, 372, false, 22) +
        icon("eraser", 300, 520, 60, C.orange),
    ),
  backup: () => hero("copy", [["file-spreadsheet"], ["shield-check", C.green], ["notebook-pen"]], "Keep the raw data"),
  formula: () =>
    svg(
      `<rect x="50" y="90" width="500" height="70" rx="12" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>` +
        text(80, 137, "fx", 26, C.muted, 700, "start") +
        text(130, 137, "=AVERAGE(B2:B31)", 28, C.ink, 700, "start", true) +
        sheet(50, 200, [["Day", "Price"], ["Mon", "250"], ["Tue", "260"], ["Wed", "240"], ["Avg", "250"]], [false, false, false, false, true]),
    ),
  chart: () =>
    svg(
      card(50, 70, 500, 460) +
        text(300, 125, "Rice price by market (LRD)", 24) +
        `<path d="M110 450 H510 M110 450 V160" stroke="${C.ink}" stroke-width="3"/>` +
        bars(130, 450, 370, [180, 240, 150, 210], [C.ink, C.orange, C.ink, C.ink]) +
        ["A", "B", "C", "D"].map((l, i) => text(165 + i * 92, 485, l, 22, C.muted, 600)).join(""),
    ),
  present: () =>
    svg(
      `<rect x="60" y="70" width="480" height="330" rx="16" fill="${C.ink}"/>` +
        text(300, 130, "Answer first", 30, C.orange) +
        bars(150, 340, 300, [90, 160, 120], [C.white, C.orange, C.white]) +
        `<rect x="290" y="400" width="20" height="90" fill="${C.ink}"/><rect x="220" y="490" width="160" height="16" rx="8" fill="${C.ink}"/>` +
        icon("presentation", 110, 520, 60),
    ),

  /* Graphic design */
  principles: () =>
    svg(
      card(70, 70, 460, 460) +
        `<rect x="110" y="120" width="380" height="80" rx="10" fill="${C.ink}"/>` +
        `<rect x="110" y="230" width="240" height="22" rx="11" fill="#bbb"/><rect x="110" y="266" width="200" height="22" rx="11" fill="#bbb"/>` +
        `<rect x="110" y="330" width="170" height="150" rx="14" fill="${C.orange}"/><rect x="320" y="330" width="170" height="150" rx="14" fill="${C.orange}"/>` +
        `<path d="M110 100 V500" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 8"/>`,
    ),
  colour: () =>
    svg(
      [[C.orange, "Main"], [C.ink, "Accent"], ["#F5F5F5", "Neutral"], ["#FFFFFF", "Neutral"]]
        .map(([c, l], i) => card(60 + (i % 2) * 250, 80 + Math.floor(i / 2) * 230, 230, 200, c) + text(175 + (i % 2) * 250, 255 + Math.floor(i / 2) * 230, l, 22, c === C.ink ? C.white : C.ink))
        .join("") +
        chip(300, 560, "2–3 colours + neutrals"),
    ),
  type: () =>
    svg(
      text(200, 300, "Aa", 230, C.ink, 700) +
        `<rect x="380" y="140" width="170" height="34" rx="8" fill="${C.ink}"/><rect x="380" y="200" width="130" height="20" rx="6" fill="${C.orange}"/>` +
        [0, 1, 2, 3].map((i) => `<rect x="380" y="${250 + i * 30}" width="${170 - (i % 2) * 30}" height="12" rx="6" fill="#bbb"/>`).join("") +
        chip(300, 480, "1–2 fonts · clear sizes"),
    ),
  hierarchy: () =>
    svg(
      card(130, 40, 340, 520) +
        chip(300, 92, "1", C.orange, C.ink, 22) +
        `<rect x="170" y="120" width="260" height="90" rx="10" fill="${C.ink}"/>` +
        chip(300, 262, "2", C.orange, C.ink, 22) +
        `<rect x="170" y="290" width="220" height="18" rx="9" fill="#999"/><rect x="170" y="320" width="180" height="18" rx="9" fill="#999"/><rect x="170" y="350" width="200" height="18" rx="9" fill="#999"/>` +
        chip(300, 420, "3", C.orange, C.ink, 22) +
        `<rect x="170" y="450" width="260" height="62" rx="14" fill="${C.orange}"/>` +
        text(300, 490, "Call / Scan", 22),
    ),
  "mobile-design": () =>
    svg(
      phone(170, 25, 260, 500, `<rect x="0" y="0" width="236" height="440" fill="${C.ink}"/>` + text(118, 120, "FREE", 44, C.orange) + text(118, 170, "Health check", 28, C.white) + text(118, 212, "Saturday 9am", 22, "#ccc", 500) + `<rect x="38" y="330" width="160" height="56" rx="14" fill="${C.orange}"/>` + text(118, 366, "Call now", 22)) +
        chip(300, 562, "Few words · big text", C.ink, C.white, 20),
    ),
  tools: () => hero("pen-tool", [["layout-template"], ["image"], ["shapes"], ["type"]], "Free tools"),
  portfolio: () =>
    svg(
      [0, 1, 2, 3, 4, 5].map((i) => card(50 + (i % 3) * 172, 90 + Math.floor(i / 3) * 210, 150, 180, [C.orange, C.ink, C.tint, C.ink, C.tint, C.orange][i])).join("") +
        icon("briefcase", 300, 540, 56),
    ),

  /* Small business */
  idea: () => hero("lightbulb", [["search"], ["hammer"], ["sprout", C.green], ["shopping-basket"]], "Solve a real problem"),
  customer: () => hero("users", [["map-pin"], ["message-circle-heart", C.orange], ["hand-coins"]], "Talk to 10 people"),
  pricing: () =>
    svg(
      `<g transform="translate(300 230) rotate(-12)"><path d="M-170 -80 H120 L180 0 L120 80 H-170 a20 20 0 0 1 -20 -20 V-60 a20 20 0 0 1 20 -20Z" fill="${C.orange}"/>${circle(-140, 0, 16, C.sky)}${text(0, 18, "LRD 75", 56, C.ink)}</g>` +
        card(70, 380, 460, 150) +
        text(300, 435, "Cost 55 + Profit 20 = 75", 28, C.ink, 700) +
        text(300, 490, "Price must be above cost", 22, C.green, 700),
    ),
  plan: () =>
    svg(
      card(110, 40, 380, 520) +
        text(300, 95, "One-page plan", 28) +
        ["Idea", "Customers", "Price", "Costs", "Selling", "First steps"]
          .map((l, i) => `<rect x="140" y="${125 + i * 70}" width="12" height="48" rx="6" fill="${C.orange}"/>` + text(168, 157 + i * 70, l, 22, C.ink, 700, "start") + `<rect x="320" y="${143 + i * 70}" width="${130 - (i % 3) * 20}" height="12" rx="6" fill="#ccc"/>`)
          .join(""),
    ),
  records: () =>
    svg(
      card(80, 60, 440, 480) +
        sheetRows(110, 110, [["Date", "In", "Out"], ["Mon", "4,500", "1,200"], ["Tue", "3,800", "900"], ["Wed", "5,100", "2,000"]]) +
        `<rect x="110" y="440" width="380" height="64" rx="14" fill="${C.tint}"/>` +
        text(300, 482, "Profit = In − Out", 26, C.orangeDark),
    ),

  /* Teachers */
  devices: () => hero("folder-open", [["smartphone"], ["laptop"], ["hard-drive", C.green]], "Organise · Name · Back up"),
  resources: () => hero("library", [["search"], ["calendar-check"], ["badge-check", C.green], ["copyright"]], "Who? When? Accurate?"),
  "lesson-plan": () =>
    svg(
      `<rect x="130" y="70" width="340" height="470" rx="20" fill="#8D6E63"/><rect x="160" y="110" width="280" height="410" rx="10" fill="${C.white}"/>` +
        `<rect x="240" y="55" width="120" height="44" rx="10" fill="${C.ink}"/>` +
        ["Objective", "Starter", "Activity", "Check"].map((l, i) => tick(200, 170 + i * 90, true, 20) + text(232, 179 + i * 90, l, 26, C.ink, 700, "start")).join(""),
    ),
  "safety-kids": () => hero("shield-check", [["user-lock"], ["heart-handshake", C.orange], ["message-circle-warning", C.orangeDark], ["users"]], "Private · Kind · Tell an adult"),
  "low-data": () => hero("wifi-off", [["download", C.green], ["usb"], ["file-audio"], ["message-circle"]], "Download once, share offline"),
};

/** Spreadsheet grid: first row is the header. `highlight` marks rows in orange. */
function sheet(x, y, rows, highlight = []) {
  const cols = rows[0].length;
  const cw = 480 / cols;
  return (
    card(x, y, 480, rows.length * 66 + 10, C.white, 14) +
    rows
      .map((r, ri) =>
        r
          .map(
            (c, ci) =>
              `<rect x="${x + ci * cw + 5}" y="${y + 5 + ri * 66}" width="${cw - 10}" height="58" rx="8" fill="${ri === 0 ? C.ink : highlight[ri] ? C.tint : C.mist}"/>` +
              text(x + ci * cw + cw / 2, y + 44 + ri * 66, c, 21, ri === 0 ? C.white : C.ink, ri === 0 ? 700 : 600),
          )
          .join(""),
      )
      .join("")
  );
}

function sheetRows(x, y, rows) {
  const cw = 380 / rows[0].length;
  return rows
    .map((r, ri) => r.map((c, ci) => text(x + ci * cw + cw / 2, y + 40 + ri * 70, c, 26, ri === 0 ? C.orangeDark : C.ink, ri === 0 ? 700 : 600)).join("") + `<rect x="${x}" y="${y + 60 + ri * 70}" width="380" height="2" fill="${C.line}"/>`)
    .join("");
}
