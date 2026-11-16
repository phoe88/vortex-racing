import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InstagramIcon } from "@/components/shared/social-icons";
import { getDriverBySlug, getDriverSlugs } from "@/features/drivers/queries";
import { getDriverStandings } from "@/features/standings/queries";
import { getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { flagEmoji, formatDate, formatPoints, ordinal } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const ROLE_LABEL = { race: "Race driver", reserve: "Reserve driver", academy: "Academy driver" } as const;

export async function generateStaticParams() {
  return (await getDriverSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/team/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = await getDriverBySlug(slug);
  if (!d) return { title: "Driver not found" };
  const name = `${d.first_name} ${d.last_name}`;
  return {
    title: `${name} #${d.number ?? ""}`.trim(),
    description: d.tagline || `${name}, ${ROLE_LABEL[d.role]} for ${siteConfig.name}.`,
    alternates: { canonical: `/team/${d.slug}` },
    openGraph: { type: "profile", title: name, description: d.tagline },
  };
}

export default async function DriverPage({ params }: PageProps<"/team/[slug]">) {
  const { slug } = await params;
  const driver = await getDriverBySlug(slug);
  if (!driver) notFound();
  const [standings, stories] = await Promise.all([
    getDriverStandings(),
    getArticles({ tag: `${driver.first_name} ${driver.last_name}`, limit: 3 }),
  ]);
  const standing = standings.find((s) => s.driver_id === driver.id) ?? null;
  const name = `${driver.first_name} ${driver.last_name}`;

  const stats: [string, string | number][] = [
    ["Grands Prix", driver.career_starts],
    ["Wins", driver.career_wins],
    ["Podiums", driver.career_podiums],
    ["Poles", driver.career_poles],
    ["Career points", formatPoints(driver.career_points)],
    ["Championships", driver.championships],
  ];

  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden pt-32 sm:pt-40">
        {driver.hero_image_url && (
          <Image src={driver.hero_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[70%_center] opacity-60" />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-transparent to-transparent" />
        <div className="container-x">
          <Link href="/team" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ice"><ArrowLeft className="size-4" /> Team</Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <Reveal>
              {driver.number != null && (
                <p className="display text-[7rem] leading-[0.8] text-accent sm:text-[10rem] lg:text-[13rem]">{driver.number}</p>
              )}
              <h1 className="display mt-2 text-5xl sm:text-6xl lg:text-7xl">
                <span className="block font-medium text-ice/80">{driver.first_name}</span>
                {driver.last_name}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ice/85">
                <span>{flagEmoji(driver.country_code)} {driver.nationality}</span>
                <span className="h-4 w-px bg-white/20" />
                <span>{ROLE_LABEL[driver.role]}</span>
                {standing && (<><span className="h-4 w-px bg-white/20" /><span className="font-semibold text-accent-2">{ordinal(standing.position)} in the championship · {formatPoints(standing.points)} pts</span></>)}
              </div>
              {driver.tagline && <p className="mt-6 max-w-lg font-display text-2xl font-medium uppercase italic text-ice/90">“{driver.tagline}”</p>}
              <div className="mt-6 flex gap-2">
                {driver.instagram_url && <a href={driver.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 hover:border-accent"><InstagramIcon className="size-4" /></a>}
                {driver.x_url && <a href={driver.x_url} target="_blank" rel="noopener noreferrer" aria-label="X" className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 font-display text-sm font-bold hover:border-accent">X</a>}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="rounded-2xl bg-ice p-6 text-night shadow-card sm:p-8">
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-night/60">Career stats</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
                {stats.map(([k, v]) => (
                  <div key={k} className="border-t border-night/10 pt-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-night/60">{k}</dt>
                    <dd className="font-display text-3xl font-extrabold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 grid grid-cols-2 gap-x-6 border-t border-night/10 pt-4 text-xs text-night/70">
                {driver.date_of_birth && <p><span className="font-semibold text-night">Born</span><br />{formatDate(driver.date_of_birth)}</p>}
                {driver.place_of_birth && <p><span className="font-semibold text-night">From</span><br />{driver.place_of_birth}</p>}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-20 lg:grid-cols-[1fr_20rem]">
        <div>
          <p className="eyebrow mb-4 text-accent">Biography</p>
          <div className="prose-racing">
            {driver.bio.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        {driver.image_url && (
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image src={driver.image_url} alt={name} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover object-top" />
          </div>
        )}
      </section>

      {stories.length > 0 && (
        <section className="container-x pb-8">
          <SectionHeading eyebrow="In the news" title={`${driver.first_name}'s latest`} href="/news" />
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </>
  );
}
