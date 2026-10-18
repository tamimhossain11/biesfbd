/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, SubmitButton } from "@/components/admin/ui";
import { saveAlbum } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "Gallery" };

export default async function AdminGallery() {
  const albums = await db.galleryAlbum.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { photos: { orderBy: { sortOrder: "asc" }, take: 1 }, _count: { select: { photos: true } } },
  });
  return (
    <>
      <PageHeader title="Gallery" intro="Photo albums. Open an album to upload photos." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {albums.map((a) => (
          <Link key={a.id} href={`/admin/gallery/${a.id}`} className="a-card overflow-hidden hover:border-royal">
            <div className="aspect-video bg-slate-100">{a.photos[0] && <img src={a.photos[0].url} alt="" className="size-full object-cover" />}</div>
            <div className="p-4">
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-slate-500">{a._count.photos} photos</p>
            </div>
          </Link>
        ))}
      </div>
      <section className="a-card mt-6 max-w-xl p-4">
        <h2 className="mb-3 font-bold text-navy">New album</h2>
        <ActionForm action={saveAlbum} className="space-y-3">
          <div><label className="a-label">Title *</label><input name="title" required className="a-input" placeholder="WICE 2026, Malaysia" /></div>
          <div><label className="a-label">Description</label><textarea name="description" rows={2} className="a-input" /></div>
          <SubmitButton>Create album</SubmitButton>
        </ActionForm>
      </section>
    </>
  );
}
