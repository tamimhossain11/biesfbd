import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { LeadEvent } from "@/components/site/LeadEvent";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

export const metadata: Metadata = { title: "Registration received", robots: { index: false } };

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id = "" } = await searchParams;
  const valid = /^BIESF26-BD-\d{4,}$/.test(id) && (await db.registration.count({ where: { regId: id } })) > 0;
  const s = await getSettings();
  const regId = valid ? id : "BIESF26-BD-XXXX";
  const waHref = waLink(s.whatsapp1, `Hi DoB, I registered for BIESF 2026. My ID is ${regId}.`);
  const emailOn = Boolean(process.env.SMTP_HOST);

  return (
    <section className="bg-grid min-h-[70vh] py-14 sm:py-20">
      <div className="container-x max-w-2xl">
        <div className="card overflow-hidden text-center">
          <div className="h-2 bg-gradient-to-r from-dob via-royal to-orange" />
          <div className="p-7 sm:p-10">
            <CheckCircle2 className="mx-auto size-16 text-dob" />
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-royal">Registration received!</h1>
            {valid ? (
              <>
                <p className="mt-4 text-navy/75">Your Registration ID is</p>
                <p className="mx-auto mt-2 inline-block rounded-2xl bg-royal-50 px-6 py-3 font-mono text-2xl font-bold tracking-wider text-royal ring-1 ring-line sm:text-3xl">{regId}</p>
                <p className="mt-5 text-[15px] text-navy/80">
                  Our team will contact you on WhatsApp within <b>24–48 hours</b>. Please save your ID.{emailOn && " We also sent you a confirmation email."}
                </p>
              </>
            ) : (
              <p className="mt-4 text-navy/75">Our team will contact you on WhatsApp within 24–48 hours.</p>
            )}
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-lg mt-7 w-full sm:w-auto">
              <WhatsAppIcon className="size-5" /> Message us on WhatsApp
            </a>
            <div className="mt-4">
              <Link href="/how-to-join" className="text-sm font-semibold text-royal hover:underline">See what happens next →</Link>
            </div>
          </div>
        </div>
      </div>
      {valid && <LeadEvent regId={regId} />}
    </section>
  );
}
