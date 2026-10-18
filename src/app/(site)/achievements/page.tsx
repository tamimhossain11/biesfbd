import type { Metadata } from "next";
import Image from "next/image";
import { Medal } from "lucide-react";
import { CountUp } from "@/components/site/CountUp";
import { CtaBanner, PageHero } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Medals won by Bangladeshi students with Dreams of Bangladesh at WICE 2025, WICE 2026 and the Innovation World Cup 2026.",
};

export default async function AchievementsPage() {
  const s = await getSettings();
  const items = await db.achievement.findMany({ orderBy: { sortOrder: "asc" } });
  const totalGold = items.reduce((n, a) => n + (a.gold ?? 0), 0);
  const totalMedals = items.reduce((n, a) => n + (a.gold ?? 0) + (a.silver ?? 0) + (a.bronze ?? 0) + (a.platinum ?? 0), 0);
  const waHref = waLink(s.whatsapp1, "Hi DoB, I want to join BIESF 2026.");

  return (
    <>
      <PageHero eyebrow="Achievements" title="Bangladesh on the international podium" subtitle="Results from international competitions where Dreams of Bangladesh guided Bangladeshi students." image="/photos/tanah-lot.webp">
        <div className="mt-8 flex flex-wrap gap-8">
          <div><p className="text-5xl font-extrabold text-orange"><CountUp to={totalGold} /></p><p className="text-sm text-white/80">Gold medals</p></div>
          <div><p className="text-5xl font-extrabold"><CountUp to={totalMedals} /></p><p className="text-sm text-white/80">Medals in total</p></div>
          <div><p className="text-5xl font-extrabold"><CountUp to={items.length} /></p><p className="text-sm text-white/80">International events</p></div>
        </div>
      </PageHero>

      <section className="container-x space-y-6 py-12 sm:py-16">
        {items.map((a) => {
          const stats = [
            ["Teams", a.teams], ["Gold", a.gold], ["Silver", a.silver], ["Bronze", a.bronze], ["Platinum", a.platinum],
          ].filter(([, v]) => v != null) as [string, number][];
          return (
            <article key={a.id} className="card grid overflow-hidden md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <div className="relative min-h-52 bg-gradient-to-br from-royal to-navy">
                {a.image ? (
                  <Image src={a.image} alt={a.event} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                ) : (
                  <div className="bg-grid-dark flex h-full min-h-52 flex-col items-center justify-center p-6 text-center text-white">
                    <Medal className="size-12 text-orange" />
                    <p className="mt-3 text-2xl font-extrabold">{a.event}</p>
                    <p className="text-sm text-white/70">{a.location}</p>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8">
                <p className="eyebrow">{a.location}</p>
                <h2 className="mt-1 text-2xl font-bold text-royal">{a.event}</h2>
                {a.summary && <p className="mt-2 text-[15px] leading-7 text-navy/80">{a.summary}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {stats.map(([label, v]) => (
                    <div key={label} className={label === "Gold" ? "rounded-2xl bg-orange px-5 py-3 text-navy" : "rounded-2xl bg-royal-50 px-5 py-3 text-royal"}>
                      <p className="text-3xl font-extrabold"><CountUp to={v} /></p>
                      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>
                {a.special && <p className="mt-4 inline-block rounded-full bg-dob-50 px-3.5 py-1.5 text-sm font-semibold text-dob">+ {a.special}</p>}
              </div>
            </article>
          );
        })}
      </section>
      <CtaBanner waHref={waHref} title="Your name could be next. Join BIESF 2026!" />
    </>
  );
}
