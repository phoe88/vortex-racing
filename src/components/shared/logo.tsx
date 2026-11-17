import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Team mark. Drawn with design-system accent tokens so it adapts to the colour mode. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={cn("size-6", className)}>
      <path d="M4 8h12l8 18 8-18h12L28 42h-8L4 8Z" fill="var(--ds-icon-accent-red)" />
      <path d="M18 8h12l-6 13-6-13Z" fill="var(--ds-icon-accent-yellow)" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 rounded-sm text-default", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark />
      {!compact && <span className="type-heading-small whitespace-nowrap">{siteConfig.name}</span>}
    </Link>
  );
}
