"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "../icons";

export function Header({ waHref, whatsapp1, whatsapp2 }: { waHref: string; whatsapp1: string; whatsapp2: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const links = NAV_LINKS.filter((l) => l.href !== "/");

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-navy text-[12.5px] text-white/85 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p>
            <span className="font-semibold text-orange">Official Representative of BIESF in Bangladesh</span>
            <span className="mx-2 text-white/40">•</span>Dreams of Bangladesh
          </p>
          <a href={waHref} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-white">
            <WhatsAppIcon className="size-3.5 text-wa" /> {whatsapp1} | {whatsapp2}
          </a>
        </div>
      </div>

      <div className={cn("border-b bg-white/95 backdrop-blur transition-shadow", scrolled ? "border-line shadow-card" : "border-transparent")}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[72px]">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="BIESF 2026 Bangladesh home">
            <Image src="/brand/dob.webp" alt="Dreams of Bangladesh" width={1305} height={459} priority className="h-9 w-auto sm:h-10 lg:h-11" />
            <span className="hidden h-8 w-px bg-line sm:block xl:hidden 2xl:block" />
            <Image src="/brand/biesf.webp" alt="BIESF" width={236} height={144} priority className="hidden h-9 w-auto rounded sm:block lg:h-10 xl:hidden 2xl:block" />
          </Link>

          <nav className="ml-auto hidden xl:block" aria-label="Main">
            <ul className="flex items-center">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "relative whitespace-nowrap rounded-lg px-2 py-2 text-[13.5px] font-medium transition hover:text-royal 2xl:px-2.5",
                      isActive(l.href) ? "text-royal" : "text-navy/80",
                    )}
                  >
                    {l.label}
                    {isActive(l.href) && <span className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-orange" />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-3">
            <Link href="/register" className="btn btn-register whitespace-nowrap px-4 py-2.5 sm:px-5">
              Register Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full text-royal ring-1 ring-line xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white xl:hidden md:top-[100px]">
          <nav className="container-x py-4" aria-label="Mobile">
            <ul className="divide-y divide-line">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn("flex items-center justify-between py-3.5 text-base font-medium", isActive(l.href) ? "text-royal" : "text-navy")}
                  >
                    {l.label}
                    {isActive(l.href) && <span className="size-2 rounded-full bg-orange" />}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3 pb-24">
              <Link href="/register" className="btn btn-register btn-lg">Register Now</Link>
              <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg">
                <WhatsAppIcon className="size-5" /> WhatsApp Us
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
