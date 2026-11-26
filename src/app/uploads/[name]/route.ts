import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { localFile } from "@/lib/local-uploads";
import { uploadTypeOf } from "@/lib/storage";

/**
 * Serves library files stored on the server's disk (when no cloud storage is connected).
 * Supports byte ranges so videos and audio can seek. ?download=1 saves instead of opening.
 */
export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const found = await localFile(name);
  if (!found) return new Response("Not found", { status: 404 });
  const type = uploadTypeOf(name, "") ?? "application/octet-stream";
  const url = new URL(request.url);

  const headers = new Headers({
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": url.searchParams.has("download") ? `attachment; filename="${name}"` : "inline",
  });

  let start = 0;
  let end = found.size - 1;
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(end, Number(range[2]));
    } else {
      start = Math.max(0, found.size - Number(range[2]));
    }
    if (start > end || start >= found.size) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${found.size}` },
      });
    }
    headers.set("Content-Range", `bytes ${start}-${end}/${found.size}`);
  }
  headers.set("Content-Length", String(end - start + 1));

  const body = Readable.toWeb(createReadStream(found.file, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(body, {
    status: range && (range[1] || range[2]) ? 206 : 200,
    headers,
  });
}
