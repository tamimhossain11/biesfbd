import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Flag, Globe } from "lucide-react";
import { LogoStrip } from "@/components/site/LogoStrip";
import { CtaBanner, PageHero, SectionHeading } from "@/components/site/blocks";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "About ICGI, BIESF 2026 and Dreams of Bangladesh, the Official Representative & National Selection Body of BIESF for Bangladesh.",
};

export default async function AboutPage() {
  const s = await getSettings();
  const waHref = waLink(s.whatsapp1, "Hi DoB, I want to know more about BIESF 2026.");

  const blocks = [
    {
      Icon: Building2,
      tag: "The organiser",
      title: "About ICGI",
      body: [
        "ICGI (Indonesian Centre for Giftedness Innovation) is an organisation based in Indonesia that runs international science and innovation events for young people.",
        "ICGI organises BIESF 2026 together with IPB University and IYSA. ICGI appoints the international judges and decides all international results and awards.",
      ],
      color: "bg-royal text-white",
    },
    {
      Icon: Globe,
      tag: "The competition",
      title: "About BIESF 2026",
      body: [
        "The 1st Bali International Engineering Science Fair (BIESF 2026) is an international science and innovation competition for school, college and university students.",
        `Participants present their projects in English, either offline in Denpasar, Bali (${s.offlineDates}) or online on Zoom (${s.onlineDates}). There are 8 categories, from IoT & Robotics to Health & Medicine.`,
      ],
      color: "bg-orange text-navy",
    },
    {
      Icon: Flag,
      tag: "In Bangladesh",
      title: "About Dreams of Bangladesh (DoB)",
      body: [
        "Dreams of Bangladesh helps Bangladeshi students take their science and innovation projects to the world stage. Our students have won medals at WICE 2025 and WICE 2026 in Malaysia, and at the Innovation World Cup 2026 in Indonesia.",
        "For BIESF 2026, DoB is the Official Representative & National Selection Body for Bangladesh. We select, prepare and guide Bangladeshi students, and register selected teams with ICGI.",
      ],
      color: "bg-dob text-white",
    },
  ];

  return (
    <>
      <PageHero eyebrow="About" title="Who we are and how BIESF works" subtitle="Bangladesh selection by Dreams of Bangladesh. International competition, judging and awards by ICGI." image="/photos/pura-bratan.webp" />

      <section className="container-x -mt-4 pb-6">
        <LogoStrip />
      </section>

      <section className="container-x py-12 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {blocks.map(({ Icon, tag, title, body, color }) => (
            <article key={title} className="card p-6 sm:p-7">
              <span className={`grid size-12 place-items-center rounded-2xl ${color}`}><Icon className="size-6" /></span>
              <p className="eyebrow mt-5">{tag}</p>
              <h2 className="mt-1 text-xl font-bold text-royal">{title}</h2>
              <div className="prose-site mt-3">
                {body.map((p) => <p key={p}>{p}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-grid py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Our official role" title="Who does what?" center />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card border-t-4 border-dob p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-wider text-dob">Dreams of Bangladesh</p>
              <h3 className="mt-1 text-lg font-bold text-royal">Bangladesh selection &amp; preparation</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-navy/85">
                {["Registration of Bangladeshi students", "Project review and short interview", "Selecting Bangladesh's participants", "Mentoring, paper, poster & presentation help", "Registering selected teams with ICGI", "Travel coordination (offline) & Zoom support (online)", "Posting Bangladesh results"].map((t) => (
                  <li key={t} className="flex gap-2.5"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-dob" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="card border-t-4 border-orange p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">ICGI, Indonesia</p>
              <h3 className="mt-1 text-lg font-bold text-royal">International competition</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] text-navy/85">
                {["Organising BIESF 2026 in Bali and on Zoom", "Appointing the international judges", "International judging and scoring", "Medals, certificates and special awards"].map((t) => (
                  <li key={t} className="flex gap-2.5"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-orange-600" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-3xl rounded-2xl bg-cyan-light p-4 text-center text-sm font-semibold text-navy">
            DoB selects Bangladesh&apos;s participants. International judging and awards are decided by ICGI.
          </p>
        </div>
      </section>

      {s.authorizationLetter && (
        <section className="container-x py-14 sm:py-20">
          <SectionHeading eyebrow="Official authorization" title="ICGI authorization letter" intro="Dreams of Bangladesh is authorized by ICGI as the Official Representative of BIESF in Bangladesh." />
          <a href={s.authorizationLetter} target="_blank" rel="noopener" className="card block max-w-xl overflow-hidden p-2">
            <Image src={s.authorizationLetter} alt="ICGI authorization letter for Dreams of Bangladesh" width={1200} height={1600} className="h-auto w-full rounded-xl" />
          </a>
        </section>
      )}

      <section className="container-x pt-10 text-center">
        <Link href="/biesf-2026" className="btn btn-ghost">Read the full BIESF 2026 details <ArrowRight className="size-4" /></Link>
      </section>
      <CtaBanner waHref={waHref} />
    </>
  );
}
