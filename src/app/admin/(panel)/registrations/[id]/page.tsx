import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileDown, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { deleteRegistration, updateRegistration } from "@/app/admin/actions";
import { requireUser } from "@/lib/auth";
import { STATUSES, STATUS_STYLES } from "@/lib/constants";
import { db } from "@/lib/db";
import type { Member } from "@/lib/registration";
import { ageOn, cn, formatDateTime, waLink } from "@/lib/utils";

export const metadata = { title: "Registration" };

export default async function RegistrationDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const r = await db.registration.findUnique({ where: { id }, include: { notes: { orderBy: { createdAt: "desc" } } } });
  if (!r) notFound();
  let members: Member[] = [];
  try {
    members = JSON.parse(r.members);
  } catch {}
  const age = ageOn(r.dateOfBirth);
  const wa = (phone: string, name: string) => waLink(phone, `Hi ${name}, this is Dreams of Bangladesh about your BIESF 2026 registration (${r.regId}).`);

  const Row = ({ k, v }: { k: string; v?: React.ReactNode }) => (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-2 text-sm">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-medium text-slate-800">{v || <span className="text-slate-400">–</span>}</dd>
    </div>
  );

  return (
    <>
      <Link href="/admin/registrations" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-royal hover:underline"><ArrowLeft className="size-4" /> All registrations</Link>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">{r.fullName}</h1>
        <span className="rounded-lg bg-royal-50 px-2.5 py-1 font-mono text-sm font-bold text-royal">{r.regId}</span>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_STYLES[r.status])}>{r.status}</span>
        <span className="text-xs text-slate-500">Registered {formatDateTime(r.createdAt)}</span>
        <a href={wa(r.whatsapp, r.fullName)} target="_blank" rel="noopener" className="a-btn ml-auto bg-wa text-white hover:bg-wa-600"><WhatsAppIcon className="size-4" /> WhatsApp {r.whatsapp}</a>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="a-card p-5">
            <h2 className="mb-2 font-bold text-navy">A. Participation</h2>
            <dl className="divide-y divide-slate-100">
              <Row k="Mode" v={r.mode} />
              <Row k="Entry" v={r.entryType === "Team" ? `Team of ${r.memberCount}` : "Individual"} />
              <Row k="Category" v={r.category} />
              <Row k="Level" v={r.level} />
            </dl>
          </section>

          <section className="a-card p-5">
            <h2 className="mb-2 font-bold text-navy">B. {r.entryType === "Team" ? "Team leader" : "Student"}</h2>
            <dl className="divide-y divide-slate-100">
              <Row k="Full name" v={r.fullName} />
              <Row k="Date of birth" v={`${r.dateOfBirth}${age !== null ? ` (age ${age})` : ""}`} />
              <Row k="Class / year" v={r.classYear} />
              <Row k="WhatsApp" v={<a className="text-royal hover:underline" href={wa(r.whatsapp, r.fullName)} target="_blank" rel="noopener">{r.whatsapp}</a>} />
              <Row k="Email" v={<a className="text-royal hover:underline" href={`mailto:${r.email}`}>{r.email}</a>} />
              <Row k="District" v={r.district} />
              <Row k="Institution" v={r.institution} />
              <Row k="Passport" v={r.passport} />
            </dl>
          </section>

          <section className="a-card p-5">
            <h2 className="mb-2 font-bold text-navy">C. Team, supervisor &amp; guardian</h2>
            {members.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">#</th><th>Name</th><th>Class</th><th>Institution</th><th>Phone</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((m, i) => (
                      <tr key={i}>
                        <td className="py-2 text-slate-400">{i + 2}</td>
                        <td className="font-medium">{m.name}</td>
                        <td>{m.classYear}</td>
                        <td>{m.institution}</td>
                        <td>{m.phone && <a className="text-royal hover:underline" href={wa(m.phone, m.name)} target="_blank" rel="noopener">{m.phone}</a>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <dl className="divide-y divide-slate-100">
              <Row k="Supervisor" v={r.supervisorName} />
              <Row k="Supervisor inst." v={r.supervisorInstitution} />
              <Row k="Supervisor phone" v={r.supervisorPhone && <a className="text-royal hover:underline" href={wa(r.supervisorPhone, r.supervisorName ?? "")} target="_blank" rel="noopener">{r.supervisorPhone}</a>} />
              <Row k="Guardian" v={r.guardianName} />
              <Row k="Guardian phone" v={r.guardianPhone && <a className="text-royal hover:underline" href={`tel:${r.guardianPhone}`}>{r.guardianPhone}</a>} />
            </dl>
          </section>

          <section className="a-card p-5">
            <h2 className="mb-2 font-bold text-navy">D. Project</h2>
            <dl className="divide-y divide-slate-100">
              <Row k="Title" v={r.projectTitle} />
              <Row k="Stage" v={r.projectStage} />
              <Row k="Paper ready?" v={r.paperReady} />
              <Row k="Heard from" v={r.heardFrom} />
              <Row k="File" v={r.fileName && (
                <a href={`/api/admin/files/${r.fileName}`} target="_blank" className="inline-flex items-center gap-1.5 text-royal hover:underline"><FileDown className="size-4" /> {r.fileOriginal || r.fileName}</a>
              )} />
            </dl>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</h3>
            <p className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm leading-6">{r.projectSummary}</p>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className="a-card p-5">
            <h2 className="font-bold text-navy">Update status</h2>
            <form action={updateRegistration.bind(null, r.id)} className="mt-3 space-y-3">
              <select name="status" defaultValue={r.status} className="a-input">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <textarea name="note" rows={3} placeholder="Add a note (optional), e.g. interview booked for Tuesday 5pm" className="a-input" />
              <SubmitButton className="w-full">Save</SubmitButton>
            </form>
          </section>

          <section className="a-card p-5">
            <h2 className="font-bold text-navy">Notes &amp; history</h2>
            {r.notes.length ? (
              <ul className="mt-3 space-y-3">
                {r.notes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                    <p className="whitespace-pre-line">{n.text}</p>
                    <p className="mt-1 text-xs text-slate-400">{n.author} · {formatDateTime(n.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No notes yet.</p>
            )}
          </section>

          <section className="a-card space-y-2 p-5 text-sm">
            <h2 className="font-bold text-navy">Quick contact</h2>
            <a href={wa(r.whatsapp, r.fullName)} target="_blank" rel="noopener" className="flex items-center gap-2 text-royal hover:underline"><WhatsAppIcon className="size-4 text-wa" /> {r.whatsapp}</a>
            <a href={`tel:${r.whatsapp}`} className="flex items-center gap-2 text-royal hover:underline"><Phone className="size-4" /> Call</a>
            <a href={`mailto:${r.email}?subject=${encodeURIComponent(`BIESF 2026: ${r.regId}`)}`} className="flex items-center gap-2 text-royal hover:underline"><Mail className="size-4" /> {r.email}</a>
          </section>

          {user.role === "ADMIN" && (
            <ConfirmButton action={deleteRegistration.bind(null, r.id)} message={`Delete registration ${r.regId}? This cannot be undone.`} className="w-full justify-center border border-rose-200 bg-white">
              Delete registration
            </ConfirmButton>
          )}
        </aside>
      </div>
    </>
  );
}
