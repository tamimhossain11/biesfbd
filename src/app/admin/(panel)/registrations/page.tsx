import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { PageHeader } from "@/components/admin/PageHeader";
import { CATEGORY_NAMES, LEVELS, MODES, STATUSES, STATUS_STYLES } from "@/lib/constants";
import { db } from "@/lib/db";
import { buildWhere, readFilters, toQuery } from "@/lib/regFilters";
import { cn, formatDateTime, waLink } from "@/lib/utils";

export const metadata = { title: "Registrations" };
const PER_PAGE = 25;

export default async function RegistrationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const f = readFilters(sp);
  const page = Math.max(1, Number(sp.page) || 1);
  const where = buildWhere(f);
  const [total, rows] = await Promise.all([
    db.registration.count({ where }),
    db.registration.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const filtered = Object.values(f).some(Boolean);

  const select = (name: keyof typeof f, label: string, options: readonly string[]) => (
    <select name={name} defaultValue={f[name] ?? ""} className="a-input w-auto min-w-0">
      <option value="">{label}</option>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );

  return (
    <>
      <PageHeader title="Registrations" intro={`${total} ${filtered ? "matching" : "total"} registration${total === 1 ? "" : "s"}`}>
        <a href={`/api/admin/export${toQuery(f)}`} className="a-btn bg-emerald-600 text-white hover:bg-emerald-700"><Download className="size-4" /> Export {filtered ? "filtered" : "all"} to Excel</a>
      </PageHeader>

      <form className="a-card mb-4 flex flex-wrap gap-2 p-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={f.q} placeholder="Search name, ID, phone, email, institution, project…" className="a-input pl-9" />
        </div>
        {select("status", "All statuses", STATUSES)}
        {select("mode", "All modes", MODES)}
        {select("category", "All categories", CATEGORY_NAMES)}
        {select("level", "All levels", LEVELS)}
        {select("type", "Individual & team", ["Individual", "Team"])}
        <button className="a-btn bg-royal text-white">Filter</button>
        {filtered && <Link href="/admin/registrations" className="a-btn text-slate-600 hover:bg-slate-100">Clear</Link>}
      </form>

      <div className="a-card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name / institution</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registered</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><Link href={`/admin/registrations/${r.id}`} className="font-mono text-xs font-semibold text-royal hover:underline">{r.regId}</Link></td>
                <td className="px-4 py-3">
                  <Link href={`/admin/registrations/${r.id}`} className="font-semibold hover:text-royal">{r.fullName}</Link>
                  <p className="text-xs text-slate-500">{r.institution} · {r.district}</p>
                </td>
                <td className="px-4 py-3 text-xs">
                  <p className="font-medium">{r.entryType === "Team" ? `Team (${r.memberCount})` : "Individual"}</p>
                  <p className="text-slate-500">{r.mode} · {r.level}</p>
                </td>
                <td className="px-4 py-3 text-xs">{r.category}</td>
                <td className="px-4 py-3"><span className={cn("whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_STYLES[r.status])}>{r.status}</span></td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{formatDateTime(r.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <a href={waLink(r.whatsapp, `Hi ${r.fullName}, this is Dreams of Bangladesh about your BIESF 2026 registration (${r.regId}).`)} target="_blank" rel="noopener" className="a-btn bg-wa px-2.5 py-1.5 text-white hover:bg-wa-600" title="Open WhatsApp chat">
                    <WhatsAppIcon className="size-4" />
                  </a>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No registrations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link href={`/admin/registrations${toQuery(f, { page: String(page - 1) })}`} className="a-btn border border-slate-300 bg-white"><ChevronLeft className="size-4" /> Prev</Link>}
            {page < pages && <Link href={`/admin/registrations${toQuery(f, { page: String(page + 1) })}`} className="a-btn border border-slate-300 bg-white">Next <ChevronRight className="size-4" /></Link>}
          </div>
        </div>
      )}
    </>
  );
}
