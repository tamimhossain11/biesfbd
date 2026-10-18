import Link from "next/link";
import { WhatsAppIcon } from "../icons";

/**
 * Desktop/tablet: floating WhatsApp button (bottom-right).
 * Mobile: sticky bottom bar with [Register Now] + [WhatsApp], which replaces the floating button
 * so the two don't overlap.
 */
export function FloatingActions({ waHref, registrationOpen }: { waHref: string; registrationOpen: boolean }) {
  return (
    <>
      <a
        href={waHref}
        target="_blank"
        rel="noopener"
        aria-label="Chat with Dreams of Bangladesh on WhatsApp"
        className="wa-pulse group fixed bottom-6 right-6 z-40 hidden size-14 place-items-center rounded-full bg-wa text-white shadow-lift transition hover:scale-105 md:grid"
      >
        <WhatsAppIcon className="size-7" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-card transition group-hover:opacity-100">
          Chat with us
        </span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2.5">
          <Link href="/register" className="btn btn-register py-3">
            {registrationOpen ? "Register Now" : "Registration"}
          </Link>
          <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa py-3">
            <WhatsAppIcon className="size-5" /> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
