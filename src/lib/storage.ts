import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), "storage");
export const PRIVATE_DIR = path.join(STORAGE_DIR, "private");
export const MEDIA_DIR = path.join(STORAGE_DIR, "media");

const MAX_UPLOAD = 10 * 1024 * 1024;

function sniff(buf: Buffer): "pdf" | "jpg" | "png" | "webp" | null {
  if (buf.subarray(0, 4).toString() === "%PDF") return "pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

/** Save a student's project file (PDF/JPG/PNG, ≤10 MB) to private storage. */
export async function savePrivateUpload(file: File) {
  if (file.size === 0) return null;
  if (file.size > MAX_UPLOAD) throw new Error("File is larger than 10 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind || kind === "webp") throw new Error("Only PDF or JPG/PNG files are allowed.");
  await mkdir(PRIVATE_DIR, { recursive: true });
  const name = `${randomUUID()}.${kind}`;
  await writeFile(path.join(PRIVATE_DIR, name), buf);
  return { name, original: file.name.slice(0, 200) };
}

/** Save an admin-uploaded image as compressed WebP (max 1920px). Returns public URL. */
export async function saveMediaImage(file: File, maxWidth = 1920) {
  if (!file || file.size === 0) return null;
  if (file.size > 15 * 1024 * 1024) throw new Error("Image is larger than 15 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind || kind === "pdf") throw new Error("Please upload a JPG, PNG or WebP image.");
  await mkdir(MEDIA_DIR, { recursive: true });
  const name = `${randomUUID()}.webp`;
  const out = await sharp(buf)
    .rotate()
    .resize({ width: maxWidth, height: maxWidth, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  await writeFile(path.join(MEDIA_DIR, name), out);
  return `/media/${name}`;
}

/** Only allow plain generated file names (no traversal). */
export function safeName(name: string) {
  return /^[\w-]+\.(pdf|jpg|png|webp)$/.test(name) ? name : null;
}
