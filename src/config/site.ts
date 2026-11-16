/**
 * Central website configuration. Everything brand-related lives here so the
 * team identity can be changed in one place.
 */
export const siteConfig = {
  name: "Vortex Racing",
  shortName: "VRT",
  tagline: "Built for the edge of grip.",
  description:
    "Official home of Vortex Racing: breaking news, race weekends, driver profiles, car technology, championship standings and partners.",
  season: 2026,
  foundedYear: 2011,
  base: "Silverstone, United Kingdom",
  teamPrincipal: "Mara Lindqvist",
  championshipName: "World Championship",
  social: {
    x: "https://x.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    tiktok: "https://tiktok.com",
  },
  nav: [
    { label: "Races", href: "/races" },
    { label: "News", href: "/news" },
    { label: "Team", href: "/team" },
    { label: "Cars", href: "/cars" },
    { label: "Standings", href: "/standings" },
    { label: "Partners", href: "/partners" },
  ],
  footerNav: {
    Team: [
      { label: "Drivers", href: "/team" },
      { label: "Cars", href: "/cars" },
      { label: "Partners", href: "/partners" },
      { label: "Newsletter", href: "/newsletter" },
    ],
    Racing: [
      { label: "Calendar", href: "/races" },
      { label: "Standings", href: "/standings" },
      { label: "News", href: "/news" },
      { label: "Race reports", href: "/news?category=race-report" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute site URL, resolved from env or the Vercel deployment. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
