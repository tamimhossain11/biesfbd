import type { Metadata } from "next";
import { Globe, Mail, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from "@/components/icons";
import { ContactForm } from "@/components/site/ContactForm";
import { PageHero } from "@/components/site/blocks";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Dreams of Bangladesh about BIESF 2026 on WhatsApp, Facebook, Instagram or YouTube.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const socials = [
    { href: s.facebook, label: "Facebook", handle: "dreams.of.bangladesh", Icon: FacebookIcon, cls: "bg-[#1877f2]" },
    { href: s.instagram, label: "Instagram", handle: "dob.bd", Icon: InstagramIcon, cls: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
    { href: s.youtube, label: "YouTube", handle: "Dreams of Bangladesh", Icon: YoutubeIcon, cls: "bg-[#ff0000]" },
  ].filter((x) => x.href);

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to Dreams of Bangladesh" subtitle="The fastest way to reach us is WhatsApp. For fees & packages, contact us on WhatsApp." image="/photos/diamond-beach.webp" />
      <section className="container-x grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[s.whatsapp1, s.whatsapp2].filter(Boolean).map((n) => (
            <a key={n} href={waLink(n, "Hi DoB, I want to know more about BIESF 2026.")} target="_blank" rel="noopener" className="card flex items-center gap-4 p-5 transition hover:shadow-lift">
              <span className="grid size-12 place-items-center rounded-full bg-wa text-white"><WhatsAppIcon className="size-6" /></span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-navy/60">WhatsApp</span>
                <span className="text-xl font-bold text-royal">{n}</span>
              </span>
              <span className="btn btn-wa ml-auto hidden px-4 py-2 sm:inline-flex">Chat</span>
            </a>
          ))}

          <div className="card divide-y divide-line">
            {socials.map(({ href, label, handle, Icon, cls }) => (
              <a key={label} href={href} target="_blank" rel="noopener" className="flex items-center gap-4 p-4 hover:bg-royal-50/60">
                <span className={`grid size-10 place-items-center rounded-full text-white ${cls}`}><Icon className="size-5" /></span>
                <span><span className="block text-sm font-semibold">{label}</span><span className="text-sm text-navy/65">{handle}</span></span>
              </a>
            ))}
            {s.website && (
              <a href={s.website} target="_blank" rel="noopener" className="flex items-center gap-4 p-4 hover:bg-royal-50/60">
                <span className="grid size-10 place-items-center rounded-full bg-royal text-white"><Globe className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Website</span><span className="text-sm text-navy/65">{s.website.replace(/^https?:\/\/(www\.)?/, "")}</span></span>
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`} className="flex items-center gap-4 p-4 hover:bg-royal-50/60">
                <span className="grid size-10 place-items-center rounded-full bg-orange text-navy"><Mail className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Email</span><span className="text-sm text-navy/65">{s.email}</span></span>
              </a>
            )}
            {s.address && (
              <div className="flex items-center gap-4 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dob text-white"><MapPin className="size-5" /></span>
                <span><span className="block text-sm font-semibold">Office</span><span className="text-sm text-navy/65">{s.address}</span></span>
              </div>
            )}
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
