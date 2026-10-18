import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ImageInput } from "@/components/admin/ImageInput";
import { ActionForm, SubmitButton } from "@/components/admin/ui";
import { saveNews } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "Edit post" };

export default async function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = id === "new" ? null : await db.newsPost.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !post) notFound();
  const dt = new Date(post?.publishedAt ?? Date.now());
  const local = new Date(dt.getTime() + 6 * 3600_000).toISOString().slice(0, 16); // Bangladesh time

  return (
    <>
      <Link href="/admin/news" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="size-4" /> News & results</Link>
      <h1 className="mb-6 text-2xl font-bold text-navy">{post ? "Edit post" : "New post"}</h1>
      <ActionForm action={saveNews} className="a-card max-w-3xl space-y-4 p-5">
        {post && <input type="hidden" name="id" value={post.id} />}
        <div>
          <label className="a-label">Title *</label>
          <input name="title" required defaultValue={post?.title} className="a-input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="a-label">Type</label>
            <select name="kind" defaultValue={post?.kind ?? "News"} className="a-input"><option>News</option><option>Result</option></select>
          </div>
          <div>
            <label className="a-label">Date (BD time)</label>
            <input type="datetime-local" name="publishedAt" defaultValue={local} className="a-input" />
          </div>
          <div>
            <label className="a-label">URL slug</label>
            <input name="slug" defaultValue={post?.slug} placeholder="auto from title" className="a-input" />
          </div>
        </div>
        <div>
          <label className="a-label">Short summary (shown on cards)</label>
          <textarea name="excerpt" rows={2} maxLength={400} defaultValue={post?.excerpt} className="a-input" />
        </div>
        <div>
          <label className="a-label">Full text</label>
          <textarea name="body" rows={12} defaultValue={post?.body} className="a-input" />
          <p className="mt-1 text-xs text-slate-400">Leave an empty line between paragraphs.</p>
        </div>
        <ImageInput current={post?.image} label="Cover image" />
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={post?.published ?? true} /> Published (visible on the website)
        </label>
        <div className="border-t border-slate-100 pt-4"><SubmitButton>Save post</SubmitButton></div>
      </ActionForm>
    </>
  );
}
