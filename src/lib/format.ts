export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null) return "Size unknown";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/** Blueprint language: "Small file" (< 2 MB), "Medium file" (< 10 MB), "Large file". */
export function sizeLabel(bytes: number | null | undefined): string {
  if (bytes == null) return "Size unknown";
  if (bytes < 2 * 1024 * 1024) return "Small file";
  if (bytes < 10 * 1024 * 1024) return "Medium file";
  return "Large file";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export const levelLabel = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;
export const formatLabel = { ONLINE: "Online", HYBRID: "Hybrid", OFFLINE_GUIDE: "Offline guide" } as const;
export const licenceLabel = {
  OWNED: "Owned by JesTech",
  PERMISSION: "Permission granted",
  OPEN_LICENCE: "Open licence",
} as const;

export function percent(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/** Only allow same-site relative redirects (prevents open redirects via ?next=). */
export function safeNext(next: unknown, fallback = "/dashboard"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/**
 * Cache Components requires generateStaticParams to return at least one entry. When the
 * database has no rows yet (e.g. a fresh production database), fall back to a placeholder
 * path that renders the not-found page, so the build never fails on empty content.
 */
export const PLACEHOLDER_SLUG = "__none__";
export function atLeastOne<T extends Record<string, string>>(params: T[], placeholder: T): T[] {
  return params.length > 0 ? params : [placeholder];
}
