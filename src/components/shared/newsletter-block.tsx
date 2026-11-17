import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PERKS } from "@/features/paddock/content";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Full-width sign-up section on a red glow: big headline, email field, socials
 * and the benefits of joining, each linking to its own page.
 */
export function NewsletterBlock({ source, as: Heading = "h2", className }: { source: string; as?: "h1" | "h2"; className?: string }) {
  return (
    <section className={cn("red-glow relative overflow-hidden py-24 sm:py-32 lg:py-40", className)}>
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <Heading className="type-display max-w-xl">Get Closer to the Team</Heading>
          <div className="mt-8"><NewsletterForm source={source} compact /></div>
          <p className="mt-8 font-bold">Connect via</p>
          <div className="mt-3 flex gap-2">
            {[
              { href: siteConfig.social.x, label: "X", Icon: XIcon },
              { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={buttonClass({ iconOnly: true })}>
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="space-y-1" aria-label="Paddock Pass benefits">
            {PERKS.map((p) => (
              <li key={p.slug}>
                <Link href={`/paddock/${p.slug}`} className="type-heading-xxlarge group inline-flex items-center gap-4 transition-colors hover:text-subtle">
                  {p.title}
                  <ArrowRight className="size-8 shrink-0 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:size-10" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
