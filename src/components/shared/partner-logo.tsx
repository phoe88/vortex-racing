import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types";

/** Renders a partner logo, or a typographic wordmark when no logo is set. */
export function PartnerLogo({ partner, className, size = "md" }: { partner: Partner; className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-12" : size === "sm" ? "h-6" : "h-8";
  const inner = partner.logo_url ? (
    <Image src={partner.logo_url} alt={partner.name} width={200} height={64} className={cn("w-auto object-contain", h)} />
  ) : (
    <span className={cn("whitespace-nowrap", size === "lg" ? "type-heading-large" : size === "sm" ? "type-heading-xsmall" : "type-heading-medium")}>
      {partner.name}
    </span>
  );
  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer sponsored" className={cn("inline-flex items-center rounded-sm text-subtle transition-colors hover:text-default", className)} aria-label={partner.name}>
        {inner}
      </a>
    );
  }
  return <span className={cn("inline-flex items-center text-subtle", className)}>{inner}</span>;
}

/** A quiet row of partner names shown under the home page hero. */
export function PartnerStrip({ partners }: { partners: Partner[] }) {
  return (
    <div className="border-y bg-surface-sunken" aria-label="Team partners">
      <ul className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
        {partners.map((p) => (
          <li key={p.id}><PartnerLogo partner={p} size="sm" /></li>
        ))}
      </ul>
    </div>
  );
}
