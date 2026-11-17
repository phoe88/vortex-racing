import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types";

/** Renders a partner logo, or a typographic wordmark when no logo is set. */
export function PartnerLogo({ partner, className, size = "md" }: { partner: Partner; className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-12" : size === "sm" ? "h-5" : "h-8";
  const inner = partner.logo_url ? (
    <Image src={partner.logo_url} alt={partner.name} width={240} height={64} className={cn("w-auto object-contain", h)} />
  ) : (
    <span
      className={cn(
        "font-extrabold uppercase",
        size === "lg"
          ? "text-2xl tracking-[0.12em] sm:whitespace-nowrap sm:text-4xl sm:tracking-[0.18em] lg:text-5xl"
          : size === "sm" ? "whitespace-nowrap text-sm tracking-[0.12em]" : "whitespace-nowrap text-xl tracking-[0.1em]",
      )}
    >
      {partner.name}
    </span>
  );
  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noopener noreferrer sponsored" className={cn("inline-flex items-center rounded-sm text-default transition-opacity hover:opacity-70", className)} aria-label={partner.name}>
        {inner}
      </a>
    );
  }
  return <span className={cn("inline-flex items-center text-default", className)}>{inner}</span>;
}
