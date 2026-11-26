/**
 * Where uploaded library files are stored.
 *
 *  - "blob":  Vercel Blob (production). Turned on by connecting a Blob store to the Vercel
 *             project, which sets BLOB_READ_WRITE_TOKEN. Files go straight from the admin's
 *             browser to storage, so large PDFs and videos skip the server's request size limit.
 *  - "local": a folder on the server's disk (development, CI, or a self-hosted server).
 *             Set UPLOAD_DIR to choose the folder (default .data/uploads).
 *  - "none":  on Vercel without a Blob store: uploads are off; admins can still paste a link.
 *
 * This file has no server-only imports so the rules below can be shared with the browser.
 */

export type StorageMode = "blob" | "local" | "none";

export function storageMode(): StorageMode {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.VERCEL) return "none";
  return "local";
}

/** Largest upload accepted, in bytes (UPLOAD_MAX_MB, default 100 MB). */
export function maxUploadBytes(): number {
  const mb = Number(process.env.UPLOAD_MAX_MB ?? 100);
  return Math.round((Number.isFinite(mb) && mb > 0 ? mb : 100) * 1024 * 1024);
}

export type UploadFormat = "PDF" | "EPUB" | "VIDEO" | "AUDIO";

/** File types the library accepts: MIME type → extension and library format. */
export const UPLOAD_TYPES: Record<string, { ext: string; format: UploadFormat }> = {
  "application/pdf": { ext: "pdf", format: "PDF" },
  "application/epub+zip": { ext: "epub", format: "EPUB" },
  "video/mp4": { ext: "mp4", format: "VIDEO" },
  "video/webm": { ext: "webm", format: "VIDEO" },
  "audio/mpeg": { ext: "mp3", format: "AUDIO" },
  "audio/mp4": { ext: "m4a", format: "AUDIO" },
  "audio/ogg": { ext: "ogg", format: "AUDIO" },
};

const BY_EXT: Record<string, string> = Object.fromEntries(
  Object.entries(UPLOAD_TYPES).map(([type, v]) => [v.ext, type]),
);
BY_EXT["m4v"] = "video/mp4";
BY_EXT["oga"] = "audio/ogg";

/** Accept attribute for the file picker. */
export const UPLOAD_ACCEPT = [...Object.keys(UPLOAD_TYPES), ...Object.keys(BY_EXT).map((e) => `.${e}`)].join(",");

/**
 * Works out a file's type from its reported MIME type, falling back to its extension
 * (some browsers report EPUB or M4A files as "" or application/octet-stream).
 */
export function uploadTypeOf(name: string, reported: string): string | null {
  const t = reported.toLowerCase().split(";")[0]!.trim();
  if (t === "audio/x-m4a") return "audio/mp4";
  if (UPLOAD_TYPES[t]) return t;
  const ext = name.toLowerCase().split(".").pop() ?? "";
  return BY_EXT[ext] ?? null;
}

/** A safe, readable file name: "Cassava Guide (v2).PDF" → "cassava-guide-v2.pdf". */
export function safeFileName(name: string, type: string): string {
  const ext = UPLOAD_TYPES[type]?.ext ?? "bin";
  const base = name
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}.${ext}`;
}

/**
 * Checks the first bytes of a file match its claimed type, so a renamed program or web page
 * can't be stored as a "PDF". Used where the server sees the file (local storage).
 */
export function looksLike(type: string, head: Uint8Array): boolean {
  const ascii = (from: number, to: number) => String.fromCharCode(...head.subarray(from, to));
  switch (type) {
    case "application/pdf":
      return ascii(0, 5) === "%PDF-";
    case "application/epub+zip":
      return head[0] === 0x50 && head[1] === 0x4b; // ZIP ("PK")
    case "video/mp4":
    case "audio/mp4":
      return ascii(4, 8) === "ftyp";
    case "video/webm":
      return head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3;
    case "audio/ogg":
      return ascii(0, 4) === "OggS";
    case "audio/mpeg":
      return ascii(0, 3) === "ID3" || (head[0] === 0xff && (head[1]! & 0xe0) === 0xe0);
    default:
      return false;
  }
}

/** Link that makes the browser save the file rather than open it (Blob and local uploads). */
export function downloadHref(url: string): string {
  const isBlob = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(url);
  if (!isBlob && !url.startsWith("/uploads/")) return url;
  return url + (url.includes("?") ? "&" : "?") + "download=1";
}
