import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { CtaBanner, PageHero, SectionHeading, SelectionTimeline } from "@/components/site/blocks";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How to Join (Selection)",
  description: "The 8 steps from registration to the international round of BIESF 2026. Bangladesh selection by Dreams of Bangladesh; international round by ICGI.",
};

export default async function HowToJoinPage() {
  const s = await getSettings();
  const waHref = waLink(s.whatsapp1, "Hi DoB, I want to join BIESF 2026. What are the next steps?");

  return (
    <>
      <PageHero eyebrow="How to join" title="From registration to the world stage in 8 steps" subtitle="No exam round. Selection is by registration, project review and a short interview with Dreams of Bangladesh." image="/photos/rice-terrace.webp">
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-register btn-lg">Register Now <ArrowRight className="size-4" /></Link>
          <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg"><WhatsAppIcon className="size-5" /> WhatsApp Us</a>
        </div>
      </PageHero>

      <section className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading eyebrow="The selection process" title="Step by step" />
          <SelectionTimeline variant="vertical" offline={s.offlineShort} online={s.onlineShort} />
        </div>
        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-royal">Before you register</h2>
            <ul className="mt-4 space-y-3 text-[15px] text-navy/85">
              {[
                "A project idea or a project you are already working on",
                "Your category (pick from 8; we can help)",
                "Team details: up to 6 members + 1 supervisor (or join alone)",
                "Choose offline (Bali) or online (Zoom). Not sure? That's fine too",
                "A short project summary (100–300 words)",
              ].map((t) => (
                <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-5 shrink-0 text-dob" />{t}</li>
              ))}
            </ul>
            <Link href="/register" className="btn btn-register mt-6 w-full">Start registration</Link>
          </div>
          <div className="rounded-2xl bg-cyan-light p-6">
            <h2 className="font-bold text-royal">After you register</h2>
            <p className="mt-2 text-[15px] text-navy/85">
              You get a Registration ID right away (e.g. BIESF26-BD-0001). Our team will contact you on WhatsApp within 24–48 hours.
            </p>
          </div>
        </aside>
      </section>

      <section className="bg-grid py-14">
        <div className="container-x">
          <SectionHeading eyebrow="Need help choosing?" title="Not sure where to start?" intro="Message us with your idea. We'll help you pick a category and decide between offline and online." />
          <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg"><WhatsAppIcon className="size-5" /> Chat with DoB on WhatsApp</a>
        </div>
      </section>

      <CtaBanner waHref={waHref} />
    </>
  );
}
