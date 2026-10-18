/* eslint-disable @next/next/no-img-element */
import { Database } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, SubmitButton } from "@/components/admin/ui";
import { saveSettingsAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { getSettings, type SiteSettings } from "@/lib/settings";

export const metadata = { title: "Settings & dates" };

export default async function AdminSettings() {
  await requireAdmin();
  const s = await getSettings();

  const Text = ({ k, label, hint, placeholder }: { k: keyof SiteSettings; label: string; hint?: string; placeholder?: string }) => (
    <div>
      <label className="a-label" htmlFor={k}>{label}</label>
      <input id={k} name={k} defaultValue={String(s[k] ?? "")} placeholder={placeholder} className="a-input" />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
  const Toggle = ({ k, label, hint }: { k: keyof SiteSettings; label: string; hint: string }) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 has-[:checked]:border-royal has-[:checked]:bg-royal-50">
      <input type="checkbox" name={k} defaultChecked={Boolean(s[k])} className="mt-1 size-4 accent-[#163496]" />
      <span><span className="block text-sm font-semibold">{label}</span><span className="text-xs text-slate-500">{hint}</span></span>
    </label>
  );
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="a-card p-5">
      <h2 className="mb-4 font-bold text-navy">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );

  return (
    <>
      <PageHeader title="Settings & dates" intro="Changes go live on the website immediately.">
        <a href="/api/admin/backup" className="a-btn border border-slate-300 bg-white"><Database className="size-4" /> Download full backup (JSON)</a>
      </PageHeader>
      <ActionForm action={saveSettingsAction} className="max-w-4xl space-y-5">
        <Section title="Switches">
          <Toggle k="registrationOpen" label="Registration open" hint="When off, the Register page shows “contact us on WhatsApp” and new submissions are blocked." />
          <Toggle k="feesSectionEnabled" label="Show custom fees text (keep OFF)" hint="When off, the site only says “For fees & packages, contact us on WhatsApp.” Never put prices, bank details or QR codes here." />
          <div className="sm:col-span-2">
            <label className="a-label" htmlFor="feesText">Fees text (only used when the switch above is ON)</label>
            <textarea id="feesText" name="feesText" rows={2} defaultValue={s.feesText} className="a-input" />
          </div>
        </Section>

        <Section title="Event dates & venue">
          <Text k="offlineDates" label="Offline dates (long)" placeholder="16–20 November 2026" />
          <Text k="offlineShort" label="Offline dates (short)" placeholder="16–20 Nov" />
          <Text k="onlineDates" label="Online dates (long)" placeholder="24–27 November 2026" />
          <Text k="onlineShort" label="Online dates (short)" placeholder="24–27 Nov" />
          <Text k="venueName" label="Venue name" />
          <Text k="venueAddress" label="Venue address" />
          <div className="sm:col-span-2">
            <Text k="deadlineNotice" label="Notice bar (optional)" hint="Shown in an orange bar at the top of every page, e.g. a deadline. Leave EMPTY to hide. Remember to clear it once the date passes." />
          </div>
        </Section>

        <Section title="Contact (Dreams of Bangladesh only)">
          <Text k="whatsapp1" label="WhatsApp number 1 (main)" hint="Used by all WhatsApp buttons." />
          <Text k="whatsapp2" label="WhatsApp number 2" />
          <Text k="email" label="Email" placeholder="info@…" />
          <Text k="address" label="Office address" />
          <Text k="website" label="Website" />
          <Text k="facebook" label="Facebook URL" />
          <Text k="instagram" label="Instagram URL" />
          <Text k="youtube" label="YouTube URL" />
          <div className="sm:col-span-2">
            <Text k="notifyEmails" label="Send new-registration alerts to" hint="Comma-separated emails for the DoB team. Needs SMTP set up on the server." placeholder="team@…, someone@…" />
          </div>
        </Section>

        <Section title="Media">
          <div>
            <label className="a-label">Home banner photo</label>
            <img src={s.heroImage} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            <input type="file" name="heroImageFile" accept="image/jpeg,image/png,image/webp" className="text-sm" />
            <label className="mt-2 flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" name="resetHero" /> Reset to default Bali photo</label>
          </div>
          <div>
            <label className="a-label">Official ICGI letter (About page)</label>
            {s.authorizationLetter ? <img src={s.authorizationLetter} alt="" className="mb-2 h-24 rounded-lg border object-contain" /> : <p className="mb-2 text-xs text-slate-400">None: the section is hidden on the About page.</p>}
            <input type="file" name="authorizationLetterFile" accept="image/jpeg,image/png,image/webp" className="text-sm" />
            {s.authorizationLetter && <label className="mt-2 flex items-center gap-1.5 text-xs text-slate-600"><input type="checkbox" name="removeLetter" /> Remove</label>}
          </div>
          <div className="sm:col-span-2">
            <Text k="promoVideoUrl" label="Promo video (YouTube link)" placeholder="https://www.youtube.com/watch?v=…" hint="Shown on the home page. Empty = a link to the YouTube channel." />
          </div>
        </Section>

        <Section title="Tracking">
          <Text k="metaPixelId" label="Meta (Facebook) Pixel ID" placeholder="123456789012345" hint="Sends PageView, and a “Lead” event when a registration succeeds." />
          <Text k="gaMeasurementId" label="Google Analytics 4 ID" placeholder="G-XXXXXXXXXX" />
        </Section>

        <div className="sticky bottom-0 -mx-1 rounded-xl bg-slate-100/90 p-1 backdrop-blur"><SubmitButton className="w-full py-3 sm:w-auto">Save settings</SubmitButton></div>
      </ActionForm>
    </>
  );
}
