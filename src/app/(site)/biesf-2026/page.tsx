import type { Metadata } from "next";
import Image from "next/image";
import { Award, Camera, Check, FileText, MapPin, Mic, MonitorPlay, Plane, Users } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { CategoryGrid, CtaBanner, PageHero, ScheduleTable, SectionHeading } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BIESF 2026: Competition Details",
  description: "Dates, venue, who can join, categories, paper rules, judging, awards and schedule (Bangladesh time) for BIESF 2026 in Bali and on Zoom.",
};

const JUDGING = [
  { label: "Originality", pct: 30 },
  { label: "Methodology", pct: 25 },
  { label: "Impact", pct: 20 },
  { label: "Presentation", pct: 15 },
  { label: "Booth & Poster", pct: 10 },
];

export default async function Biesf2026Page() {
  const s = await getSettings();
  const schedule = await db.scheduleItem.findMany({ orderBy: { sortOrder: "asc" } });
  const waHref = waLink(s.whatsapp1, "Hi DoB, I have a question about BIESF 2026.");

  const facts = [
    ["Event", "1st Bali International Engineering Science Fair (BIESF 2026)"],
    ["Organiser", "ICGI, Indonesia (with IPB University & IYSA)"],
    ["Bangladesh", "Dreams of Bangladesh: Official Representative & National Selection Body"],
    ["Who can join", "School, college and university students; individual or team (max 6: 1 leader + 5 members) + 1 supervisor"],
    ["Language", "English (paper and presentation)"],
  ];

  return (
    <>
      <PageHero eyebrow="BIESF 2026" title="Everything about the competition" subtitle="Dates, venue, categories, paper rules, judging, awards and the full schedule in Bangladesh time." image="/photos/hero-ulun-danu.webp">
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {[["#dates", "Dates & venue"], ["#categories", "Categories"], ["#paper", "Paper & presentation"], ["#judging", "Judging"], ["#awards", "Awards"], ["#schedule", "Schedule"]].map(([h, l]) => (
            <a key={h} href={h} className="rounded-full bg-white/10 px-3.5 py-1.5 font-medium ring-1 ring-white/25 hover:bg-white/20">{l}</a>
          ))}
        </div>
      </PageHero>

      {/* Key facts */}
      <section className="container-x pb-6 pt-4">
        <dl className="card divide-y divide-line">
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-royal">{k}</dt>
              <dd className="text-[15px] text-navy/85">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Dates & venue, offline vs online */}
      <section id="dates" className="container-x scroll-mt-28 py-12 sm:py-16">
        <SectionHeading eyebrow="Dates & venue" title="Offline in Bali or online from Bangladesh" />
        <div className="grid gap-5 lg:grid-cols-2">
          <article className="card overflow-hidden">
            <div className="relative h-44">
              <Image src="/photos/tanah-lot.webp" alt="Bali" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-royal/90 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-orange">Offline competition</p>
                <p className="text-2xl font-extrabold">{s.offlineDates}</p>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <p className="flex gap-2 text-[15px] font-semibold text-royal"><MapPin className="mt-0.5 size-5 shrink-0 text-orange" /> {s.venueName}</p>
              <p className="ml-7 text-sm text-navy/70">{s.venueAddress}</p>
              <ul className="mt-4 space-y-2 text-[15px] text-navy/85">
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> A0 poster + booth at the venue</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> 7-minute talk + 8-minute Q&amp;A with judges</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Top scorers get private judging</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Eligible for special awards (cash, grant, laptop, KL trip)</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Cultural exchange + optional FunEdu Trip</li>
              </ul>
            </div>
          </article>
          <article className="card overflow-hidden">
            <div className="bg-grid-dark relative flex h-44 items-end bg-gradient-to-br from-orange to-orange-600 p-5">
              <MonitorPlay className="absolute right-6 top-6 size-16 text-navy/20" />
              <div className="text-navy">
                <p className="text-xs font-bold uppercase tracking-wider">Online competition</p>
                <p className="text-2xl font-extrabold">{s.onlineDates}</p>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <p className="flex gap-2 text-[15px] font-semibold text-royal"><MonitorPlay className="mt-0.5 size-5 shrink-0 text-orange" /> Zoom: join from Bangladesh</p>
              <ul className="mt-4 space-y-2 text-[15px] text-navy/85">
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> No travel needed: present from home or school</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> 15 minutes on Zoom (7-minute talk + 8-minute Q&amp;A)</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Same categories and medals (Gold, Silver, Bronze)</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> DoB tech check and Zoom support on the day</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-grid scroll-mt-28 py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Categories" title="8 competition categories" />
          <CategoryGrid />
        </div>
      </section>

      {/* Paper & presentation */}
      <section id="paper" className="container-x scroll-mt-28 py-14 sm:py-20">
        <SectionHeading eyebrow="Paper & presentation" title="What you need to prepare" intro="Don't worry if this is your first paper: DoB will guide you step by step." />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-royal text-white"><FileText className="size-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-royal">Research paper</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-navy/85">
              <li>• Written in <b>English</b></li>
              <li>• Maximum <b>12 pages</b> (without references)</li>
              <li>• <b>Arial 12</b>, A4 size</li>
              <li>• Submit as <b>PDF + Word</b></li>
              <li>• Template: <a href="https://bit.ly/FORMAT-FULL-PAPER" target="_blank" rel="noopener" className="font-semibold text-royal underline">bit.ly/FORMAT-FULL-PAPER</a></li>
            </ul>
          </div>
          <div className="card p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-orange text-navy"><Mic className="size-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-royal">Presentation (in English)</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-navy/85">
              <li>• <b>Offline:</b> A0 poster + booth, 7-minute talk + 8-minute Q&amp;A</li>
              <li>• <b>Online:</b> 15 minutes on Zoom (7 + 8)</li>
              <li>• Top offline scorers are invited to <b>private judging</b></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Judging */}
      <section id="judging" className="bg-grid scroll-mt-28 py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading eyebrow="Judging" title="How projects are scored" intro="International judges appointed by ICGI score every project on five criteria." />
          <div className="card space-y-4 p-6">
            {JUDGING.map((j) => (
              <div key={j.label}>
                <div className="mb-1.5 flex justify-between text-sm font-semibold"><span>{j.label}</span><span className="text-royal">{j.pct}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-royal-50">
                  <div className="h-full rounded-full bg-gradient-to-r from-royal to-royal-600" style={{ width: `${(j.pct / 30) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="container-x scroll-mt-28 py-14 sm:py-20">
        <SectionHeading eyebrow="Awards" title="Medals, certificates and special awards" intro="Awards are decided and given by ICGI." />
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { m: "Gold", r: "86–100", c: "from-[#f6c443] to-[#e0a21a]" },
            { m: "Silver", r: "71–85", c: "from-slate-200 to-slate-400" },
            { m: "Bronze", r: "55–70", c: "from-[#e3a36b] to-[#b8733a]" },
          ].map((a, i) => (
            <div key={a.m} className="card flex items-center gap-4 p-5">
              <span className={`grid size-14 place-items-center rounded-full bg-gradient-to-br ${a.c} text-navy shadow-card`}><Award className="size-7" /></span>
              <div>
                <p className="text-lg font-bold text-royal">{a.m} / {i + 1}{["st", "nd", "rd"][i]}</p>
                <p className="text-sm text-navy/70">Score {a.r} · certificate &amp; medal</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-cyan-light p-6">
            <h3 className="font-bold text-royal">Offline special awards</h3>
            <ul className="mt-3 space-y-2 text-[15px] text-navy/85">
              <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Cash awards up to IDR 7,500,000</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Educational grant</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Laptop</li>
              <li className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-dob" /> Kuala Lumpur trip for 2, and more</li>
            </ul>
          </div>
          <div className="card overflow-hidden">
            <div className="relative h-32"><Image src="/photos/rice-terrace.webp" alt="" fill sizes="50vw" className="object-cover" /></div>
            <div className="p-6">
              <h3 className="flex items-center gap-2 font-bold text-royal"><Camera className="size-5 text-orange" /> FunEdu Trip (offline, optional)</h3>
              <p className="mt-2 text-[15px] text-navy/85">20 November: Garuda Wisnu Kencana (GWK), Tanah Lot, Kecak dance and Jimbaran dinner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="bg-grid scroll-mt-28 py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Schedule" title="Event schedule (Bangladesh time)" intro="Times are shown in Bangladesh Standard Time (GMT+6). Some days may change: we will update this page." />
          <ScheduleTable rows={schedule} />
        </div>
      </section>

      {/* Fees */}
      <section className="container-x py-14">
        <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-dob-50 text-dob">
              {s.feesSectionEnabled ? <Plane className="size-6" /> : <Users className="size-6" />}
            </span>
            <div>
              <h2 className="text-xl font-bold text-royal">Fees &amp; packages</h2>
              <p className="mt-1 whitespace-pre-line text-[15px] text-navy/80">
                {s.feesSectionEnabled && s.feesText ? s.feesText : "For fees & packages, contact us on WhatsApp."}
              </p>
            </div>
          </div>
          <a href={waLink(s.whatsapp1, "Hi DoB, please share the fees & packages for BIESF 2026.")} target="_blank" rel="noopener" className="btn btn-wa shrink-0">
            <WhatsAppIcon className="size-5" /> Ask on WhatsApp
          </a>
        </div>
      </section>

      <CtaBanner waHref={waHref} />
    </>
  );
}
