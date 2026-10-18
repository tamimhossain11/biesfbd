"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock, HelpCircle, Image as ImageIcon, Inbox, KeyRound, LayoutDashboard, LifeBuoy, Medal, Newspaper, Settings, UserCog, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    label: "Registrations",
    items: [
      { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
      { href: "/admin/registrations", label: "Registrations", Icon: Users },
      { href: "/admin/messages", label: "Contact messages", Icon: Inbox },
    ],
  },
  {
    label: "Edit website",
    items: [
      { href: "/admin/news", label: "News & results", Icon: Newspaper },
      { href: "/admin/achievements", label: "Achievements", Icon: Medal },
      { href: "/admin/gallery", label: "Gallery", Icon: ImageIcon },
      { href: "/admin/faq", label: "FAQ", Icon: HelpCircle },
      { href: "/admin/support", label: "Support list", Icon: LifeBuoy },
      { href: "/admin/schedule", label: "Schedule", Icon: CalendarClock },
    ],
  },
  {
    label: "Admin",
    adminOnly: true,
    items: [
      { href: "/admin/settings", label: "Settings & dates", Icon: Settings },
      { href: "/admin/users", label: "Team users", Icon: UserCog },
    ],
  },
];

export function AdminNav({ isAdmin, unread }: { isAdmin: boolean; unread: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav className="space-y-5">
      {GROUPS.filter((g) => !g.adminOnly || isAdmin).map((g) => (
        <div key={g.label}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">{g.label}</p>
          <ul className="mt-1.5 space-y-0.5">
            {g.items.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link href={href} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition", active(href) ? "bg-white text-royal" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                  <Icon className="size-4" /> {label}
                  {href === "/admin/messages" && unread > 0 && <span className="ml-auto rounded-full bg-orange px-1.5 text-[11px] font-bold text-navy">{unread}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <Link href="/admin/account" className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium", active("/admin/account") ? "bg-white text-royal" : "text-white/80 hover:bg-white/10")}>
          <KeyRound className="size-4" /> My account
        </Link>
      </div>
    </nav>
  );
}
