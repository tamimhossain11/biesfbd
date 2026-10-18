import { Analytics } from "@/components/site/Analytics";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/utils";

// Content is edited live from the admin panel, so always render fresh.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const waHref = waLink(s.whatsapp1, "Hi DoB, I want to know more about BIESF 2026.");
  return (
    <>
      <Header waHref={waHref} whatsapp1={s.whatsapp1} whatsapp2={s.whatsapp2} />
      {s.deadlineNotice && (
        <div className="bg-orange px-4 py-2 text-center text-sm font-semibold text-navy">{s.deadlineNotice}</div>
      )}
      <main className="min-h-[60vh]">{children}</main>
      <Footer s={s} />
      <FloatingActions waHref={waHref} registrationOpen={s.registrationOpen} />
      <Analytics pixelId={s.metaPixelId} gaId={s.gaMeasurementId} />
    </>
  );
}
