/**
 * Flat illustrations for lesson videos, drawn in the JesTech palette.
 * Every scene is a 600x600 SVG built from small reusable parts.
 */
const C = {
  orange: "#FF6D00",
  orangeDark: "#C45400",
  tint: "#FFF1E6",
  ink: "#1A1A1A",
  soil: "#8B5A2B",
  soilLight: "#C68B59",
  soilPale: "#E3B98F",
  leaf: "#2E7D32",
  leafLight: "#66BB6A",
  sickLeaf: "#C0CA33",
  water: "#4FA3D9",
  waterLight: "#BFE1F6",
  stone: "#9E9E9E",
  white: "#FFFFFF",
  sky: "#FFF7F0",
};

const svg = (body, bg = C.sky) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">` +
  `<rect width="600" height="600" rx="36" fill="${bg}"/>${body}</svg>`;

/* ---------------------------------------------------------------- parts */

const sun = (x, y, r = 46) =>
  `<g><circle cx="${x}" cy="${y}" r="${r + 22}" fill="${C.orange}" opacity="0.15"/>` +
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.orange}"/></g>`;

const cloud = (x, y, s = 1, fill = "#FFFFFF") =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">` +
  `<ellipse cx="0" cy="0" rx="70" ry="34"/><circle cx="-34" cy="-14" r="34"/><circle cx="20" cy="-30" r="42"/><circle cx="58" cy="-6" r="28"/></g>`;

/** Palmate cassava leaf: 7 lobes fanning out from (x, y). */
function leaf(x, y, s = 1, color = C.leaf, rot = 0) {
  const lobes = [-75, -50, -25, 0, 25, 50, 75]
    .map((a, i) => {
      const len = [34, 44, 52, 56, 52, 44, 34][i];
      return `<ellipse cx="0" cy="${-len / 2}" rx="${len / 7}" ry="${len / 2}" transform="rotate(${a})"/>`;
    })
    .join("");
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="${color}">${lobes}</g>`;
}

/** A cassava plant: woody stem with nodes and a crown of leaves. */
function plant(x, groundY, h = 220, s = 1, sick = false) {
  const top = groundY - h;
  const nodes = Array.from({ length: Math.floor(h / 26) }, (_, i) => {
    const ny = groundY - 18 - i * 26;
    return `<rect x="${x - 7}" y="${ny}" width="14" height="3" rx="1.5" fill="${C.soil}" opacity="0.55"/>`;
  }).join("");
  const c = sick ? C.sickLeaf : C.leaf;
  const c2 = sick ? "#AFB42B" : C.leafLight;
  return (
    `<g><rect x="${x - 5}" y="${top + 20}" width="10" height="${h - 20}" rx="5" fill="#A1887F"/>${nodes}` +
    `<path d="M${x} ${top + 60} Q ${x - 40} ${top + 30} ${x - 70} ${top + 40}" stroke="#A1887F" stroke-width="5" fill="none"/>` +
    `<path d="M${x} ${top + 50} Q ${x + 40} ${top + 20} ${x + 72} ${top + 32}" stroke="#A1887F" stroke-width="5" fill="none"/>` +
    leaf(x - 72, top + 40, 0.9 * s, c2, -40) +
    leaf(x + 74, top + 32, 0.9 * s, c2, 40) +
    leaf(x - 28, top + 8, 1.05 * s, c, -15) +
    leaf(x + 30, top + 4, 1.05 * s, c, 18) +
    leaf(x, top - 6, 1.1 * s, c, 0) +
    `</g>`
  );
}

const ground = (y, color = C.soilLight, top = C.soil) =>
  `<rect x="0" y="${y}" width="600" height="${600 - y}" fill="${color}"/>` +
  `<rect x="0" y="${y}" width="600" height="10" fill="${top}" opacity="0.6"/>`;

const soilSpecks = (y0, y1) =>
  Array.from({ length: 40 }, (_, i) => {
    const x = (i * 97) % 580 + 10;
    const y = y0 + ((i * 53) % (y1 - y0));
    return `<circle cx="${x}" cy="${y}" r="${2 + (i % 3)}" fill="${C.soil}" opacity="0.35"/>`;
  }).join("");

const badge = (x, y, ok = true) =>
  `<g transform="translate(${x} ${y})"><circle r="36" fill="${ok ? C.leaf : C.orangeDark}"/>` +
  (ok
    ? `<path d="M-16 0 L-4 13 L18 -12" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M-13 -13 L13 13 M13 -13 L-13 13" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`) +
  `</g>`;

const label = (x, y, text, size = 30, color = C.ink, anchor = "middle", weight = 700) =>
  `<text x="${x}" y="${y}" font-family="Poppins, Inter, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${text}</text>`;

const root = (x, y, len = 90, rot = 30) =>
  `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="0" cy="${len / 2}" rx="${len / 5.5}" ry="${len / 2}" fill="#8D5524"/>` +
  `<ellipse cx="-4" cy="${len / 2}" rx="${len / 12}" ry="${len / 2.4}" fill="#A0663A" opacity="0.6"/></g>`;

const stemPiece = (x, y, len = 220) =>
  `<g transform="translate(${x} ${y})"><rect x="0" y="-11" width="${len}" height="22" rx="11" fill="#A1887F"/>` +
  Array.from({ length: 6 }, (_, i) => {
    const nx = 22 + i * ((len - 44) / 5);
    return `<circle cx="${nx}" cy="-6" r="5" fill="${C.soil}"/><rect x="${nx - 1.5}" y="-11" width="3" height="22" fill="${C.soil}" opacity="0.4"/>`;
  }).join("") +
  `</g>`;

const magnifier = (x, y, r = 70) =>
  `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#ffffff" fill-opacity="0.35" stroke="${C.ink}" stroke-width="12"/>` +
  `<rect x="${r * 0.62}" y="${r * 0.62}" width="${r * 0.9}" height="20" rx="10" transform="rotate(45 ${r * 0.62} ${r * 0.62})" fill="${C.ink}"/></g>`;

const drop = (x, y, s = 1) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -18 C 8 -6 12 2 12 8 A 12 12 0 0 1 -12 8 C -12 2 -8 -6 0 -18Z" fill="${C.water}"/>`;

/* --------------------------------------------------------------- scenes */

export const art = {
  site: () =>
    svg(
      sun(470, 120) +
        cloud(150, 130, 0.9) +
        ground(390) +
        soilSpecks(410, 590) +
        plant(170, 400, 200) +
        plant(330, 400, 170, 0.9) +
        `<path d="M40 470 h520" stroke="${C.soil}" stroke-width="4" stroke-dasharray="14 12" opacity="0.5"/>` +
        badge(510, 470),
    ),
  avoid: () =>
    svg(
      // three mini panels: flood, stones, sick plant
      `<rect x="30" y="60" width="540" height="150" rx="24" fill="${C.waterLight}"/>` +
        `<path d="M30 160 Q 120 140 210 160 T 390 160 T 570 160 V 186 a24 24 0 0 1 -24 24 H54 a24 24 0 0 1 -24 -24Z" fill="${C.water}"/>` +
        leaf(170, 140, 0.7, C.sickLeaf) +
        badge(520, 110, false) +
        `<rect x="30" y="230" width="540" height="150" rx="24" fill="${C.soilPale}"/>` +
        [80, 150, 230, 300, 380].map((sx, i) => `<ellipse cx="${sx}" cy="${330 - (i % 2) * 18}" rx="${34 + (i % 3) * 8}" ry="26" fill="${C.stone}"/>`).join("") +
        badge(520, 280, false) +
        `<rect x="30" y="400" width="540" height="150" rx="24" fill="${C.tint}"/>` +
        leaf(130, 505, 0.9, C.sickLeaf, -20) +
        leaf(250, 500, 0.9, C.sickLeaf, 15) +
        `<circle cx="120" cy="470" r="7" fill="#F9A825"/><circle cx="262" cy="462" r="6" fill="#F9A825"/>` +
        badge(520, 450, false),
    ),
  stems: () =>
    svg(
      ground(470) +
        plant(240, 480, 330, 1.1) +
        magnifier(440, 210, 78) +
        leaf(440, 225, 0.9, C.leaf) +
        badge(500, 400),
    ),
  cutting: () =>
    svg(
      stemPiece(60, 200, 340) +
        `<g fill="${C.ink}"><rect x="60" y="250" width="340" height="6" rx="3"/><rect x="60" y="238" width="6" height="30"/><rect x="394" y="238" width="6" height="30"/></g>` +
        label(230, 305, "20–25 cm", 38) +
        label(230, 345, "5–7 buds", 26, C.orangeDark) +
        // cutlass
        `<g transform="translate(330 440) rotate(-20)"><path d="M0 0 L190 -20 Q 230 -10 200 20 L0 22Z" fill="#CFD8DC" stroke="#90A4AE" stroke-width="4"/>` +
        `<rect x="-80" y="-4" width="86" height="28" rx="12" fill="${C.ink}"/></g>` +
        stemPiece(60, 480, 150) +
        stemPiece(60, 530, 150),
    ),
  mounds: () =>
    svg(
      sun(500, 100, 38) +
        ground(330) +
        [70, 200, 330, 460].map((mx) => `<path d="M${mx - 70} 430 Q ${mx} 330 ${mx + 70} 430Z" fill="${C.soil}"/>` + `<rect x="${mx - 4}" y="352" width="8" height="40" rx="4" fill="#A1887F"/>` + leaf(mx, 350, 0.5, C.leafLight)).join("") +
        `<path d="M0 500 Q 150 470 300 500 T 600 500 V 600 H0Z" fill="${C.soil}" opacity="0.6"/>` +
        `<path d="M40 560 h520" stroke="${C.white}" stroke-width="4" stroke-dasharray="16 14" opacity="0.7"/>` +
        label(300, 210, "Mounds or ridges", 34),
    ),
  rain: () =>
    svg(
      cloud(250, 150, 1.4, "#ECEFF1") +
        cloud(420, 190, 1, "#ECEFF1") +
        Array.from({ length: 14 }, (_, i) => drop(130 + (i % 7) * 55, 260 + Math.floor(i / 7) * 60 + (i % 2) * 20, 1)).join("") +
        ground(430) +
        soilSpecks(450, 590) +
        `<g transform="translate(300 445) rotate(-20)"><rect x="-9" y="-70" width="18" height="140" rx="9" fill="#A1887F"/></g>` +
        leaf(324, 376, 0.5, C.leafLight, 15),
    ),
  planting: () =>
    svg(
      `<rect x="40" y="40" width="330" height="330" rx="20" fill="${C.soilLight}"/>` +
        [0, 1, 2].map((r) => [0, 1, 2].map((c) => leaf(95 + c * 110, 105 + r * 110, 0.6, C.leaf)).join("")).join("") +
        `<g stroke="${C.ink}" stroke-width="4"><path d="M95 395 H205"/><path d="M95 385 V405 M205 385 V405"/></g>` +
        label(150, 440, "1 m", 30) +
        // cross-section of a cutting two-thirds buried
        `<rect x="400" y="200" width="170" height="370" rx="20" fill="${C.sky}"/>` +
        `<rect x="400" y="330" width="170" height="240" fill="${C.soilLight}"/><rect x="400" y="330" width="170" height="8" fill="${C.soil}" opacity="0.6"/>` +
        `<g transform="translate(485 360) rotate(-15)"><rect x="-10" y="-90" width="20" height="210" rx="10" fill="#A1887F"/>` +
        [-70, -30, 10, 50, 90].map((ny) => `<circle cx="5" cy="${ny}" r="5" fill="${C.soil}"/>`).join("") +
        `</g>` +
        `<path d="M425 260 L425 290 M415 270 L425 258 L435 270" stroke="${C.leaf}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        label(485, 470, "⅔", 46, C.white) +
        label(485, 510, "in soil", 24, C.white),
    ),
  care: () =>
    svg(
      ground(400) +
        soilSpecks(420, 590) +
        [110, 250, 390].map((px) => plant(px, 410, 130, 0.75)).join("") +
        // calendar
        `<g transform="translate(430 70)"><rect width="140" height="140" rx="16" fill="${C.white}" stroke="${C.ink}" stroke-width="6"/>` +
        `<rect width="140" height="40" rx="14" fill="${C.orange}"/><rect y="26" width="140" height="14" fill="${C.orange}"/>` +
        label(70, 108, "3–4", 44) +
        label(70, 132, "months", 18, C.ink, "middle", 600) +
        `</g>` +
        // hoe
        `<g transform="translate(520 470) rotate(25)"><rect x="-6" y="-170" width="12" height="190" rx="6" fill="#8D6E63"/><path d="M-6 -170 h-50 v26 h50Z" fill="#78909C"/></g>`,
    ),
  weeds: () =>
    svg(
      ground(400) +
        plant(300, 410, 170, 0.85) +
        [80, 150, 440, 520].map((wx) => `<g fill="#9CCC65">` + [-30, -12, 6, 24].map((a) => `<path d="M${wx} 405 q ${a} -50 ${a * 1.6} -80 q ${-a * 0.4} 40 ${-a * 1.6 + 6} 80Z"/>`).join("") + `</g>`).join("") +
        badge(110, 300, false) +
        badge(490, 300, false),
    ),
  mosaic: () =>
    svg(
      `<g transform="translate(250 330) scale(3.2)">` +
        leaf(0, 0, 1, C.sickLeaf) +
        `<g fill="#F9A825" opacity="0.9"><circle cx="-12" cy="-30" r="4"/><circle cx="8" cy="-40" r="3"/><circle cx="20" cy="-22" r="4"/><circle cx="-24" cy="-14" r="3"/><circle cx="2" cy="-18" r="3.5"/></g>` +
        `</g>` +
        magnifier(440, 160, 70) +
        // mealybugs
        [0, 1, 2].map((i) => `<ellipse cx="${410 + i * 34}" cy="${420 + (i % 2) * 18}" rx="14" ry="9" fill="#F5F5F5" stroke="#BDBDBD" stroke-width="3"/>`).join(""),
    ),
  harvest: () =>
    svg(
      ground(330) +
        soilSpecks(350, 590) +
        `<path d="M160 340 Q 300 260 440 340Z" fill="${C.soil}"/>` +
        plant(300, 300, 220, 0.9) +
        root(300, 330, 150, 25) +
        root(300, 330, 170, -10) +
        root(300, 330, 140, -40) +
        root(300, 330, 120, 50) +
        // gentle hands-up arrow
        `<path d="M520 470 V 330 M495 360 L520 330 L545 360" stroke="${C.orange}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    ),
  clock: () =>
    svg(
      `<g transform="translate(300 230)"><circle r="150" fill="${C.white}" stroke="${C.ink}" stroke-width="14"/>` +
        Array.from({ length: 12 }, (_, i) => `<rect x="-3" y="-138" width="6" height="18" fill="${C.ink}" transform="rotate(${i * 30})"/>`).join("") +
        `<rect x="-5" y="-100" width="10" height="100" rx="5" fill="${C.ink}" transform="rotate(60)"/><rect x="-5" y="-70" width="10" height="70" rx="5" fill="${C.orange}" transform="rotate(200)"/>` +
        `<circle r="12" fill="${C.ink}"/></g>` +
        label(300, 455, "2–3 days", 50) +
        root(150, 480, 110, 80) +
        root(470, 480, 110, -80),
    ),
  processing: () =>
    svg(
      root(110, 140, 150, -60) +
        `<path d="M250 170 h60 M290 150 l20 20 l-20 20" stroke="${C.ink}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        // peeled white roots
        `<ellipse cx="440" cy="170" rx="90" ry="30" fill="#FFF8E1" stroke="#E0C9A6" stroke-width="5"/>` +
        `<path d="M300 300 v40 M280 320 l20 20 l20 -20" stroke="${C.ink}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        // bowl of gari
        `<g transform="translate(180 450)"><ellipse cx="0" cy="-10" rx="120" ry="30" fill="#FFE0B2"/>` +
        Array.from({ length: 30 }, (_, i) => `<circle cx="${-100 + ((i * 37) % 200)}" cy="${-22 + ((i * 13) % 24)}" r="3" fill="#E6B980"/>`).join("") +
        `<path d="M-120 -10 Q 0 130 120 -10Z" fill="${C.orange}"/></g>` +
        label(180, 570, "Gari", 30) +
        // sack of flour
        `<g transform="translate(440 450)"><path d="M-70 -70 Q 0 -100 70 -70 L 90 90 Q 0 110 -90 90Z" fill="#EFEBE9" stroke="#BCAAA4" stroke-width="6"/></g>` +
        label(440, 470, "Flour", 30),
    ),
  market: () =>
    svg(
      // stall with striped awning
      `<rect x="70" y="200" width="460" height="300" fill="#8D6E63"/>` +
        Array.from({ length: 6 }, (_, i) => `<path d="M${60 + i * 80} 120 h80 v80 q -40 30 -80 0Z" fill="${i % 2 ? C.white : C.orange}"/>`).join("") +
        `<rect x="70" y="330" width="460" height="20" fill="#6D4C41"/>` +
        root(140, 280, 90, 70) +
        root(180, 300, 90, 80) +
        `<g transform="translate(330 320)"><ellipse rx="60" ry="16" fill="#FFE0B2"/><path d="M-60 0 Q 0 60 60 0Z" fill="${C.orange}"/></g>` +
        `<g transform="translate(460 320)"><ellipse rx="50" ry="14" fill="#FFF8E1"/><path d="M-50 0 Q 0 50 50 0Z" fill="${C.orangeDark}"/></g>` +
        // coins
        [0, 1, 2].map((i) => `<ellipse cx="${250 + i * 10}" cy="${540 - i * 12}" rx="40" ry="12" fill="#FBC02D" stroke="#F9A825" stroke-width="3"/>`).join(""),
    ),
  records: () =>
    svg(
      `<g transform="translate(300 300) rotate(-4)"><rect x="-190" y="-220" width="380" height="440" rx="18" fill="${C.white}" stroke="${C.ink}" stroke-width="8"/>` +
        `<rect x="-190" y="-220" width="380" height="70" rx="16" fill="${C.orange}"/>` +
        label(-95, -172, "Costs", 30, C.ink) +
        label(95, -172, "Income", 30, C.ink) +
        `<path d="M0 -150 V 200" stroke="${C.ink}" stroke-width="4"/>` +
        Array.from({ length: 7 }, (_, i) => `<path d="M-170 ${-110 + i * 45} H170" stroke="#BDBDBD" stroke-width="3"/>`).join("") +
        [0, 1, 2, 3].map((i) => `<rect x="-160" y="${-128 + i * 45}" width="${90 - i * 12}" height="10" rx="5" fill="#90A4AE"/><rect x="30" y="${-128 + i * 45}" width="${70 + i * 15}" height="10" rx="5" fill="${C.leaf}"/>`).join("") +
        `</g>` +
        `<g transform="translate(470 470) rotate(40)"><rect x="-12" y="-120" width="24" height="200" fill="#FBC02D"/><path d="M-12 80 L0 110 L12 80Z" fill="#5D4037"/></g>`,
    ),
};

/** Brand hero art (constellation, sun, hills, young tree) for title and end cards. */
export const heroArt = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">` +
  `<rect width="400" height="300" fill="#0d0d0d"/><g fill="none" stroke="#ff6d00" stroke-opacity="0.35"><circle cx="300" cy="95" r="78"/><circle cx="300" cy="95" r="62"/></g>` +
  `<circle cx="300" cy="95" r="46" fill="#ff6d00"/><g stroke="#d9d9d9" stroke-width="1.5" fill="none"><polyline points="40,62 110,96 175,52 245,108 300,95"/><line x1="110" y1="96" x2="135" y2="148"/><line x1="135" y1="148" x2="245" y2="108"/></g>` +
  `<g fill="#f2f2f2"><circle cx="40" cy="62" r="5"/><circle cx="110" cy="96" r="7"/><circle cx="175" cy="52" r="6"/><circle cx="135" cy="148" r="5"/><circle cx="245" cy="108" r="7"/></g>` +
  `<path d="M0 200 C 80 170, 160 190, 240 178 S 360 160, 400 172 V300 H0Z" fill="#222"/><path d="M0 226 C 90 205, 190 232, 280 214 S 370 204, 400 210 V300 H0Z" fill="#333"/>` +
  `<path d="M0 262 C 100 238, 220 262, 320 246 S 390 240, 400 244 V300 H0Z" fill="#ff6d00"/></svg>`;
