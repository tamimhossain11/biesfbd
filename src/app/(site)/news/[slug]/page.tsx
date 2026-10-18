import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaBanner, NewsCard } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatDate, waLink } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.newsPost.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: post.image ? { images: [{ url: post.image }] } : undefined,
  };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await db.newsPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();
  const [s, more] = await Promise.all([
    getSettings(),
    db.newsPost.findMany({ where: { published: true, NOT: { id: post.id } }, orderBy: { publishedAt: "desc" }, take: 3 }),
  ]);

  return (
    <>
      <article className="container-x max-w-3xl py-10 sm:py-14">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="size-4" /> All news</Link>
        <p className="mt-6 flex items-center gap-3 text-sm">
          <span className={post.kind === "Result" ? "rounded-full bg-orange px-2.5 py-1 text-[11px] font-bold uppercase text-navy" : "rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-bold uppercase text-royal"}>{post.kind}</span>
          <time className="text-navy/60">{formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</time>
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-royal sm:text-4xl">{post.title}</h1>
        {post.image && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={post.image} alt="" fill priority sizes="(min-width:768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-site mt-6 text-base">
          {post.body.split(/\n{2,}/).map((para, i) => (
            <p key={i} className="whitespace-pre-line">{para}</p>
          ))}
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-grid py-12">
          <div className="container-x">
            <h2 className="mb-6 text-2xl font-bold text-royal">More updates</h2>
            <div className="grid gap-5 md:grid-cols-3">{more.map((p) => <NewsCard key={p.id} post={p} />)}</div>
          </div>
        </section>
      )}
      <CtaBanner waHref={waLink(s.whatsapp1, "Hi DoB, I want to join BIESF 2026.")} />
    </>
  );
}
