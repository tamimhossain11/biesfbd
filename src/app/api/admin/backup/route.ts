import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Admin-only: download every table as one JSON file (works on any host, no disk needed).
export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return new Response("Forbidden", { status: 403 });

  const [registrations, notes, news, achievements, albums, photos, faqs, support, schedule, messages, settings, users] = await Promise.all([
    db.registration.findMany({ orderBy: { id: "asc" } }),
    db.note.findMany({ orderBy: { id: "asc" } }),
    db.newsPost.findMany({ orderBy: { id: "asc" } }),
    db.achievement.findMany({ orderBy: { id: "asc" } }),
    db.galleryAlbum.findMany({ orderBy: { id: "asc" } }),
    db.galleryPhoto.findMany({ orderBy: { id: "asc" } }),
    db.faq.findMany({ orderBy: { id: "asc" } }),
    db.supportItem.findMany({ orderBy: { id: "asc" } }),
    db.scheduleItem.findMany({ orderBy: { id: "asc" } }),
    db.contactMessage.findMany({ orderBy: { id: "asc" } }),
    db.setting.findMany(),
    db.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } }), // no password hashes
  ]);

  const body = JSON.stringify(
    { exportedAt: new Date().toISOString(), registrations, notes, news, achievements, albums, photos, faqs, support, schedule, messages, settings, users },
    null,
    1,
  );
  return new Response(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="biesf-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
