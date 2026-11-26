import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, open, stat, writeFile } from "node:fs/promises";
import path from "node:path";

/** Folder for uploads when no cloud storage is connected. */
export function uploadDir(): string {
  return path.resolve(process.env.UPLOAD_DIR || ".data/uploads");
}

/** Stored names look like "cassava-guide-3f9a1c2b7d.pdf": no paths, no surprises. */
export const STORED_NAME = /^[a-z0-9-]{1,60}-[0-9a-f]{10}\.[a-z0-9]{2,5}$/;

export async function saveLocal(safeName: string, data: Uint8Array): Promise<string> {
  const dot = safeName.lastIndexOf(".");
  const name = `${safeName.slice(0, dot)}-${randomBytes(5).toString("hex")}${safeName.slice(dot)}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), data, { flag: "wx" });
  return name;
}

export async function localFile(name: string) {
  if (!STORED_NAME.test(name)) return null;
  const file = path.join(uploadDir(), name);
  try {
    const s = await stat(file);
    return s.isFile() ? { file, size: s.size } : null;
  } catch {
    return null;
  }
}

export async function readHead(file: string, bytes = 16): Promise<Uint8Array> {
  const fh = await open(file, "r");
  try {
    const buf = new Uint8Array(bytes);
    await fh.read(buf, 0, bytes, 0);
    return buf;
  } finally {
    await fh.close();
  }
}
