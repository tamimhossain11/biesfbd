import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe, MapPin, MonitorPlay, Trophy } from "lucide-react";
import { WhatsAppIcon, YoutubeIcon } from "@/components/icons";
import { CountUp } from "@/components/site/CountUp";
import { LiteYouTube } from "@/components/site/LiteYouTube";
import { LogoStrip } from "@/components/site/LogoStrip";
import { AngledEdge, CategoryGrid, CtaBanner, FaqList, NewsCard, SectionHeading, SelectionTimeline } from "@/components/site/blocks";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink, youtubeId } from "@/lib/utils";

export default async function HomePage() {
  const s = await getSettings();
  const [achievements, news, faqs, photos] = await Promise.all([
    db.achievement.findMany({ where: { showOnHome: true }, orderBy: { sortOrder: "asc" } }),
    db.newsPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.faq.findMany({ where: { showOnHome: true }, orderBy: { sortOrder: "asc" }, take: 5 }),
    db.galleryPhoto.findMany({ orderBy: [{ createdAt: "desc" }, { sortOrder: "asc" }], take: 4 }),
  ]);
  const waHref = waLink(s.whatsapp1, "Hi DoB, I want to join BIESF 2026. Please share the details.");
  const videoId = youtubeId(s.promoVideoUrl);

  const highlights = [
    { Icon: Globe, title: "International stage in Bali", text: `Present your project to international judges in Denpasar, Bali (${s.offlineShort}).` },
    { Icon: MonitorPlay, title: "Join online from Bangladesh", text: `Can't travel? Compete live on Zoom from home (${s.onlineShort}).` },
    { Icon: BadgeCheck, title: "Direct selection", text: "No exam round. Register, get your project reviewed and have a short interview with DoB." },
    { Icon: Trophy, title: "Medals, cash awards, laptop, KL trip", text: "Gold, Silver & Bronze medals with certificates, plus special awards for offline participants." },
  ];

  return (
    <>
      {/* 1. Banner */}
      <section className="relative isolate overflow-hidden bg-navy pb-24 pt-10 text-white sm:pb-32 sm:pt-16 lg:pb-40">
        <Image src={s.heroImage} alt="Pura Ulun Danu Bratan temple, Bali" fill priority sizes="100vw" className="-z-20 object-cover object-[center_40%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-royal/80 to-royal/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        <div className="container-x">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-navy sm:text-xs">
            Official Representative in Bangladesh
          </p>
          <p className="mt-5 text-sm font-semibold text-white/85 sm:text-base">
            1st BIESF 2026 <span className="text-orange">•</span> Bali International Engineering Science Fair
          </p>
          <h1 className="mt-3 max-w-3xl text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Dhaka to Bali: <span className="text-orange">Take Your Innovation</span> to the World Stage
          </h1>

          <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-royal/90 p-4 ring-1 ring-white/20 backdrop-blur">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange">Offline competition</p>
              <p className="mt-1 text-2xl font-extrabold">{s.offlineShort}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/85"><MapPin className="size-4" /> Denpasar, Bali</p>
            </div>
            <div className="rounded-2xl bg-orange p-4 text-navy">
              <p className="text-[11px] font-bold uppercase tracking-wider">Online competition</p>
              <p className="mt-1 text-2xl font-extrabold">{s.onlineShort}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium"><MonitorPlay className="size-4" /> Zoom, from Bangladesh</p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn btn-register btn-lg">Register Now <ArrowRight className="size-4" /></Link>
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg"><WhatsAppIcon className="size-5" /> WhatsApp Us</a>
          </div>
          <p className="mt-4 text-sm text-white/75">School • College • University &nbsp;|&nbsp; Individual or Team (up to 6) + 1 Supervisor</p>
        </div>
        <AngledEdge fill="#eef3fb" />
      </section>

      <div className="bg-grid">
        {/* 2. Logos */}
        <section className="container-x relative -mt-2 pb-4 pt-2 sm:-mt-6">
          <LogoStrip />
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm font-medium text-navy sm:text-base">
            <span className="font-bold text-dob">Dreams of Bangladesh</span>: Official Representative &amp; National Selection Body of
            BIESF for Bangladesh
          </p>
          {s.authorizationLetter && (
            <p className="mt-2 text-center">
              <Link href="/about#official-letter" className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline">
                <BadgeCheck className="size-4 text-dob" /> See our official invitation from ICGI
              </Link>
            </p>
          )}
        </section>

        {/* 3. Highlights */}
        <section className="container-x pb-12 pt-8 sm:pb-16 sm:pt-10">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ Icon, title, text }, i) => (
              <li key={title} className="card p-5 sm:p-6">
                <span className={i % 2 ? "grid size-12 place-items-center rounded-2xl bg-orange text-navy" : "grid size-12 place-items-center rounded-2xl bg-royal text-white"}>
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-royal">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-navy/75">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 4. How to join */}
      <section className="container-x py-14 sm:py-20">
        <SectionHeading
          eyebrow="How to join"
          title="Your path from Bangladesh to Bali"
          intro="Eight simple steps. Dreams of Bangladesh runs the Bangladesh selection; ICGI runs the international round."
        />
        <SelectionTimeline offline={s.offlineShort} online={s.onlineShort} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/how-to-join" className="btn btn-ghost">See the full process <ArrowRight className="size-4" /></Link>
          <Link href="/register" className="btn btn-register">Start step 1: Register</Link>
        </div>
      </section>

      {/* 5. Categories */}
      <section className="bg-grid py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Competition categories" title="8 categories to choose from" intro="Pick the category that fits your project best. Not sure? Our team will help you decide." />
          <CategoryGrid />
        </div>
      </section>

      {/* 6. Achievements */}
      <section className="relative overflow-hidden bg-navy py-14 text-white sm:py-20">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="container-x relative">
          <SectionHeading light eyebrow="Our achievements" title="Bangladesh keeps winning on the world stage" intro="Results from international competitions where Dreams of Bangladesh guided Bangladeshi students." />
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((a) => {
              const stats = [
                a.teams != null && { n: a.teams, label: "Teams" },
                a.gold != null && { n: a.gold, label: "Gold" },
                a.silver != null && { n: a.silver, label: "Silver" },
                a.bronze != null && { n: a.bronze, label: "Bronze" },
                a.platinum != null && { n: a.platinum, label: "Platinum" },
              ].filter(Boolean) as { n: number; label: string }[];
              return (
                <div key={a.id} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange">{a.location}</p>
                  <h3 className="mt-1 text-xl font-bold">{a.event}</h3>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {stats.map((st) => (
                      <div key={st.label}>
                        <p className={st.label === "Gold" ? "text-4xl font-extrabold text-orange" : "text-4xl font-extrabold"}>
                          <CountUp to={st.n} />
                        </p>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/65">{st.label}</p>
                      </div>
                    ))}
                  </div>
                  {a.special && <p className="mt-4 inline-block rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold text-orange">+ {a.special}</p>}
                </div>
              );
            })}
          </div>
          <Link href="/achievements" className="btn btn-outline-white mt-8">View all achievements <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      {/* 7. Promo video + photos */}
      <section className="container-x py-14 sm:py-20">
        <SectionHeading eyebrow="See it for yourself" title="Bali is waiting for you" />
        <div className="grid gap-4 lg:grid-cols-2">
          {videoId ? (
            <LiteYouTube id={videoId} title="BIESF 2026 Bangladesh promo video" />
          ) : (
            <a href={s.youtube} target="_blank" rel="noopener" className="group relative isolate flex aspect-video items-end overflow-hidden rounded-2xl p-6 text-white shadow-lift lg:aspect-auto lg:min-h-full">
              <Image src="/photos/diamond-beach.webp" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 to-transparent" />
              <span className="flex items-center gap-3 font-semibold">
                <span className="grid size-12 place-items-center rounded-full bg-[#ff0000] text-white"><YoutubeIcon className="size-6" /></span>
                Watch Dreams of Bangladesh on YouTube
              </span>
            </a>
          )}
          <div className="grid grid-cols-2 gap-3">
            {photos.map((p) => (
              <Link key={p.id} href="/gallery" className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-royal-50">
                <Image src={p.url} alt={p.caption || "BIESF gallery photo"} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest news */}
      {news.length > 0 && (
        <section className="bg-grid py-14 sm:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="News & results" title="Latest updates" />
              <Link href="/news" className="btn btn-ghost mb-8 sm:mb-10">All news <ArrowRight className="size-4" /></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {news.map((p) => <NewsCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* 9. FAQ */}
      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Questions? We have answers." intro="Can't find what you need? Message us on WhatsApp and our team will reply." />
            <div className="flex flex-wrap gap-3">
              <Link href="/faq" className="btn btn-ghost">All FAQs <ArrowRight className="size-4" /></Link>
              <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa"><WhatsAppIcon className="size-4" /> Ask on WhatsApp</a>
            </div>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* 10. Final banner */}
      <CtaBanner waHref={waHref} text={`Offline in Bali ${s.offlineShort} or online on Zoom ${s.onlineShort}. Register today and our team will contact you on WhatsApp.`} />
    </>
  );
}
