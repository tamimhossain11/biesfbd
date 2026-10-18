"use server";

import bcrypt from "bcryptjs";
import { rm } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireUser } from "@/lib/auth";
import { STATUSES } from "@/lib/constants";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, saveSettings, type SiteSettings } from "@/lib/settings";
import { MEDIA_DIR, PRIVATE_DIR, safeName, saveMediaImage } from "@/lib/storage";
import { bool, int, slugify, str } from "@/lib/utils";

export type ActionState = { ok?: string; error?: string };

const files = (fd: FormData, k: string) => fd.getAll(k).filter((f): f is File => f instanceof File && f.size > 0);

async function removeMedia(url: string | null | undefined) {
  const name = url?.startsWith("/media/") ? safeName(url.slice(7)) : null;
  if (name) await rm(path.join(MEDIA_DIR, name), { force: true });
}

/** Keep an existing image, replace it with an upload, or clear it. */
async function imageField(fd: FormData, current: string | null) {
  const upload = files(fd, "image")[0];
  if (upload) {
    const url = await saveMediaImage(upload);
    await removeMedia(current);
    return url;
  }
  if (bool(fd, "removeImage")) {
    await removeMedia(current);
    return null;
  }
  return current;
}

/* ---------------- Registrations ---------------- */

export async function updateRegistration(id: number, fd: FormData) {
  const user = await requireUser();
  const status = str(fd, "status");
  const note = str(fd, "note").slice(0, 4000);
  const reg = await db.registration.findUnique({ where: { id } });
  if (!reg) return;
  const ops = [];
  if (status && status !== reg.status && (STATUSES as readonly string[]).includes(status)) {
    ops.push(db.registration.update({ where: { id }, data: { status } }));
    ops.push(db.note.create({ data: { registrationId: id, author: user.name, text: `Status: ${reg.status} → ${status}` } }));
  }
  if (note) ops.push(db.note.create({ data: { registrationId: id, author: user.name, text: note } }));
  if (ops.length) await db.$transaction(ops);
  revalidatePath(`/admin/registrations/${id}`);
}

export async function deleteRegistration(id: number) {
  await requireAdmin();
  const reg = await db.registration.delete({ where: { id } }).catch(() => null);
  const name = reg?.fileName ? safeName(reg.fileName) : null;
  if (name) await rm(path.join(PRIVATE_DIR, name), { force: true });
  redirect("/admin/registrations");
}

/* ---------------- News ---------------- */

export async function saveNews(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const title = str(fd, "title");
  if (title.length < 3) return { error: "Title is required." };
  const existing = id ? await db.newsPost.findUnique({ where: { id } }) : null;

  let slug = slugify(str(fd, "slug") || title);
  const clash = await db.newsPost.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (clash) slug = `${slug}-${Date.now().toString(36)}`;

  let image: string | null;
  try {
    image = await imageField(fd, existing?.image ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const publishedAtRaw = str(fd, "publishedAt");
  const data = {
    title,
    slug,
    kind: str(fd, "kind") === "Result" ? "Result" : "News",
    excerpt: str(fd, "excerpt").slice(0, 400),
    body: str(fd, "body"),
    published: bool(fd, "published"),
    // The form field is in Bangladesh time (UTC+6).
    publishedAt: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(publishedAtRaw) ? new Date(`${publishedAtRaw}:00+06:00`) : new Date(),
    image,
  };
  if (existing) await db.newsPost.update({ where: { id: existing.id }, data });
  else await db.newsPost.create({ data });
  revalidatePath("/admin/news");
  redirect("/admin/news?saved=1");
}

export async function deleteNews(id: number) {
  await requireUser();
  const post = await db.newsPost.delete({ where: { id } }).catch(() => null);
  await removeMedia(post?.image);
  revalidatePath("/admin/news");
}

/* ---------------- Achievements ---------------- */

export async function saveAchievement(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const event = str(fd, "event");
  if (!event) return { error: "Event name is required." };
  const existing = id ? await db.achievement.findUnique({ where: { id } }) : null;
  let image: string | null;
  try {
    image = await imageField(fd, existing?.image ?? null);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const data = {
    event,
    location: str(fd, "location"),
    summary: str(fd, "summary"),
    teams: int(fd, "teams"),
    gold: int(fd, "gold"),
    silver: int(fd, "silver"),
    bronze: int(fd, "bronze"),
    platinum: int(fd, "platinum"),
    special: str(fd, "special") || null,
    sortOrder: int(fd, "sortOrder") ?? 0,
    showOnHome: bool(fd, "showOnHome"),
    image,
  };
  if (existing) await db.achievement.update({ where: { id: existing.id }, data });
  else await db.achievement.create({ data });
  revalidatePath("/admin/achievements");
  return { ok: "Saved." };
}

export async function deleteAchievement(id: number) {
  await requireUser();
  const a = await db.achievement.delete({ where: { id } }).catch(() => null);
  await removeMedia(a?.image);
  revalidatePath("/admin/achievements");
}

/* ---------------- FAQ / Support / Schedule ---------------- */

export async function saveFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const data = { question: str(fd, "question"), answer: str(fd, "answer"), sortOrder: int(fd, "sortOrder") ?? 0, showOnHome: bool(fd, "showOnHome") };
  if (!data.question || !data.answer) return { error: "Question and answer are required." };
  if (id) await db.faq.update({ where: { id }, data });
  else await db.faq.create({ data });
  revalidatePath("/admin/faq");
  return { ok: "Saved." };
}
export async function deleteFaq(id: number) {
  await requireUser();
  await db.faq.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/faq");
}

export async function saveSupport(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const data = { title: str(fd, "title"), description: str(fd, "description"), icon: str(fd, "icon") || "Sparkles", sortOrder: int(fd, "sortOrder") ?? 0 };
  if (!data.title || !data.description) return { error: "Title and description are required." };
  if (id) await db.supportItem.update({ where: { id }, data });
  else await db.supportItem.create({ data });
  revalidatePath("/admin/support");
  return { ok: "Saved." };
}
export async function deleteSupport(id: number) {
  await requireUser();
  await db.supportItem.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/support");
}

export async function saveSchedule(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const data = {
    date: str(fd, "date"),
    activity: str(fd, "activity"),
    bdTime: str(fd, "bdTime"),
    mode: str(fd, "mode") === "Online" ? "Online" : "Offline",
    sortOrder: int(fd, "sortOrder") ?? 0,
  };
  if (!data.date || !data.activity) return { error: "Date and activity are required." };
  if (id) await db.scheduleItem.update({ where: { id }, data });
  else await db.scheduleItem.create({ data });
  revalidatePath("/admin/schedule");
  return { ok: "Saved." };
}
export async function deleteSchedule(id: number) {
  await requireUser();
  await db.scheduleItem.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/schedule");
}

/* ---------------- Gallery ---------------- */

export async function saveAlbum(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const id = int(fd, "id");
  const data = { title: str(fd, "title"), description: str(fd, "description"), sortOrder: int(fd, "sortOrder") ?? 0 };
  if (!data.title) return { error: "Album title is required." };
  if (id) {
    await db.galleryAlbum.update({ where: { id }, data });
    revalidatePath(`/admin/gallery/${id}`);
    return { ok: "Saved." };
  }
  const album = await db.galleryAlbum.create({ data });
  redirect(`/admin/gallery/${album.id}`);
}

export async function deleteAlbum(id: number) {
  await requireUser();
  const photos = await db.galleryPhoto.findMany({ where: { albumId: id } });
  await db.galleryAlbum.delete({ where: { id } }).catch(() => null);
  for (const p of photos) await removeMedia(p.url);
  redirect("/admin/gallery");
}

export async function uploadPhotos(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const albumId = int(fd, "albumId");
  if (!albumId) return { error: "Missing album." };
  const list = files(fd, "photos");
  if (!list.length) return { error: "Choose at least one photo." };
  const max = (await db.galleryPhoto.aggregate({ where: { albumId }, _max: { sortOrder: true } }))._max.sortOrder ?? -1;
  let n = 0;
  try {
    for (const f of list) {
      const url = await saveMediaImage(f, 1800);
      if (url) await db.galleryPhoto.create({ data: { albumId, url, caption: "", sortOrder: max + 1 + n++ } });
    }
  } catch (e) {
    revalidatePath(`/admin/gallery/${albumId}`);
    return { error: `${n} uploaded, then: ${(e as Error).message}` };
  }
  revalidatePath(`/admin/gallery/${albumId}`);
  return { ok: `${n} photo${n === 1 ? "" : "s"} uploaded.` };
}

export async function updatePhoto(id: number, fd: FormData) {
  await requireUser();
  const p = await db.galleryPhoto.update({ where: { id }, data: { caption: str(fd, "caption"), sortOrder: int(fd, "sortOrder") ?? 0 } });
  revalidatePath(`/admin/gallery/${p.albumId}`);
}

export async function deletePhoto(id: number) {
  await requireUser();
  const p = await db.galleryPhoto.delete({ where: { id } }).catch(() => null);
  if (!p) return;
  await removeMedia(p.url);
  revalidatePath(`/admin/gallery/${p.albumId}`);
}

/* ---------------- Messages ---------------- */

export async function toggleMessage(id: number) {
  await requireUser();
  const m = await db.contactMessage.findUnique({ where: { id } });
  if (m) await db.contactMessage.update({ where: { id }, data: { handled: !m.handled } });
  revalidatePath("/admin/messages");
}
export async function deleteMessage(id: number) {
  await requireUser();
  await db.contactMessage.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/messages");
}

/* ---------------- Settings (admin) ---------------- */

const URL_KEYS = ["website", "facebook", "instagram", "youtube", "promoVideoUrl"] as const;

export async function saveSettingsAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const patch: Partial<SiteSettings> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]) {
    if (typeof DEFAULT_SETTINGS[key] === "boolean") (patch as Record<string, unknown>)[key] = bool(fd, key);
    else if (fd.has(key)) (patch as Record<string, unknown>)[key] = str(fd, key);
  }
  for (const k of URL_KEYS) {
    const v = patch[k];
    if (v && !/^https?:\/\//i.test(v)) return { error: `${k} must start with https://` };
  }
  try {
    const hero = files(fd, "heroImageFile")[0];
    if (hero) patch.heroImage = (await saveMediaImage(hero, 2200))!;
    const letter = files(fd, "authorizationLetterFile")[0];
    if (letter) patch.authorizationLetter = (await saveMediaImage(letter, 1600))!;
  } catch (e) {
    return { error: (e as Error).message };
  }
  if (bool(fd, "resetHero")) patch.heroImage = DEFAULT_SETTINGS.heroImage;
  if (bool(fd, "removeLetter")) patch.authorizationLetter = "";
  await saveSettings(patch);
  revalidatePath("/", "layout");
  return { ok: "Settings saved." };
}

/* ---------------- Users ---------------- */

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const email = str(fd, "email").toLowerCase();
  const name = str(fd, "name");
  const password = String(fd.get("password") ?? "");
  const role = str(fd, "role") === "ADMIN" ? "ADMIN" : "EDITOR";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
  if (!name) return { error: "Name is required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (await db.user.findUnique({ where: { email } })) return { error: "A user with this email already exists." };
  await db.user.create({ data: { email, name, role, passwordHash: await bcrypt.hash(password, 12) } });
  revalidatePath("/admin/users");
  return { ok: `User ${email} created.` };
}

export async function deleteUser(id: number) {
  const me = await requireAdmin();
  if (me.uid === id) return;
  await db.user.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/users");
}

export async function setUserRole(id: number, fd: FormData) {
  const me = await requireAdmin();
  if (me.uid === id) return;
  await db.user.update({ where: { id }, data: { role: str(fd, "role") === "ADMIN" ? "ADMIN" : "EDITOR" } });
  revalidatePath("/admin/users");
}

export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireUser();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const user = await db.user.findUnique({ where: { id: me.uid } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Current password is wrong." };
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  await db.user.update({ where: { id: me.uid }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: "Password changed." };
}

export async function resetUserPassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = int(fd, "id");
  const password = String(fd.get("password") ?? "");
  if (!id) return { error: "Missing user." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  await db.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return { ok: "Password reset." };
}
