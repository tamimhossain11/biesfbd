import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";
import { PageHero } from "@/components/site/blocks";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo albums from Dreams of Bangladesh: competitions, preparation sessions and Bali.",
};

export default async function GalleryPage() {
  const albums = await db.galleryAlbum.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { photos: { orderBy: { sortOrder: "asc" }, take: 1 }, _count: { select: { photos: true } } },
  });

  return (
    <>
      <PageHero eyebrow="Gallery" title="Photo albums" subtitle="Moments from our competitions, preparation sessions and the island of Bali." image="/photos/kelingking.webp" />
      <section className="container-x py-12 sm:py-16">
        {albums.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => (
              <Link key={a.id} href={`/gallery/${a.id}`} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
                <div className="relative aspect-[4/3] bg-royal-50">
                  {a.photos[0] && <Image src={a.photos[0].url} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-2.5 py-1 text-xs font-semibold text-white"><Images className="size-3.5" /> {a._count.photos}</span>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-royal">{a.title}</h2>
                  {a.description && <p className="mt-1 line-clamp-2 text-sm text-navy/70">{a.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="card p-8 text-center text-navy/70">Albums coming soon.</p>
        )}
      </section>
    </>
  );
}
