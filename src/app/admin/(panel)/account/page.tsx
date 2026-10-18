import { PageHeader } from "@/components/admin/PageHeader";
import { ActionForm, SubmitButton } from "@/components/admin/ui";
import { changePassword } from "@/app/admin/actions";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "My account" };

export default async function Account() {
  const me = await requireUser();
  return (
    <>
      <PageHeader title="My account" intro={`${me.name} · ${me.email} · ${me.role === "ADMIN" ? "Admin" : "Editor"}`} />
      <section className="a-card max-w-md p-5">
        <h2 className="mb-3 font-bold text-navy">Change password</h2>
        <ActionForm action={changePassword} className="space-y-3" resetOnSuccess>
          <div><label className="a-label">Current password</label><input name="current" type="password" required autoComplete="current-password" className="a-input" /></div>
          <div><label className="a-label">New password (8+ characters)</label><input name="next" type="password" minLength={8} required autoComplete="new-password" className="a-input" /></div>
          <SubmitButton>Change password</SubmitButton>
        </ActionForm>
      </section>
    </>
  );
}
