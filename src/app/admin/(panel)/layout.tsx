import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout } from "../login/actions";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | BIESF Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await db.contactMessage.count({ where: { handled: false } });
  const nav = <AdminNav isAdmin={user.role === "ADMIN"} unread={unread} />;

  const footer = (
    <div className="border-t border-white/10 pt-4">
      <p className="truncate px-3 text-sm font-semibold text-white">{user.name}</p>
      <p className="truncate px-3 text-xs text-white/50">{user.email} · {user.role === "ADMIN" ? "Admin" : "Editor"}</p>
      <div className="mt-3 flex gap-1 px-1">
        <Link href="/" target="_blank" className="a-btn flex-1 text-white/80 hover:bg-white/10"><ExternalLink className="size-4" /> Site</Link>
        <form action={logout} className="flex-1">
          <button className="a-btn w-full whitespace-nowrap text-white/80 hover:bg-white/10"><LogOut className="size-4" /> Log out</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-navy p-3 lg:flex">
        <Link href="/admin" className="mb-5 flex items-center gap-2 rounded-xl bg-white p-2">
          <Image src="/brand/dob.webp" alt="DoB" width={1305} height={459} className="h-8 w-auto" />
          <span className="text-xs font-bold leading-tight text-royal">BIESF 2026<br />Admin</span>
        </Link>
        <div className="flex-1 overflow-y-auto">{nav}</div>
        {footer}
      </aside>

      <details className="group sticky top-0 z-30 bg-navy lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-white [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-bold"><Image src="/brand/dob.webp" alt="" width={1305} height={459} className="h-7 w-auto rounded bg-white p-0.5" /> BIESF Admin</span>
          <Menu className="size-6" />
        </summary>
        <div className="max-h-[80vh] overflow-y-auto p-3 pt-0">{nav}<div className="mt-4">{footer}</div></div>
      </details>

      <main className="p-4 sm:p-6 lg:ml-60 lg:p-8">{children}</main>
    </div>
  );
}
