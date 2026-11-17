import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { darkSubtree } from "@/lib/theme";
import { unsplash, IMG } from "@/lib/seed/images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description: `Join the ${siteConfig.name} Paddock Pass newsletter for race previews, debriefs and exclusive access.`,
  alternates: { canonical: "/newsletter" },
};

const perks = [
  "Race weekend previews and post-race debriefs",
  "Technical explainers from the engineering team",
  "Ticket and merchandise pre-sales",
  "Behind-the-scenes photo and video drops",
];

export default function NewsletterPage() {
  return (
    <section className="container-x grid gap-4 pt-4 sm:pt-6 lg:grid-cols-[1.3fr_1fr]">
      {/* Always dark so the text stays legible over the photograph. */}
      <div
        {...darkSubtree}
        className="relative isolate flex min-h-96 flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:p-8"
      >
        <Image src={unsplash(IMG.garageHelmets, 2000)} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="-z-20 object-cover" />
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <p className="type-heading-xxsmall mb-1 text-subtlest">Paddock Pass</p>
        <h1 className="type-heading-xlarge sm:type-heading-xxlarge max-w-xl text-balance">Closer to the team than the grandstand</h1>
        <p className="type-body-large mt-2 max-w-lg text-subtle">One email a week during the season, the occasional one in winter. Written by the people in the garage, not a marketing bot.</p>
      </div>
      <div className="card self-start p-4 sm:p-6">
        <h2 className="type-heading-medium">Sign up</h2>
        <p className="mb-4 mt-1 text-sm text-subtle">Free. Unsubscribe with one click.</p>
        <NewsletterForm source="newsletter-page" />
        <ul className="mt-6 space-y-2 border-t pt-4">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-icon-success" aria-hidden /> {p}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
