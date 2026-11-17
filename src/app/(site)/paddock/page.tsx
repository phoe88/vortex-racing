import type { Metadata } from "next";
import Image from "next/image";
import { PERKS } from "@/features/paddock/content";
import { NewsletterBlock } from "@/components/shared/newsletter-block";
import { PerkCard } from "@/components/shared/perk-card";
import { TextBanner } from "@/components/shared/text-banner";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { unsplash, IMG } from "@/lib/seed/images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Paddock Pass",
  description: `Join the free ${siteConfig.name} Paddock Pass for race previews, team debriefs, exclusive content and behind-the-scenes access.`,
  alternates: { canonical: "/paddock" },
};

const FAQS = [
  { q: "What is the Paddock Pass?", a: `The free ${siteConfig.name} newsletter. Members get race previews, team debriefs, exclusive videos and features, and a look behind the scenes.` },
  { q: "How much does it cost?", a: "Nothing. The Paddock Pass is free and you can unsubscribe at any time with one click." },
  { q: "How often will I hear from you?", a: "About one email a week during the season, with a preview before each race and a debrief after it, and less often in the winter break." },
  { q: "What do you do with my email address?", a: "We use it only to send the Paddock Pass. We never sell it or share it with partners." },
];

export default function PaddockPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden pb-14 pt-40">
        <Image src={unsplash(IMG.fansGrandstand, 2400)} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x">
          <h1 className="type-display-xl max-w-5xl">Paddock Pass</h1>
          <p className="type-body-large mt-5 max-w-xl text-subtle">Free membership that brings you closer to the team than the grandstand ever could.</p>
          <ButtonLink href="#signup" appearance="primary" spacing="large" className="mt-8">Sign up free</ButtonLink>
        </div>
      </section>

      <section className="container-x mt-24 sm:mt-32">
        <p className="type-heading-xxlarge max-w-5xl">
          One email a week, written by the people in the garage. <span className="text-subtle">Previews before every race, debriefs after it, and the stories that never make the broadcast.</span>
        </p>
      </section>

      <TextBanner text="Get Closer" className="mt-16 sm:mt-24" />

      <section className="container-x mt-16 sm:mt-24">
        <h2 className="type-heading-xlarge">What&apos;s included</h2>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <StaggerItem key={p.slug}><PerkCard perk={p} number={i + 1} /></StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x mt-24 grid gap-10 sm:mt-32 lg:grid-cols-[22rem_1fr]">
        <h2 className="type-heading-xlarge">Questions</h2>
        <Accordion items={FAQS} />
      </section>

      <div id="signup">
        <NewsletterBlock source="paddock" className="mt-24 sm:mt-32" />
      </div>
    </>
  );
}
