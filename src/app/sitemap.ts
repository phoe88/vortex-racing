import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { getArticles } from "@/features/news/queries";
import { getDrivers } from "@/features/drivers/queries";
import { getRaces } from "@/features/races/queries";
import { getCars } from "@/features/cars/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [articles, drivers, races, cars] = await Promise.all([
    getArticles({ limit: 500 }),
    getDrivers(),
    getRaces(),
    getCars(),
  ]);

  const statics: MetadataRoute.Sitemap = ["", "/news", "/team", "/races", "/cars", "/standings", "/partners", "/newsletter"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: p === "" || p === "/news" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  return [
    ...statics,
    ...articles.map((a) => ({ url: `${base}/news/${a.slug}`, lastModified: a.updated_at, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...drivers.map((d) => ({ url: `${base}/team/${d.slug}`, lastModified: d.updated_at, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...races.map((r) => ({ url: `${base}/races/${r.slug}`, lastModified: r.updated_at, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...cars.map((c) => ({ url: `${base}/cars/${c.slug}`, lastModified: c.updated_at, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
