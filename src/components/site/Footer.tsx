import Link from "next/link";
import { Globe, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { NAV_LINKS } from "@/lib/constants";
import { waLink } from "@/lib/utils";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, YoutubeIcon } from "../icons";
import { LogoStrip } from "./LogoStrip";

export function Footer({ s }: { s: SiteSettings }) {
  const socials = [
    { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((x) => x.href);

  return (
    <footer className="relative overflow-hidden bg-navy pb-24 text-white/80 md:pb-0">
      <div className="h-1.5 bg-orange" />
      <div className="bg-grid-dark">
        <div className="container-x py-12">
          <LogoStrip compact />
          <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
            <div>
              <h2 className="text-lg font-bold text-white">BIESF 2026 Bangladesh</h2>
              <p className="mt-3 text-sm leading-6">
                <span className="font-semibold text-orange">Dreams of Bangladesh</span>: Official Representative &amp; National
                Selection Body of BIESF for Bangladesh.
              </p>
              <p className="mt-3 rounded-xl bg-white/5 p-3 text-xs leading-5 ring-1 ring-white/10">
                DoB selects Bangladesh&apos;s participants. International judging and awards are decided by ICGI.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Quick links</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-orange">{l.label}</Link>
                  </li>
                ))}
                <li><Link href="/register" className="font-semibold text-orange hover:underline">Register</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact Dreams of Bangladesh</h2>
              <ul className="mt-3 space-y-2.5 text-sm">
                {[s.whatsapp1, s.whatsapp2].filter(Boolean).map((n) => (
                  <li key={n}>
                    <a href={waLink(n, "Hi DoB, I want to know more about BIESF 2026.")} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                      <WhatsAppIcon className="size-4 text-wa" /> WhatsApp {n}
                    </a>
                  </li>
                ))}
                {s.email && (
                  <li>
                    <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="size-4 text-orange" /> {s.email}</a>
                  </li>
                )}
                {s.website && (
                  <li>
                    <a href={s.website} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                      <Globe className="size-4 text-orange" /> {s.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </li>
                )}
                {s.address && (
                  <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-orange" /> {s.address}</li>
                )}
              </ul>
              <div className="mt-4 flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener" aria-label={label} className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-orange hover:text-navy">
                    <Icon className="size-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Dreams of Bangladesh. All rights reserved.</p>
            <p>BIESF is organised by ICGI (Indonesian Centre for Giftedness Innovation), Indonesia.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
