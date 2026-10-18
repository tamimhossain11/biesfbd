import { NamedIcon } from "@/components/icons";
import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteSupport, saveSupport } from "@/app/admin/actions";
import { SUPPORT_ICONS } from "@/lib/constants";
import { db } from "@/lib/db";

export const metadata = { title: "Support list" };

function Fields({ s }: { s?: { id: number; title: string; description: string; icon: string; sortOrder: number } }) {
  return (
    <>
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="grid gap-3 sm:grid-cols-[1fr_180px_80px]">
        <div><label className="a-label">Title *</label><input name="title" required defaultValue={s?.title} className="a-input" /></div>
        <div>
          <label className="a-label">Icon</label>
          <select name="icon" defaultValue={s?.icon ?? "Sparkles"} className="a-input">{SUPPORT_ICONS.map((i) => <option key={i}>{i}</option>)}</select>
        </div>
        <div><label className="a-label">Order</label><input type="number" name="sortOrder" defaultValue={s?.sortOrder ?? 0} className="a-input" /></div>
      </div>
      <div><label className="a-label">Description *</label><textarea name="description" required rows={3} defaultValue={s?.description} className="a-input" /></div>
    </>
  );
}

export default async function AdminSupport() {
  const items = await db.supportItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="Support list" intro="How DoB helps students: shown on the Support page." />
      <div className="space-y-3">
        {items.map((s) => (
          <details key={s.id} className="a-card">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4 font-semibold [&::-webkit-details-marker]:hidden">
              <NamedIcon name={s.icon} className="size-5 text-royal" /> {s.title}
            </summary>
            <div className="border-t border-slate-100 p-4">
              <ActionForm action={saveSupport} className="space-y-3"><Fields s={s} /><SubmitButton>Save</SubmitButton></ActionForm>
              <div className="mt-2 flex justify-end"><ConfirmButton action={deleteSupport.bind(null, s.id)} message={`Delete "${s.title}"?`} /></div>
            </div>
          </details>
        ))}
        <section className="a-card p-4">
          <h2 className="mb-3 font-bold text-navy">Add item</h2>
          <ActionForm action={saveSupport} className="space-y-3" resetOnSuccess><Fields /><SubmitButton>Add</SubmitButton></ActionForm>
        </section>
      </div>
    </>
  );
}
