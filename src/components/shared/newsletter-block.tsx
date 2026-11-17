import { siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { Reveal } from "@/components/ui/reveal";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PERKS = ["Race previews", "Team debriefs", "Exclusive content", "Behind the scenes"];

/** Full-width sign-up section on a red glow: big headline, email field, socials and the perks of joining. */
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
          <ul className="space-y-1">
            {PERKS.map((p) => (
              <li key={p} className="type-heading-xxlarge">{p}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
