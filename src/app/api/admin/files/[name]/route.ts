import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIVATE_DIR, safeName } from "@/lib/storage";

const TYPES: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", png: "image/png" };

// Student uploads are private: only logged-in team members can download them.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await getSessionUser())) return new Response("Unauthorized", { status: 401 });
  const name = safeName((await params).name);
  if (!name) return new Response("Not found", { status: 404 });
  const reg = await db.registration.findFirst({ where: { fileName: name }, select: { regId: true, fileOriginal: true } });
  if (!reg) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(PRIVATE_DIR, name));
    const ext = name.split(".").pop()!;
    const download = `${reg.regId}-${(reg.fileOriginal || name).replace(/[^\w.-]+/g, "_")}`;
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Content-Disposition": `inline; filename="${download}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
