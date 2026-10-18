import { PageHeader } from "@/components/admin/PageHeader";
import { ImageInput } from "@/components/admin/ImageInput";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteAchievement, saveAchievement } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "Achievements" };

type A = Awaited<ReturnType<typeof db.achievement.findMany>>[number];

function Fields({ a }: { a?: A }) {
  const num = (name: keyof A, label: string) => (
    <div>
      <label className="a-label">{label}</label>
      <input type="number" min={0} name={name} defaultValue={(a?.[name] as number | null) ?? ""} className="a-input" />
    </div>
  );
  return (
    <>
      {a && <input type="hidden" name="id" value={a.id} />}
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_80px]">
        <div><label className="a-label">Event *</label><input name="event" required defaultValue={a?.event} placeholder="WICE 2026" className="a-input" /></div>
        <div><label className="a-label">Country</label><input name="location" defaultValue={a?.location} placeholder="Malaysia" className="a-input" /></div>
        <div><label className="a-label">Order</label><input type="number" name="sortOrder" defaultValue={a?.sortOrder ?? 0} className="a-input" /></div>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {num("teams", "Teams")}{num("gold", "Gold")}{num("silver", "Silver")}{num("bronze", "Bronze")}{num("platinum", "Platinum")}
      </div>
      <div><label className="a-label">Special award</label><input name="special" defaultValue={a?.special ?? ""} placeholder="IYSA Special Award" className="a-input" /></div>
      <div><label className="a-label">Summary</label><textarea name="summary" rows={2} defaultValue={a?.summary} className="a-input" /></div>
      <ImageInput current={a?.image} label="Photo" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="showOnHome" defaultChecked={a?.showOnHome ?? true} /> Show on home page</label>
    </>
  );
}

export default async function AdminAchievements() {
  const items = await db.achievement.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="Achievements" intro="Shown on the home page (counting numbers) and the Achievements page. Leave a number empty to hide it." />
      <div className="space-y-4">
        {items.map((a) => (
          <details key={a.id} className="a-card group">
            <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold [&::-webkit-details-marker]:hidden">
              <span>{a.event} <span className="font-normal text-slate-500">· {a.location}</span></span>
              <span className="text-xs text-royal group-open:hidden">Edit</span>
            </summary>
            <div className="border-t border-slate-100 p-4">
              <ActionForm action={saveAchievement} className="space-y-3">
                <Fields a={a} />
                <SubmitButton>Save</SubmitButton>
              </ActionForm>
              <div className="mt-2 flex justify-end"><ConfirmButton action={deleteAchievement.bind(null, a.id)} message={`Delete ${a.event}?`} /></div>
            </div>
          </details>
        ))}
        <section className="a-card p-4">
          <h2 className="mb-3 font-bold text-navy">Add achievement</h2>
          <ActionForm action={saveAchievement} className="space-y-3" resetOnSuccess>
            <Fields />
            <SubmitButton>Add</SubmitButton>
          </ActionForm>
        </section>
      </div>
    </>
  );
}
