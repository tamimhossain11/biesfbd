"use client";

import { startTransition, useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { sendContact, type ContactState } from "@/app/(site)/contact/actions";
import { Turnstile } from "./Turnstile";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, {});

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center p-8 text-center">
        <CheckCircle2 className="size-12 text-dob" />
        <h3 className="mt-3 text-lg font-bold text-royal">Message sent!</h3>
        <p className="mt-1 text-sm text-navy/75">Thank you. Our team will get back to you soon. For a faster reply, message us on WhatsApp.</p>
      </div>
    );
  }

  return (
    <form
      className="card space-y-4 p-6 sm:p-7"
      onSubmit={(e) => {
        // onSubmit instead of `action` so the visitor's text survives a validation error.
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      <h2 className="text-lg font-bold text-royal">Send us a message</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Name *</label>
          <input id="c-name" name="name" required minLength={2} className="input" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="c-phone">Phone / WhatsApp *</label>
          <input id="c-phone" name="phone" required inputMode="tel" className="input" autoComplete="tel" placeholder="01XXXXXXXXX" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" className="input" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="c-msg">Message *</label>
        <textarea id="c-msg" name="message" required rows={5} className="input" />
      </div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <Turnstile />
      {state.error && <p className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full sm:w-auto">{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
