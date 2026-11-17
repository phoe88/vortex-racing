import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Team mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-8", className)}>
      <path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill="var(--red)" />
      <path d="M18 8h12l-6 13-6-13Z" fill="var(--warning)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [first, ...rest] = siteConfig.name.split(" ");
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 rounded-sm text-default", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-extrabold uppercase tracking-wide">{first}</span>
          {rest.length > 0 && <span className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-[0.42em] text-subtle">{rest.join(" ")}</span>}
        </span>
      )}
    </Link>
  );
}
