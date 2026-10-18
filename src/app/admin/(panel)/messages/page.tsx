import { Check, RotateCcw } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmButton } from "@/components/admin/ui";
import { deleteMessage, toggleMessage } from "@/app/admin/actions";
import { db } from "@/lib/db";
import { cn, formatDateTime, waLink } from "@/lib/utils";

export const metadata = { title: "Contact messages" };

export default async function AdminMessages() {
  const msgs = await db.contactMessage.findMany({ orderBy: [{ handled: "asc" }, { createdAt: "desc" }], take: 300 });
  return (
    <>
      <PageHeader title="Contact messages" intro="Messages from the Contact page form." />
      <div className="space-y-3">
        {msgs.map((m) => (
          <article key={m.id} className={cn("a-card p-4", m.handled && "opacity-60")}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-semibold">{m.name}</p>
              <a href={waLink(m.phone, `Hi ${m.name}, this is Dreams of Bangladesh replying to your message about BIESF 2026.`)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm text-royal hover:underline"><WhatsAppIcon className="size-4 text-wa" /> {m.phone}</a>
              {m.email && <a href={`mailto:${m.email}`} className="text-sm text-royal hover:underline">{m.email}</a>}
              <span className="ml-auto text-xs text-slate-400">{formatDateTime(m.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
            <div className="mt-3 flex gap-2">
              <form action={toggleMessage.bind(null, m.id)}>
                <button className="a-btn border border-slate-300 bg-white">{m.handled ? <><RotateCcw className="size-4" /> Mark as new</> : <><Check className="size-4" /> Mark handled</>}</button>
              </form>
              <ConfirmButton action={deleteMessage.bind(null, m.id)} message="Delete this message?" />
            </div>
          </article>
        ))}
        {!msgs.length && <p className="a-card p-6 text-sm text-slate-500">No messages yet.</p>}
      </div>
    </>
  );
}
