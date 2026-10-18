import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmButton } from "@/components/admin/ui";
import { deleteNews } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "News & results" };

export default async function AdminNews({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const posts = await db.newsPost.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <>
      <PageHeader title="News & results" intro="Announcements and Bangladesh results. The newest 3 published posts show on the home page.">
        <Link href="/admin/news/new" className="a-btn bg-royal text-white hover:bg-royal-600"><Plus className="size-4" /> New post</Link>
      </PageHeader>
      {saved && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">Post saved.</p>}
      <div className="a-card divide-y divide-slate-100">
        {posts.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", p.kind === "Result" ? "bg-orange/20 text-orange-600" : "bg-royal-50 text-royal")}>{p.kind}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="text-xs text-slate-500">{formatDate(p.publishedAt)} · {p.published ? <span className="text-emerald-600">Published</span> : <span className="text-amber-600">Draft</span>}</p>
            </div>
            <Link href={`/admin/news/${p.id}`} className="a-btn border border-slate-300 bg-white"><Pencil className="size-4" /> Edit</Link>
            <ConfirmButton action={deleteNews.bind(null, p.id)} message={`Delete "${p.title}"?`} />
          </div>
        ))}
        {!posts.length && <p className="p-6 text-sm text-slate-500">No posts yet.</p>}
      </div>
    </>
  );
}
