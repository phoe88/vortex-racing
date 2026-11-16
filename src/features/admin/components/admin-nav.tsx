"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Newspaper, Users, CalendarDays, Trophy, Car, Handshake,
  Image as ImageIcon, Mail, ShieldCheck, UserCog, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const items: { href: string; label: string; Icon: LucideIcon; minRole?: UserRole }[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/news", label: "News", Icon: Newspaper },
  { href: "/admin/drivers", label: "Drivers", Icon: Users },
  { href: "/admin/team", label: "Team & about", Icon: UserCog },
  { href: "/admin/races", label: "Races", Icon: CalendarDays },
  { href: "/admin/standings", label: "Standings", Icon: Trophy },
  { href: "/admin/cars", label: "Cars", Icon: Car },
  { href: "/admin/partners", label: "Partners", Icon: Handshake },
  { href: "/admin/media", label: "Media", Icon: ImageIcon },
  { href: "/admin/subscribers", label: "Subscribers", Icon: Mail },
  { href: "/admin/users", label: "Users & roles", Icon: ShieldCheck, minRole: "admin" },
];

export function AdminNav({ role, onNavigate }: { role: UserRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="space-y-0.5">
      {items
        .filter((i) => !i.minRole || role === "admin")
        .map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active ? "bg-accent text-white" : "text-ice/75 hover:bg-white/6 hover:text-white",
              )}
            >
              <Icon className="size-4" /> {label}
            </Link>
          );
        })}
    </nav>
  );
}
