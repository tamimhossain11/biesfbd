import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/icons";
import { CtaBanner, FaqList, PageHero } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about BIESF 2026 and the Bangladesh selection by Dreams of Bangladesh.",
};

export default async function FaqPage() {
  const s = await getSettings();
  const faqs = await db.faq.findMany({ orderBy: { sortOrder: "asc" } });
  const waHref = waLink(s.whatsapp1, "Hi DoB, I have a question about BIESF 2026.");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" subtitle="Quick answers about BIESF 2026 and how the Bangladesh selection works." image="/photos/kelingking.webp" />
      <section className="container-x max-w-3xl py-12 sm:py-16">
        <FaqList items={faqs} />
        <div className="mt-10 rounded-2xl bg-cyan-light p-6 text-center">
          <p className="font-semibold text-royal">Still have a question?</p>
          <p className="mt-1 text-sm text-navy/75">WhatsApp: {s.whatsapp1} | {s.whatsapp2}</p>
          <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa mt-4"><WhatsAppIcon className="size-5" /> Ask on WhatsApp</a>
        </div>
      </section>
      <CtaBanner waHref={waHref} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
