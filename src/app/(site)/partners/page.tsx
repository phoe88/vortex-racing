import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { getPartnersByTier, TIER_ORDER } from "@/features/partners/queries";
import { PageHero } from "@/components/shared/page-hero";
import { PartnerLogo } from "@/components/shared/partner-logo";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { PARTNER_TIERS } from "@/types";
import { unsplash, IMG } from "@/lib/seed/images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Partners",
  description: `The partners and technical suppliers behind ${siteConfig.name}.`,
  alternates: { canonical: "/partners" },
};

export default async function PartnersPage() {
  const grouped = await getPartnersByTier();
  const label = Object.fromEntries(PARTNER_TIERS.map((t) => [t.value, t.label]));
  return (
    <>
      <PageHero eyebrow="Partnerships" title="Stronger together" description="Racing is a team sport that extends far beyond the garage. These are the brands that make every lap possible." image={unsplash(IMG.pitLaneCrowd, 2000)} />
      <div className="container-x space-y-8 pt-2">
        {TIER_ORDER.map((tier) => {
          const list = grouped[tier];
          if (!list.length) return null;
          const big = tier === "title" || tier === "principal";
          return (
            <Reveal key={tier}>
              <h2 className="type-heading-medium mb-3">{label[tier]}{list.length > 1 ? "s" : ""}</h2>
              <div className={big ? "grid gap-4 md:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {list.map((p) => (
                  <div key={p.id} className="card flex flex-col gap-3 p-4 sm:p-6">
                    <PartnerLogo partner={p} size={big ? "lg" : "md"} className="text-default!" />
                    {p.description && <p className="text-sm text-subtle">{p.description}</p>}
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer sponsored" className="link mt-auto inline-flex items-center gap-1 text-sm font-medium">
                        Visit website <ExternalLink className="size-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          );
        })}
        <Reveal className="card p-6 text-center sm:p-8">
          <p className="type-heading-xxsmall mb-1 text-subtlest">Partner with us</p>
          <h2 className="type-heading-large">Put your brand on the grid</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-subtle">Our partnerships team builds bespoke programmes across hospitality, content, technology and B2B activation.</p>
          <a href="mailto:partnerships@example.com" className={buttonClass({ appearance: "primary", className: "mt-4" })}>Get in touch</a>
        </Reveal>
      </div>
    </>
  );
}
