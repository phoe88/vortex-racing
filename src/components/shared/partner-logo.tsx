import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types";

/** Renders a partner logo, or a typographic wordmark when no logo is set. */
export function PartnerLogo({ partner, className, size = "md" }: { partner: Partner; className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-14" : size === "sm" ? "h-7" : "h-10";
  const inner = partner.logo_url ? (
    <Image src={partner.logo_url} alt={partner.name} width={200} height={64} className={cn("w-auto object-contain", h)} />
  ) : (
    <span
      className={cn(
        "font-display font-extrabold uppercase italic tracking-tight text-ice/80",
        size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl",
      )}
    >
      {partner.name}
    </span>
  );
  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer sponsored" className={cn("inline-flex items-center opacity-80 transition hover:opacity-100", className)} aria-label={partner.name}>
        {inner}
      </a>
    );
  }
  return <span className={cn("inline-flex items-center opacity-80", className)}>{inner}</span>;
}

export function PartnerMarquee({ partners }: { partners: Partner[] }) {
  const items = [...partners, ...partners];
  return (
    <div className="relative overflow-hidden border-y border-line py-6" aria-label="Team partners">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-16 px-8 hover:[animation-play-state:paused]">
        {items.map((p, i) => (
          <PartnerLogo key={`${p.id}-${i}`} partner={p} size="sm" />
        ))}
      </div>
    </div>
  );
}
