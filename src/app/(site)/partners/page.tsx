import type { Metadata } from "next";
import { getPartnersByTier, TIER_ORDER } from "@/features/partners/queries";
import { PageHero } from "@/components/shared/page-hero";
import { PartnerLogo } from "@/components/shared/partner-logo";
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
      <div className="container-x space-y-16 pb-16">
        {TIER_ORDER.map((tier) => {
          const list = grouped[tier];
          if (!list.length) return null;
          const big = tier === "title" || tier === "principal";
          return (
            <Reveal key={tier}>
              <p className="eyebrow mb-6 text-accent">{label[tier]}{list.length > 1 ? "s" : ""}</p>
              <div className={big ? "grid gap-5 md:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
                {list.map((p) => (
                  <div key={p.id} className="card flex flex-col gap-4 p-6">
                    <PartnerLogo partner={p} size={big ? "lg" : "md"} />
                    {p.description && <p className="text-sm text-muted">{p.description}</p>}
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noopener noreferrer sponsored" className="mt-auto text-xs font-semibold uppercase tracking-[0.16em] text-accent-2 hover:underline">Visit website ↗</a>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          );
        })}
        <Reveal className="card px-6 py-10 text-center sm:px-10">
          <p className="eyebrow mb-3 text-accent-2">Partner with us</p>
          <h2 className="display text-4xl">Put your brand on the grid</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Our partnerships team builds bespoke programmes across hospitality, content, technology and B2B activation.</p>
          <a href="mailto:partnerships@example.com" className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#ff1a45]">Get in touch</a>
        </Reveal>
      </div>
    </>
  );
}
