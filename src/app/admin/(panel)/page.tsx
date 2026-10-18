import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { CATEGORY_NAMES, MODES, STATUSES, STATUS_STYLES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { cn, formatDateTime, startOfTodayDhaka } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const today = startOfTodayDhaka();
  const [total, todayCount, byMode, byCategory, byStatus, recent, s] = await Promise.all([
    db.registration.count(),
    db.registration.count({ where: { createdAt: { gte: today } } }),
    db.registration.groupBy({ by: ["mode"], _count: true }),
    db.registration.groupBy({ by: ["category"], _count: true }),
    db.registration.groupBy({ by: ["status"], _count: true }),
    db.registration.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    getSettings(),
  ]);
  const modeCount = (m: string) => byMode.find((r) => r.mode === m)?._count ?? 0;
  const maxCat = Math.max(1, ...byCategory.map((c) => c._count));

  const cards = [
    { label: "Total registrations", value: total, cls: "bg-royal text-white" },
    { label: "Today", value: todayCount, cls: "bg-orange text-navy" },
    { label: "Offline (Bali)", value: modeCount(MODES[0]), cls: "bg-white" },
    { label: "Online (Zoom)", value: modeCount(MODES[1]), cls: "bg-white" },
    { label: "Not sure", value: modeCount(MODES[2]), cls: "bg-white" },
  ];

  return (
    <>
      {denied && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-800">That page is for Admins only.</p>}
      <PageHeader title="Dashboard" intro={<>Registration is <b className={s.registrationOpen ? "text-emerald-700" : "text-rose-700"}>{s.registrationOpen ? "OPEN" : "CLOSED"}</b> on the website.</>}>
        <Link href="/api/admin/export" className="a-btn bg-emerald-600 text-white hover:bg-emerald-700"><Download className="size-4" /> Export to Excel</Link>
        <Link href="/admin/registrations" className="a-btn bg-royal text-white hover:bg-royal-600">All registrations <ArrowRight className="size-4" /></Link>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={cn("rounded-xl border border-slate-200 p-4", c.cls)}>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="a-card p-5">
          <h2 className="font-bold text-navy">By category</h2>
          <ul className="mt-4 space-y-3">
            {CATEGORY_NAMES.map((c) => {
              const n = byCategory.find((r) => r.category === c)?._count ?? 0;
              return (
                <li key={c}>
                  <Link href={`/admin/registrations?category=${encodeURIComponent(c)}`} className="group block">
                    <div className="flex justify-between text-sm"><span className="group-hover:text-royal group-hover:underline">{c}</span><b>{n}</b></div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-royal" style={{ width: `${(n / maxCat) * 100}%` }} /></div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="a-card p-5">
          <h2 className="font-bold text-navy">By status</h2>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {STATUSES.map((st) => {
              const n = byStatus.find((r) => r.status === st)?._count ?? 0;
              return (
                <li key={st}>
                  <Link href={`/admin/registrations?status=${encodeURIComponent(st)}`} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-royal">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLES[st])}>{st}</span>
                    <b>{n}</b>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="a-card mt-6 overflow-hidden">
        <h2 className="border-b border-slate-200 p-5 font-bold text-navy">Latest registrations</h2>
        {recent.length ? (
          <ul className="divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/registrations/${r.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm hover:bg-slate-50">
                  <span className="font-mono text-xs font-semibold text-royal">{r.regId}</span>
                  <span className="font-semibold">{r.fullName}</span>
                  <span className="text-slate-500">{r.entryType === "Team" ? `Team of ${r.memberCount}` : "Individual"} · {r.mode}</span>
                  <span className={cn("ml-auto rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLES[r.status])}>{r.status}</span>
                  <span className="w-full text-xs text-slate-400 sm:w-auto">{formatDateTime(r.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-5 text-sm text-slate-500">No registrations yet.</p>
        )}
      </section>
    </>
  );
}
