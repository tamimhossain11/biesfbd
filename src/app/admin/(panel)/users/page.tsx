import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { createUser, deleteUser, resetUserPassword, setUserRole } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Team users" };

export default async function AdminUsers() {
  const me = await requireAdmin();
  const users = await db.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <PageHeader title="Team users" intro="Admins can do everything. Editors can manage registrations and edit website content, but not settings or users." />
      <div className="a-card divide-y divide-slate-100">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-48 flex-1">
              <p className="font-semibold">{u.name} {u.id === me.uid && <span className="text-xs font-normal text-slate-400">(you)</span>}</p>
              <p className="text-xs text-slate-500">{u.email} · since {formatDate(u.createdAt)}</p>
            </div>
            {u.id === me.uid ? (
              <span className="rounded-full bg-royal-50 px-2.5 py-1 text-xs font-bold text-royal">{u.role}</span>
            ) : (
              <>
                <form action={setUserRole.bind(null, u.id)} className="flex gap-1">
                  <select name="role" defaultValue={u.role} className="a-input w-auto"><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></select>
                  <SubmitButton>Set</SubmitButton>
                </form>
                <details className="relative">
                  <summary className="a-btn cursor-pointer list-none border border-slate-300 bg-white [&::-webkit-details-marker]:hidden">Reset password</summary>
                  <ActionForm action={resetUserPassword} className="absolute right-0 z-10 mt-1 w-64 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                    <input type="hidden" name="id" value={u.id} />
                    <input name="password" type="text" minLength={8} required placeholder="New password (8+ chars)" className="a-input" />
                    <SubmitButton className="w-full">Reset</SubmitButton>
                  </ActionForm>
                </details>
                <ConfirmButton action={deleteUser.bind(null, u.id)} message={`Remove ${u.email}?`} />
              </>
            )}
          </div>
        ))}
      </div>

      <section className="a-card mt-6 max-w-xl p-5">
        <h2 className="mb-3 font-bold text-navy">Add team member</h2>
        <ActionForm action={createUser} className="space-y-3" resetOnSuccess>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="a-label">Name</label><input name="name" required className="a-input" /></div>
            <div><label className="a-label">Email</label><input name="email" type="email" required className="a-input" /></div>
            <div><label className="a-label">Password</label><input name="password" type="text" minLength={8} required className="a-input" /></div>
            <div><label className="a-label">Role</label><select name="role" className="a-input"><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></select></div>
          </div>
          <SubmitButton>Create user</SubmitButton>
        </ActionForm>
      </section>
    </>
  );
}
