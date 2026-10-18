import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Lightbox } from "@/components/site/Lightbox";
import { db } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

async function getAlbum(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n)) return null;
  return db.galleryAlbum.findUnique({ where: { id: n }, include: { photos: { orderBy: { sortOrder: "asc" } } } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await getAlbum((await params).id);
  return album ? { title: `${album.title} (Gallery)`, description: album.description || undefined } : {};
}

export default async function AlbumPage({ params }: Props) {
  const album = await getAlbum((await params).id);
  if (!album) notFound();
  return (
    <section className="container-x py-10 sm:py-14">
      <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="size-4" /> All albums</Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-royal sm:text-4xl">{album.title}</h1>
      {album.description && <p className="mt-2 max-w-2xl text-navy/75">{album.description}</p>}
      <span className="underline-orange mb-8" />
      <Lightbox photos={album.photos.map((p) => ({ id: p.id, url: p.url, caption: p.caption }))} />
    </section>
  );
}
