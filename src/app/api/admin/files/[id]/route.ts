import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRIVATE_DIR, isBlobUrl, safeName } from "@/lib/storage";

const TYPES: Record<string, string> = { pdf: "application/pdf", jpg: "image/jpeg", png: "image/png" };

// A registration's uploaded file. Only logged-in team members can reach it.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSessionUser())) return new Response("Unauthorized", { status: 401 });
  const id = Number((await params).id);
  const reg = Number.isInteger(id) ? await db.registration.findUnique({ where: { id }, select: { regId: true, fileName: true, fileOriginal: true } }) : null;
  if (!reg?.fileName) return new Response("Not found", { status: 404 });

  // Vercel Blob: the URL has an unguessable random suffix and is only shown here, behind login.
  if (isBlobUrl(reg.fileName)) return NextResponse.redirect(reg.fileName, { headers: { "Cache-Control": "private, no-store" } });

  const name = safeName(reg.fileName);
  if (!name) return new Response("Not found", { status: 404 });
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
