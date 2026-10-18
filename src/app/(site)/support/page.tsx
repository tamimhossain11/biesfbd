import type { Metadata } from "next";
import { NamedIcon } from "@/components/icons";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support",
  description: "How Dreams of Bangladesh helps you: mentoring, paper help, poster & presentation practice, travel coordination and Zoom support.",
};

export default async function SupportPage() {
  const s = await getSettings();
  const items = await db.supportItem.findMany({ orderBy: { sortOrder: "asc" } });
  const waHref = waLink(s.whatsapp1, "Hi DoB, I'd like to know how you support BIESF 2026 participants.");

  return (
    <>
      <PageHero eyebrow="Support" title="We're with you at every step" subtitle="From your first idea to the awarding ceremony, the Dreams of Bangladesh team helps you prepare and compete with confidence." image="/photos/diamond-beach.webp" />
      <section className="container-x py-12 sm:py-16">
        <SectionHeading eyebrow="How DoB helps" title="What you get with Dreams of Bangladesh" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.id} className="card p-6">
              <span className={i % 3 === 0 ? "grid size-12 place-items-center rounded-2xl bg-royal text-white" : i % 3 === 1 ? "grid size-12 place-items-center rounded-2xl bg-orange text-navy" : "grid size-12 place-items-center rounded-2xl bg-dob text-white"}>
                <NamedIcon name={it.icon} className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-royal">{it.title}</h2>
              <p className="mt-2 whitespace-pre-line text-[15px] leading-7 text-navy/80">{it.description}</p>
            </li>
          ))}
        </ul>
      </section>
      <CtaBanner waHref={waHref} title="Ready to start? Our mentors are waiting." />
    </>
  );
}
