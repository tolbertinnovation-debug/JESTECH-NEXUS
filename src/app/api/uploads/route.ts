import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentUser } from "@/lib/auth";
import { saveLocal } from "@/lib/local-uploads";
import { can } from "@/lib/rbac";
import { UPLOAD_TYPES, looksLike, maxUploadBytes, safeFileName, storageMode, uploadTypeOf } from "@/lib/storage";

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function mayUpload() {
  const user = await getCurrentUser();
  return Boolean(user && can(user.role, "edit_content"));
}

const tooBig = () => `This file is too large. The limit is ${Math.round(maxUploadBytes() / 1024 / 1024)} MB.`;
const wrongType = "Only PDF, EPUB, MP4/WebM video and MP3/M4A/OGG audio files can be uploaded.";

/**
 * Library file uploads, for editors and admins.
 * - Vercel Blob: issues a short-lived token so the browser uploads straight to storage.
 * - Local disk: receives the file (multipart form, field "file") and stores it under UPLOAD_DIR.
 */
export async function POST(request: Request) {
  const mode = storageMode();
  if (mode === "none")
    return json(503, {
      error: "File uploads are not set up yet. Paste a link instead.",
    });

  if (mode === "blob") {
    let body: HandleUploadBody;
    try {
      body = (await request.json()) as HandleUploadBody;
    } catch {
      return json(400, { error: "Bad upload request." });
    }
    try {
      const result = await handleUpload({
        request,
        body,
        onBeforeGenerateToken: async (pathname) => {
          if (!(await mayUpload())) throw new Error("Not allowed");
          if (!pathname.startsWith("library/") || !uploadTypeOf(pathname, "")) throw new Error(wrongType);
          return {
            allowedContentTypes: Object.keys(UPLOAD_TYPES),
            maximumSizeInBytes: maxUploadBytes(),
            addRandomSuffix: true,
          };
        },
      });
      return json(200, result);
    } catch (e) {
      const msg = (e as Error).message;
      return json(msg === "Not allowed" ? 403 : 400, {
        error: msg === "Not allowed" ? "You can't upload files." : msg,
      });
    }
  }

  // Local disk.
  if (!(await mayUpload())) return json(403, { error: "You can't upload files." });
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxUploadBytes() + 64 * 1024) return json(413, { error: tooBig() });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return json(400, { error: "Choose a file to upload." });
  if (file.size > maxUploadBytes()) return json(413, { error: tooBig() });
  const type = uploadTypeOf(file.name, file.type);
  if (!type) return json(415, { error: wrongType });
  const data = new Uint8Array(await file.arrayBuffer());
  if (!looksLike(type, data.subarray(0, 16))) {
    return json(415, {
      error: `This file doesn't look like a real ${UPLOAD_TYPES[type]!.ext.toUpperCase()} file.`,
    });
  }
  const name = await saveLocal(safeFileName(file.name, type), data);
  return json(200, {
    url: `/uploads/${name}`,
    size: file.size,
    contentType: type,
  });
}
