import type { Metadata } from "next";
import { Clock, Lock, ShieldCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { RegisterForm } from "@/components/site/RegisterForm";
import { PageHero } from "@/components/site/blocks";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Register",
  description: "Register for the Bangladesh selection of BIESF 2026. Individuals and teams (up to 6 + 1 supervisor). Offline in Bali or online on Zoom.",
};

export default async function RegisterPage() {
  const s = await getSettings();
  const waHref = waLink(s.whatsapp1, "Hi DoB, I need help with the BIESF 2026 registration.");

  return (
    <>
      <PageHero eyebrow="Register" title="Register for BIESF 2026" subtitle="Step 1 of your journey to Bali. It takes about 5 minutes. Individuals and teams welcome." image="/photos/hero-ulun-danu.webp" />
      <section className="container-x grid gap-8 pb-16 pt-6 lg:grid-cols-[1fr_300px]">
        <div>
          {s.registrationOpen ? (
            <RegisterForm directUpload={Boolean(process.env.BLOB_READ_WRITE_TOKEN)} />
          ) : (
            <div className="card p-8 text-center">
              <Lock className="mx-auto size-10 text-royal" />
              <h2 className="mt-3 text-xl font-bold text-royal">Online registration is currently closed</h2>
              <p className="mt-2 text-navy/75">Please contact us on WhatsApp and our team will help you.</p>
              <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa mt-5"><WhatsAppIcon className="size-5" /> WhatsApp Us</a>
            </div>
          )}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="card p-5">
            <h2 className="font-bold text-royal">What happens next?</h2>
            <ul className="mt-3 space-y-3 text-sm text-navy/80">
              <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-dob" /> You get a Registration ID instantly.</li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-dob" /> We contact you on WhatsApp within 24–48 hours.</li>
              <li className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-dob" /> Project review and a short interview with DoB.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-cyan-light p-5 text-sm">
            <p className="font-bold text-royal">Need help with the form?</p>
            <p className="mt-1 text-navy/75">For fees &amp; packages or any question, contact us on WhatsApp.</p>
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa mt-3 w-full"><WhatsAppIcon className="size-4" /> {s.whatsapp1}</a>
          </div>
        </aside>
      </section>
    </>
  );
}
