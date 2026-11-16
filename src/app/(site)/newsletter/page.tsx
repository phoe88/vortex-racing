import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { NewsletterForm } from "@/components/shared/newsletter-form";
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
    <section className="relative isolate min-h-screen overflow-hidden pt-32 pb-20 sm:pt-44">
      <Image src={unsplash(IMG.garageHelmets, 2000)} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/40" />
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-4 text-accent">Paddock Pass</p>
          <h1 className="display text-5xl sm:text-6xl lg:text-7xl">Closer to the team than the grandstand</h1>
          <p className="mt-6 max-w-lg text-lg text-ice/80">One email a week during the season, the occasional one in winter. Written by the people in the garage, not a marketing bot.</p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ice/90"><Check className="mt-0.5 size-5 shrink-0 text-accent-2" /> {p}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6 sm:p-10">
          <h2 className="display text-3xl">Sign up</h2>
          <p className="mb-6 mt-2 text-sm text-muted">Free. Unsubscribe with one click.</p>
          <NewsletterForm source="newsletter-page" />
        </div>
      </div>
    </section>
  );
}
