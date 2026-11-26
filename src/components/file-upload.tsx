"use client";

import { useRef, useState } from "react";
import { CheckCircle2, CloudUpload, FileWarning } from "lucide-react";
import { formatBytes } from "@/lib/format";
import { UPLOAD_ACCEPT, UPLOAD_TYPES, safeFileName, uploadTypeOf, type StorageMode } from "@/lib/storage";

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; name: string; percent: number }
  | { kind: "done"; name: string; size: number }
  | { kind: "error"; message: string };

/** Sets a form field's value as if the admin had typed it. */
function setField(id: string, value: string, onlyIfEmpty = false) {
  const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!el || (onlyIfEmpty && el.value)) return;
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Upload a library file. On success it fills in the resource's file link, size and format
 * (and the read-online link for PDFs), so the admin only has to press Save.
 */
export function FileUpload({ mode, maxBytes }: { mode: StorageMode; maxBytes: number }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const input = useRef<HTMLInputElement>(null);

  if (mode === "none") {
    return (
      <p className="rounded-card border border-line bg-paper p-3 text-sm text-subtle">
        File uploads are not switched on yet: connect a Vercel Blob store to the project (see the deployment guide). You
        can still paste a link to a file below.
      </p>
    );
  }

  async function onPick(file: File) {
    const type = uploadTypeOf(file.name, file.type);
    if (!type)
      return setStatus({
        kind: "error",
        message: "Only PDF, EPUB, MP4/WebM video and MP3/M4A/OGG audio files can be uploaded.",
      });
    if (file.size > maxBytes)
      return setStatus({
        kind: "error",
        message: `This file is ${formatBytes(file.size)}. The limit is ${formatBytes(maxBytes)}.`,
      });
    setStatus({ kind: "uploading", name: file.name, percent: 0 });

    try {
      let url: string;
      if (mode === "blob") {
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(`library/${safeFileName(file.name, type)}`, file, {
          access: "public",
          handleUploadUrl: "/api/uploads",
          contentType: type,
          multipart: file.size > 20 * 1024 * 1024,
          onUploadProgress: ({ percentage }) =>
            setStatus({
              kind: "uploading",
              name: file.name,
              percent: Math.round(percentage),
            }),
        });
        url = blob.url;
      } else {
        url = await uploadLocal(file, (percent) => setStatus({ kind: "uploading", name: file.name, percent }));
      }

      const format = UPLOAD_TYPES[type]!.format;
      setField("fileUrl", url);
      setField("sizeBytes", String(file.size));
      setField("format", format);
      if (format === "PDF") setField("readOnlineUrl", url);
      setStatus({ kind: "done", name: file.name, size: file.size });
    } catch (e) {
      setStatus({
        kind: "error",
        message: (e as Error).message || "Upload failed. Check your connection and try again.",
      });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="rounded-card border border-dashed border-ink-soft bg-paper p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/90 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
          <CloudUpload className="size-4" aria-hidden />
          {status.kind === "done" ? "Replace file" : "Upload a file"}
          <input
            ref={input}
            type="file"
            accept={UPLOAD_ACCEPT}
            className="sr-only"
            data-testid="library-file-input"
            disabled={status.kind === "uploading"}
            onChange={(e) => {
              const f = e.currentTarget.files?.[0];
              if (f) void onPick(f);
            }}
          />
        </label>
        <span className="text-xs text-subtle">PDF, EPUB, video or audio · up to {Math.round(maxBytes / 1048576)} MB</span>
      </div>

      <div aria-live="polite" className="mt-3 text-sm empty:hidden">
        {status.kind === "uploading" && (
          <div>
            <p className="truncate">
              Uploading <strong>{status.name}</strong>… {status.percent}%
            </p>
            <div
              className="mt-1.5 h-2 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuenow={status.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full bg-brand transition-[width]" style={{ width: `${status.percent}%` }} />
            </div>
          </div>
        )}
        {status.kind === "done" && (
          <p className="flex items-start gap-1.5" data-testid="upload-done">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
            <span className="min-w-0">
              Uploaded <strong className="break-all">{status.name}</strong> ({formatBytes(status.size)}). Press{" "}
              <strong>Save</strong> to keep it.
            </span>
          </p>
        )}
        {status.kind === "error" && (
          <p className="flex items-start gap-1.5 text-red-700" role="alert">
            <FileWarning className="mt-0.5 size-4 shrink-0" aria-hidden />
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}

/** Uploads to this server's /api/uploads with progress (fetch can't report upload progress). */
function uploadLocal(file: File, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let body: { url?: string; error?: string } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* not JSON */
      }
      if (xhr.status === 200 && body.url) resolve(body.url);
      else reject(new Error(body.error ?? `Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}
