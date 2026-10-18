import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard, PageHero } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News & Results",
  description: "Announcements and Bangladesh results for BIESF 2026 from Dreams of Bangladesh.",
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const { kind } = await searchParams;
  const filter = kind === "News" || kind === "Result" ? kind : undefined;
  const posts = await db.newsPost.findMany({
    where: { published: true, ...(filter ? { kind: filter } : {}) },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero eyebrow="News & results" title="Announcements and results" subtitle="Latest updates from Dreams of Bangladesh, and Bangladesh's results from the international round." image="/photos/pura-bratan.webp" />
      <section className="container-x py-12 sm:py-16">
        <div className="mb-8 flex gap-2">
          {[[undefined, "All"], ["News", "News"], ["Result", "Results"]].map(([k, label]) => (
            <Link
              key={label}
              href={k ? `/news?kind=${k}` : "/news"}
              className={cn("rounded-full px-4 py-2 text-sm font-semibold ring-1", filter === k ? "bg-royal text-white ring-royal" : "bg-white text-royal ring-line hover:bg-royal-50")}
            >
              {label}
            </Link>
          ))}
        </div>
        {posts.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <NewsCard key={p.id} post={p} />)}
          </div>
        ) : (
          <p className="card p-8 text-center text-navy/70">Nothing here yet. Check back soon!</p>
        )}
      </section>
    </>
  );
}
