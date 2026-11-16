import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-9", className)}>
      <defs>
        <linearGradient id="vx" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff1a45" />
          <stop offset="1" stopColor="#b3001f" />
        </linearGradient>
      </defs>
      <path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill="url(#vx)" />
      <path d="M18 8h12l-6 13-6-13Z" fill="#ffc400" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark className="transition-transform duration-300 group-hover:-skew-x-6" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.45rem] font-extrabold uppercase italic tracking-tight">
            {siteConfig.name.split(" ")[0]}
          </span>
          <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-muted">
            {siteConfig.name.split(" ").slice(1).join(" ") || "Racing"}
          </span>
        </span>
      )}
    </Link>
  );
}
