"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fires the Meta Pixel "Lead" + GA4 "generate_lead" events once per registration. */
export function LeadEvent({ regId }: { regId: string }) {
  useEffect(() => {
    const key = `lead-sent-${regId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}
    let tries = 0;
    const fire = () => {
      // Pixel/GA scripts load "afterInteractive"; wait briefly for them.
      if (!window.fbq && !window.gtag && tries++ < 20) return void setTimeout(fire, 250);
      window.fbq?.("track", "Lead", { content_name: "BIESF 2026 Registration" }, { eventID: regId });
      window.gtag?.("event", "generate_lead", { event_category: "registration", event_label: regId });
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
    };
    fire();
  }, [regId]);
  return null;
}
