import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/social-icons";
import { buttonClass } from "@/components/ui/button";

const footerLink = "text-sm text-subtle hover:text-default hover:underline";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-surface-sunken">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-subtle">{siteConfig.description}</p>
          <div className="mt-4 flex items-center gap-1">
            {[
              { href: siteConfig.social.x, label: "X", Icon: XIcon },
              { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={buttonClass({ appearance: "subtle", iconOnly: true })}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(siteConfig.footerNav).map(([group, links]) => (
          <div key={group}>
            <p className="type-heading-xxsmall mb-3 text-subtlest">{group}</p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={footerLink}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="type-heading-xxsmall mb-3 text-subtlest">Paddock Pass</p>
          <p className="mb-3 text-sm text-subtle">Race previews, team news and behind-the-garage access, straight to your inbox.</p>
          <NewsletterForm compact source="footer" />
        </div>
      </div>
      <div className="border-t">
        <div className="container-x type-body-small flex flex-col gap-2 py-4 text-subtlest sm:flex-row sm:items-center sm:justify-between">
          <CopyrightLine />
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-default hover:underline">Team login</Link>
            <a href="#top" className="hover:text-default hover:underline">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Cached so the current year doesn't block prerendering; refreshes daily. */
async function CopyrightLine() {
  "use cache";
  cacheLife("days");
  return <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>;
}
