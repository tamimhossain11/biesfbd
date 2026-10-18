/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteAlbum, deletePhoto, saveAlbum, updatePhoto, uploadPhotos } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "Album" };

export default async function AdminAlbum({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const album = Number.isInteger(id) ? await db.galleryAlbum.findUnique({ where: { id }, include: { photos: { orderBy: { sortOrder: "asc" } } } }) : null;
  if (!album) notFound();

  return (
    <>
      <Link href="/admin/gallery" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="size-4" /> Gallery</Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">{album.title}</h1>
        <Link href={`/gallery/${album.id}`} target="_blank" className="a-btn border border-slate-300 bg-white"><ExternalLink className="size-4" /> View on site</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="a-card p-4">
          <h2 className="mb-3 font-bold text-navy">Upload photos</h2>
          <ActionForm action={uploadPhotos} className="space-y-3" resetOnSuccess>
            <input type="hidden" name="albumId" value={album.id} />
            <input type="file" name="photos" multiple required accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold" />
            <p className="text-xs text-slate-400">Select up to about 10 photos at a time. They are resized in your browser and compressed automatically.</p>
            <SubmitButton pendingText="Uploading…">Upload</SubmitButton>
          </ActionForm>
        </section>
        <section className="a-card p-4">
          <h2 className="mb-3 font-bold text-navy">Album details</h2>
          <ActionForm action={saveAlbum} className="space-y-3">
            <input type="hidden" name="id" value={album.id} />
            <div className="grid gap-3 sm:grid-cols-[1fr_80px]">
              <div><label className="a-label">Title</label><input name="title" required defaultValue={album.title} className="a-input" /></div>
              <div><label className="a-label">Order</label><input type="number" name="sortOrder" defaultValue={album.sortOrder} className="a-input" /></div>
            </div>
            <div><label className="a-label">Description</label><textarea name="description" rows={2} defaultValue={album.description} className="a-input" /></div>
            <div className="flex items-center justify-between">
              <SubmitButton>Save</SubmitButton>
            </div>
          </ActionForm>
          <div className="mt-2 flex justify-end">
            <ConfirmButton action={deleteAlbum.bind(null, album.id)} message={`Delete the album "${album.title}" and all its photos?`}>Delete album</ConfirmButton>
          </div>
        </section>
      </div>

      <h2 className="mb-3 mt-8 font-bold text-navy">Photos ({album.photos.length})</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {album.photos.map((p) => (
          <div key={p.id} className="a-card overflow-hidden">
            <img src={p.url} alt="" className="aspect-[4/3] w-full object-cover" />
            <form action={updatePhoto.bind(null, p.id)} className="space-y-2 p-3">
              <input name="caption" defaultValue={p.caption} placeholder="Caption" className="a-input" />
              <div className="flex gap-2">
                <input type="number" name="sortOrder" defaultValue={p.sortOrder} className="a-input w-20" title="Order" />
                <SubmitButton className="flex-1">Save</SubmitButton>
              </div>
            </form>
            <div className="px-3 pb-3"><ConfirmButton action={deletePhoto.bind(null, p.id)} message="Delete this photo?" className="w-full justify-center" /></div>
          </div>
        ))}
      </div>
    </>
  );
}
