import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/config/site";

/** Site links and the copyright line. */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t sm:mt-32">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr]">
        {Object.entries(siteConfig.footerNav).map(([group, links]) => (
          <ul key={group} aria-label={group} className="space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link font-medium">{l.label}</Link>
              </li>
            ))}
            {group === "Team" && (
              <li><Link href="/admin" className="link font-medium">Team login</Link></li>
            )}
          </ul>
        ))}
        <div className="text-subtle sm:col-span-2 lg:col-span-1 lg:text-right">
          <CopyrightLine />
          <p className="type-body-small mt-3 lg:ml-auto lg:max-w-xs">{siteConfig.description}</p>
        </div>
      </div>
    </footer>
  );
}

/** Cached so the current year doesn't block prerendering; refreshes daily. */
async function CopyrightLine() {
  "use cache";
  cacheLife("days");
  return <p>© {new Date().getFullYear()} {siteConfig.name}</p>;
}
