import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteFaq, saveFaq } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "FAQ" };

function Fields({ f }: { f?: { id: number; question: string; answer: string; sortOrder: number; showOnHome: boolean } }) {
  return (
    <>
      {f && <input type="hidden" name="id" value={f.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_80px]">
        <div><label className="a-label">Question *</label><input name="question" required defaultValue={f?.question} className="a-input" /></div>
        <div><label className="a-label">Order</label><input type="number" name="sortOrder" defaultValue={f?.sortOrder ?? 0} className="a-input" /></div>
      </div>
      <div><label className="a-label">Answer *</label><textarea name="answer" required rows={3} defaultValue={f?.answer} className="a-input" /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="showOnHome" defaultChecked={f?.showOnHome} /> Show on home page (max 5)</label>
    </>
  );
}

export default async function AdminFaq() {
  const faqs = await db.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="FAQ" intro="Questions & answers on the FAQ page. Tick “Show on home page” for up to 5." />
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="a-card">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
              <span className="w-6 text-xs text-slate-400">{f.sortOrder}</span>
              <span className="flex-1 font-semibold">{f.question}</span>
              {f.showOnHome && <span className="rounded-full bg-orange/20 px-2 py-0.5 text-[11px] font-bold text-orange-600">HOME</span>}
            </summary>
            <div className="border-t border-slate-100 p-4">
              <ActionForm action={saveFaq} className="space-y-3"><Fields f={f} /><SubmitButton>Save</SubmitButton></ActionForm>
              <div className="mt-2 flex justify-end"><ConfirmButton action={deleteFaq.bind(null, f.id)} message="Delete this question?" /></div>
            </div>
          </details>
        ))}
        <section className="a-card p-4">
          <h2 className="mb-3 font-bold text-navy">Add question</h2>
          <ActionForm action={saveFaq} className="space-y-3" resetOnSuccess><Fields /><SubmitButton>Add</SubmitButton></ActionForm>
        </section>
      </div>
    </>
  );
}
