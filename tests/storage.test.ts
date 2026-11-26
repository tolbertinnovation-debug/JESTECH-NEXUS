import { afterEach, describe, expect, it } from "vitest";
import { downloadHref, looksLike, maxUploadBytes, safeFileName, storageMode, uploadTypeOf } from "@/lib/storage";

const bytes = (s: string) => new TextEncoder().encode(s);

describe("upload storage mode", () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  it("uses Vercel Blob when a store is connected, local disk off Vercel, and nothing otherwise", () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.VERCEL;
    expect(storageMode()).toBe("local");
    process.env.VERCEL = "1";
    expect(storageMode()).toBe("none");
    process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_x";
    expect(storageMode()).toBe("blob");
  });

  it("reads the size limit from UPLOAD_MAX_MB", () => {
    delete process.env.UPLOAD_MAX_MB;
    expect(maxUploadBytes()).toBe(100 * 1024 * 1024);
    process.env.UPLOAD_MAX_MB = "5";
    expect(maxUploadBytes()).toBe(5 * 1024 * 1024);
    process.env.UPLOAD_MAX_MB = "nonsense";
    expect(maxUploadBytes()).toBe(100 * 1024 * 1024);
  });
});

describe("upload file types", () => {
  it("accepts library formats and falls back to the extension", () => {
    expect(uploadTypeOf("guide.pdf", "application/pdf")).toBe("application/pdf");
    expect(uploadTypeOf("book.epub", "")).toBe("application/epub+zip");
    expect(uploadTypeOf("talk.m4a", "audio/x-m4a")).toBe("audio/mp4");
    expect(uploadTypeOf("clip.MP4", "application/octet-stream")).toBe("video/mp4");
  });

  it("refuses everything else", () => {
    expect(uploadTypeOf("page.html", "text/html")).toBeNull();
    expect(uploadTypeOf("setup.exe", "application/octet-stream")).toBeNull();
    expect(uploadTypeOf("image.svg", "image/svg+xml")).toBeNull();
  });

  it("makes safe file names", () => {
    expect(safeFileName("Cassava Guide (v2).PDF", "application/pdf")).toBe("cassava-guide-v2.pdf");
    expect(safeFileName("../../etc/passwd.pdf", "application/pdf")).toBe("etc-passwd.pdf");
    expect(safeFileName("Café ñame.epub", "application/epub+zip")).toBe("cafe-name.epub");
    expect(safeFileName("???.mp3", "audio/mpeg")).toBe("file.mp3");
  });

  it("checks the file's first bytes match its type", () => {
    expect(looksLike("application/pdf", bytes("%PDF-1.7\n"))).toBe(true);
    expect(looksLike("application/pdf", bytes("<html><script>"))).toBe(false);
    expect(looksLike("application/epub+zip", bytes("PK\u0003\u0004"))).toBe(true);
    expect(looksLike("video/mp4", bytes("\u0000\u0000\u0000\u0018ftypmp42"))).toBe(true);
    expect(looksLike("audio/mpeg", bytes("ID3\u0004"))).toBe(true);
    expect(looksLike("audio/ogg", bytes("MZ\u0090\u0000"))).toBe(false);
  });

  it("adds ?download=1 only for uploaded files", () => {
    expect(downloadHref("https://abc123.public.blob.vercel-storage.com/library/guide-x1.pdf")).toBe(
      "https://abc123.public.blob.vercel-storage.com/library/guide-x1.pdf?download=1",
    );
    expect(downloadHref("/uploads/guide-0123456789.pdf")).toBe("/uploads/guide-0123456789.pdf?download=1");
    expect(downloadHref("/files/cassava-guide.pdf")).toBe("/files/cassava-guide.pdf");
    expect(downloadHref("https://example.org/book.pdf")).toBe("https://example.org/book.pdf");
  });
});
