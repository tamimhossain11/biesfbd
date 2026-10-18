"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void };
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile widget, rendered explicitly so it also works when the component
 * mounts later (e.g. the last step of the registration form). Renders nothing without a site key.
 * The widget adds a hidden `cf-turnstile-response` input inside the surrounding form.
 */
export function Turnstile() {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!key || !ref.current) return;
    let id: string | undefined;
    let cancelled = false;
    const render = () => {
      if (!cancelled && ref.current && window.turnstile) id = window.turnstile.render(ref.current, { sitekey: key, theme: "light" });
    };
    if (window.turnstile) render();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SRC;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
    }
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, [key]);

  if (!key) return null;
  return <div ref={ref} />;
}
