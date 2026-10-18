import { readFile } from "node:fs/promises";
import path from "node:path";
import { MEDIA_DIR, safeName } from "@/lib/storage";

// Serves admin-uploaded images (news, gallery, achievements). File names are random UUIDs.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = safeName((await params).name);
  if (!name || !name.endsWith(".webp")) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(MEDIA_DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
