import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "https://biesfbd.com";
  const pages = ["", "/about", "/biesf-2026", "/how-to-join", "/register", "/support", "/achievements", "/news", "/gallery", "/faq", "/contact"];
  const [posts, albums] = await Promise.all([
    db.newsPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.galleryAlbum.findMany({ select: { id: true, createdAt: true } }),
  ]);
  return [
    ...pages.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : p === "/register" ? 0.9 : 0.7 })),
    ...posts.map((p) => ({ url: `${base}/news/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ...albums.map((a) => ({ url: `${base}/gallery/${a.id}`, lastModified: a.createdAt, priority: 0.4 })),
  ];
}
