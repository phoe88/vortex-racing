import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/shared/social-icons";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-line bg-navy/40">
      <div className="racing-stripe h-1.5 w-full opacity-80" aria-hidden />
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <div className="mt-6 flex items-center gap-2">
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
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-ice/80 transition hover:border-accent hover:text-white"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(siteConfig.footerNav).map(([group, links]) => (
          <div key={group}>
            <p className="eyebrow mb-4">{group}</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ice/80 transition hover:text-accent-2">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow mb-4">Paddock Pass</p>
          <p className="mb-4 text-sm text-muted">Race previews, team news and behind-the-garage access, straight to your inbox.</p>
          <NewsletterForm compact source="footer" />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <CopyrightLine />
          <div className="flex gap-5">
            <Link href="/admin" className="hover:text-ice">Team login</Link>
            <a href="#top" className="hover:text-ice">Back to top ↑</a>
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
