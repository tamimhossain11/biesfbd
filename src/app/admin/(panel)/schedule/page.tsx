import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteSchedule, saveSchedule } from "@/app/admin/actions";
import { db } from "@/lib/db";

export const metadata = { title: "Schedule" };

function Fields({ s }: { s?: { id: number; date: string; activity: string; bdTime: string; mode: string; sortOrder: number } }) {
  return (
    <div className="grid items-end gap-2 sm:grid-cols-[100px_1fr_150px_110px_70px_auto]">
      {s && <input type="hidden" name="id" value={s.id} />}
      <div><label className="a-label">Date</label><input name="date" required defaultValue={s?.date} placeholder="16 Nov" className="a-input" /></div>
      <div><label className="a-label">Activity</label><input name="activity" required defaultValue={s?.activity} className="a-input" /></div>
      <div><label className="a-label">BD time</label><input name="bdTime" defaultValue={s?.bdTime} placeholder="08:00 AM" className="a-input" /></div>
      <div>
        <label className="a-label">Where</label>
        <select name="mode" defaultValue={s?.mode ?? "Offline"} className="a-input"><option value="Offline">Bali</option><option value="Online">Zoom</option></select>
      </div>
      <div><label className="a-label">Order</label><input type="number" name="sortOrder" defaultValue={s?.sortOrder ?? 0} className="a-input" /></div>
      <SubmitButton>{s ? "Save" : "Add"}</SubmitButton>
    </div>
  );
}

export default async function AdminSchedule() {
  const rows = await db.scheduleItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <PageHeader title="Schedule" intro={<>Event schedule in Bangladesh time, shown on the BIESF 2026 page. Main event dates are in <Link href="/admin/settings" className="text-royal underline">Settings</Link>.</>} />
      <div className="a-card divide-y divide-slate-100">
        {rows.map((s) => (
          <div key={s.id} className="flex flex-col gap-2 p-4 lg:flex-row lg:items-end">
            <ActionForm action={saveSchedule} className="flex-1"><Fields s={s} /></ActionForm>
            <ConfirmButton action={deleteSchedule.bind(null, s.id)} message="Delete this row?" />
          </div>
        ))}
        <div className="bg-slate-50 p-4">
          <p className="mb-2 text-sm font-bold text-navy">Add row</p>
          <ActionForm action={saveSchedule} resetOnSuccess><Fields /></ActionForm>
        </div>
      </div>
    </>
  );
}
