import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

/**
 * Two storage backends:
 * - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (Vercel, no persistent disk).
 * - Local disk under ./storage otherwise (local dev, VPS).
 */
export const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), "storage");
export const PRIVATE_DIR = path.join(STORAGE_DIR, "private");
export const MEDIA_DIR = path.join(STORAGE_DIR, "media");

export const MAX_UPLOAD = 10 * 1024 * 1024;
export const UPLOAD_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const REG_UPLOAD_PREFIX = "registrations/";

function sniff(buf: Buffer): "pdf" | "jpg" | "png" | "webp" | null {
  if (buf.subarray(0, 4).toString() === "%PDF") return "pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "webp";
  return null;
}

export const isBlobUrl = (u: string) => {
  try {
    return new URL(u).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
};

/** Accept a blob URL produced by our own client upload of a registration file. */
export function validRegistrationBlobUrl(u: string) {
  if (!isBlobUrl(u)) return false;
  const { pathname } = new URL(u);
  return pathname.startsWith(`/${REG_UPLOAD_PREFIX}`);
}

/** Save a student's project file (PDF/JPG/PNG, ≤10 MB) to local private storage. */
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

/** Save an admin-uploaded image as compressed WebP (max `maxWidth` px). Returns its public URL. */
export async function saveMediaImage(file: File, maxWidth = 1920) {
  if (!file || file.size === 0) return null;
  if (file.size > 15 * 1024 * 1024) throw new Error("Image is larger than 15 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind || kind === "pdf") throw new Error("Please upload a JPG, PNG or WebP image.");
  const out = await sharp(buf)
    .rotate()
    .resize({ width: maxWidth, height: maxWidth, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer();
  const name = `${randomUUID()}.webp`;
  if (useBlob()) {
    const blob = await put(`media/${name}`, out, { access: "public", contentType: "image/webp", cacheControlMaxAge: 31536000 });
    return blob.url;
  }
  await mkdir(MEDIA_DIR, { recursive: true });
  await writeFile(path.join(MEDIA_DIR, name), out);
  return `/media/${name}`;
}

/** Delete a stored file: a blob URL, a "/media/x.webp" path or a private file name. */
export async function removeStored(ref: string | null | undefined) {
  if (!ref) return;
  try {
    if (isBlobUrl(ref)) {
      if (useBlob()) await del(ref);
      return;
    }
    if (ref.startsWith("/media/")) {
      const name = safeName(ref.slice(7));
      if (name) await rm(path.join(MEDIA_DIR, name), { force: true });
      return;
    }
    const name = safeName(ref);
    if (name) await rm(path.join(PRIVATE_DIR, name), { force: true });
  } catch (e) {
    console.error("[storage] delete failed", ref, e);
  }
}

/** Only allow plain generated file names (no traversal). */
export function safeName(name: string) {
  return /^[\w-]+\.(pdf|jpg|png|webp)$/.test(name) ? name : null;
}

