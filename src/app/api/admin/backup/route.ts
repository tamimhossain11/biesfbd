import { readFile, rm } from "node:fs/promises";
import { getSessionUser } from "@/lib/auth";
import { snapshotDb } from "@/lib/backup";
import { db } from "@/lib/db";

// Admin-only: download a consistent snapshot of the whole database.
export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return new Response("Forbidden", { status: 403 });
  const file = await snapshotDb(db, `download-${Date.now()}.db`);
  const buf = await readFile(file);
  await rm(file, { force: true });
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.sqlite3",
      "Content-Disposition": `attachment; filename="biesf-backup-${new Date().toISOString().slice(0, 10)}.db"`,
      "Cache-Control": "no-store",
    },
  });
}
