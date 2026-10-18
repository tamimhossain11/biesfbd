import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CATEGORIES, SELECTION_STEPS } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { NamedIcon, WhatsAppIcon } from "../icons";

/** Diagonal bottom edge with the orange poster stripe. `fill` = colour of the next section. */
export function AngledEdge({ fill = "#eef3fb" }: { fill?: string }) {
  return (
    <svg className="pointer-events-none absolute inset-x-0 -bottom-px h-[42px] w-full sm:h-[70px]" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 100 L0 74 L1440 14 L1440 100 Z" fill={fill} />
      <path d="M0 66 L1440 6 L1440 18 L0 78 Z" fill="#F0A828" />
    </svg>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image = "/photos/tanah-lot.webp",
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-royal pb-20 pt-12 text-white sm:pb-28 sm:pt-16">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-royal via-royal/90 to-navy/90" />
      <div className="bg-grid-dark absolute inset-0 -z-10" />
      <div className="container-x">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">{subtitle}</p>}
        {children}
      </div>
      <AngledEdge fill="#ffffff" />
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: React.ReactNode;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("mb-8 sm:mb-10", center && "mx-auto max-w-2xl text-center")}>
      {eyebrow && <p className={cn("eyebrow", light && "text-orange")}>{eyebrow}</p>}
      <h2 className={cn("h-section mt-2", light && "text-white")}>{title}</h2>
      <span className={cn("underline-orange", center && "mx-auto")} />
      {intro && <p className={cn("mt-4 text-[15px] leading-7", light ? "text-white/80" : "text-navy/75")}>{intro}</p>}
    </div>
  );
}

/** The 8-step selection journey. Steps 1–6 DoB (green/blue), 7–8 ICGI (orange). */
export function SelectionTimeline({ offline, online, variant = "grid" }: { offline: string; online: string; variant?: "grid" | "vertical" }) {
  const steps = SELECTION_STEPS.map((s) => ({ ...s, text: s.text.replace("{offline}", offline).replace("{online}", online) }));

  const legend = (
    <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold">
      <span className="inline-flex items-center gap-2 rounded-full bg-dob-50 px-3 py-1.5 text-dob ring-1 ring-dob/20">
        <span className="size-2.5 rounded-full bg-dob" /> Steps 1–6: Bangladesh Selection by Dreams of Bangladesh
      </span>
      <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-3 py-1.5 text-orange-600 ring-1 ring-orange/30">
        <span className="size-2.5 rounded-full bg-orange" /> Steps 7–8: International Round by ICGI
      </span>
    </div>
  );

  const note = (
    <p className="mt-6 rounded-2xl border-l-4 border-orange bg-white p-4 text-sm font-medium text-navy shadow-card">
      DoB selects Bangladesh&apos;s participants. International judging and awards are decided by ICGI.
    </p>
  );

  if (variant === "vertical") {
    return (
      <div>
        {legend}
        <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[22px] before:top-4 before:w-0.5 before:bg-gradient-to-b before:from-dob before:via-royal before:to-orange sm:before:left-[26px]">
          {steps.map((s) => {
            const icgi = s.by === "icgi";
            return (
              <li key={s.n} className="relative flex gap-4 sm:gap-5">
                <span
                  className={cn(
                    "relative z-10 grid size-11 shrink-0 place-items-center rounded-full text-base font-bold text-white ring-4 ring-white sm:size-[52px] sm:text-lg",
                    icgi ? "bg-orange text-navy" : s.n % 2 ? "bg-dob" : "bg-royal",
                  )}
                >
                  {s.n}
                </span>
                <div className={cn("card flex-1 p-4 sm:p-5", icgi && "bg-orange/5 ring-orange/30")}>
                  <p className={cn("text-[11px] font-bold uppercase tracking-wider", icgi ? "text-orange-600" : "text-dob")}>
                    {icgi ? "International Round by ICGI" : "Bangladesh Selection by DoB"}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-royal">{s.title}</h3>
                  <p className="mt-1 text-[15px] leading-6 text-navy/80">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {note}
      </div>
    );
  }

  return (
    <div>
      {legend}
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => {
          const icgi = s.by === "icgi";
          return (
            <li key={s.n} className={cn("card relative overflow-hidden p-5 pt-6", icgi && "ring-orange/40")}>
              <span className={cn("absolute inset-x-0 top-0 h-1.5", icgi ? "bg-orange" : s.n % 2 ? "bg-dob" : "bg-royal")} />
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-sm font-bold",
                    icgi ? "bg-orange text-navy" : s.n % 2 ? "bg-dob text-white" : "bg-royal text-white",
                  )}
                >
                  {s.n}
                </span>
                <h3 className="text-base font-bold text-royal">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-navy/75">{s.text}</p>
            </li>
          );
        })}
      </ol>
      {note}
    </div>
  );
}

export function CategoryGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {CATEGORIES.map((c, i) => (
        <li key={c.name} className="card group flex flex-col items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5">
          <span
            className={cn(
              "grid size-11 place-items-center rounded-xl transition group-hover:scale-105",
              i % 3 === 0 ? "bg-royal text-white" : i % 3 === 1 ? "bg-orange text-navy" : "bg-cyan-light text-royal",
            )}
          >
            <NamedIcon name={c.icon} className="size-5" />
          </span>
          <h3 className="text-sm font-semibold leading-snug text-navy sm:text-[15px]">{c.name}</h3>
        </li>
      ))}
    </ul>
  );
}

export function FaqList({ items }: { items: { id: number; question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <details key={f.id} className="card group open:shadow-lift" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-[15px] font-semibold text-royal sm:p-5 [&::-webkit-details-marker]:hidden">
            {f.question}
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-royal-50 text-royal transition group-open:rotate-180 group-open:bg-orange group-open:text-navy">
              <ChevronDown className="size-4" />
            </span>
          </summary>
          <p className="whitespace-pre-line px-4 pb-5 text-[15px] leading-7 text-navy/80 sm:px-5">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function NewsCard({ post }: { post: { slug: string; title: string; excerpt: string; kind: string; image: string | null; publishedAt: Date } }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link href={`/news/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-royal">
        {post.image ? (
          <Image src={post.image} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="bg-grid-dark flex h-full items-center justify-center bg-gradient-to-br from-royal to-navy">
            <span className="text-2xl font-extrabold tracking-tight text-white/90">BIESF <span className="text-orange">2026</span></span>
          </div>
        )}
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide", post.kind === "Result" ? "bg-orange text-navy" : "bg-white text-royal")}>
          {post.kind}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <time className="text-xs font-medium text-navy/55">{formatDate(post.publishedAt)}</time>
        <h3 className="mt-1.5 text-base font-bold leading-snug text-royal">
          <Link href={`/news/${post.slug}`} className="hover:underline">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy/75">{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-royal hover:gap-2">
          Read more <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export function CtaBanner({ waHref, title = "Seats are limited. Start your journey to Bali today!", text }: { waHref: string; title?: string; text?: string }) {
  return (
    <section className="container-x py-14 sm:py-20">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-royal px-6 py-10 text-white shadow-lift sm:px-12 sm:py-14">
        <Image src="/photos/tanah-lot.webp" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-royal/95 to-royal/70" />
        <div className="absolute -right-10 bottom-8 -z-10 h-3 w-[140%] -rotate-6 bg-orange/90" aria-hidden />
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">Dhaka to Bali</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
          {text && <p className="mt-3 text-white/85">{text}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-register btn-lg">Register Now <ArrowRight className="size-4" /></Link>
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg"><WhatsAppIcon className="size-5" /> WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ScheduleTable({ rows }: { rows: { id: number; date: string; activity: string; bdTime: string; mode: string }[] }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-royal text-white">
          <tr>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Activity</th>
            <th className="px-4 py-3 text-right font-semibold sm:text-left">Bangladesh time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id} className="odd:bg-royal-50/50">
              <td className="whitespace-nowrap px-4 py-3 font-bold text-royal">{r.date}</td>
              <td className="px-4 py-3">
                {r.activity}
                <span className={cn("ml-2 inline-block rounded-full px-2 py-0.5 align-middle text-[10px] font-bold uppercase", r.mode === "Online" ? "bg-orange/20 text-orange-600" : "bg-royal/10 text-royal")}>
                  {r.mode === "Online" ? "Zoom" : "Bali"}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-medium sm:text-left">{r.bdTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
