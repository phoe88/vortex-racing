import Link from "next/link";
import { cacheLife } from "next/cache";
import { siteConfig } from "@/config/site";
import { getPartnersByTier } from "@/features/partners/queries";
import { PartnerLogo } from "@/components/shared/partner-logo";

/** Partner wall followed by site links and the copyright line. */
export async function SiteFooter() {
  const partners = await getPartnersByTier();
  const rows = [
    { list: partners.principal, size: "md" as const, gap: "gap-x-12" },
    { list: partners.official, size: "sm" as const, gap: "gap-x-10" },
    { list: partners.supplier, size: "sm" as const, gap: "gap-x-10" },
  ].filter((r) => r.list.length > 0);
  const hasPartners = partners.title.length > 0 || rows.length > 0;

  return (
    <footer className="mt-24 sm:mt-32">
      {hasPartners && (
        <section aria-label="Team partners" className="container-x">
          {partners.title.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 pb-8">
              {partners.title.map((p) => <PartnerLogo key={p.id} partner={p} size="lg" />)}
            </div>
          )}
          {rows.map((row, i) => (
            <ul key={i} className={`flex flex-wrap items-center justify-center gap-y-4 border-t py-6 ${row.gap}`}>
              {row.list.map((p) => (
                <li key={p.id}><PartnerLogo partner={p} size={row.size} /></li>
              ))}
            </ul>
          ))}
          <div className="border-t" />
        </section>
      )}

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
