import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InstagramIcon, XIcon } from "@/components/shared/social-icons";
import { getDriverBySlug, getDriverSlugs } from "@/features/drivers/queries";
import { getDriverStandings } from "@/features/standings/queries";
import { getArticles } from "@/features/news/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { DRIVER_ROLE } from "@/components/shared/driver-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonClass } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { darkSubtree } from "@/lib/theme";
import { flagEmoji, formatDate, formatPoints, ordinal } from "@/lib/utils";
import { siteConfig } from "@/config/site";

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
    description: d.tagline || `${name}, ${DRIVER_ROLE[d.role].label.toLowerCase()} for ${siteConfig.name}.`,
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
  const role = DRIVER_ROLE[driver.role];

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
      <section className="container-x pt-4 sm:pt-6">
        <Breadcrumbs items={[{ label: "Team", href: "/team" }, { label: name }]} />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Profile banner: always dark so the text stays legible over the photograph. */}
          <div
            {...darkSubtree}
            className="relative isolate flex min-h-96 flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:p-8"
          >
            {driver.hero_image_url && (
              <Image src={driver.hero_image_url} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="-z-20 object-cover object-[70%_center]" />
            )}
            <div className="media-scrim-soft absolute inset-0 -z-10" />
            <div className="flex flex-wrap items-center gap-2">
              <Lozenge appearance={role.appearance}>{role.label}</Lozenge>
              {driver.number != null && <Lozenge>#{driver.number}</Lozenge>}
              <span className="text-sm text-subtle">{flagEmoji(driver.country_code)} {driver.nationality}</span>
            </div>
            <h1 className="type-heading-xlarge sm:type-heading-xxlarge mt-2">{name}</h1>
            {standing && (
              <p className="mt-1 text-sm font-medium">{ordinal(standing.position)} in the championship · {formatPoints(standing.points)} pts</p>
            )}
            {driver.tagline && <p className="type-body-large mt-2 max-w-lg text-subtle">“{driver.tagline}”</p>}
            {(driver.instagram_url || driver.x_url) && (
              <div className="mt-4 flex gap-1">
                {driver.instagram_url && (
                  <a href={driver.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={buttonClass({ iconOnly: true })}>
                    <InstagramIcon className="size-4" />
                  </a>
                )}
                {driver.x_url && (
                  <a href={driver.x_url} target="_blank" rel="noopener noreferrer" aria-label="X" className={buttonClass({ iconOnly: true })}>
                    <XIcon className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <Reveal className="card p-4 sm:p-6">
            <h2 className="type-heading-small">Career stats</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              {stats.map(([k, v]) => (
                <div key={k} className="border-t pt-2">
                  <dt className="type-body-small text-subtle">{k}</dt>
                  <dd className="type-metric-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            {(driver.date_of_birth || driver.place_of_birth) && (
              <dl className="mt-4 grid grid-cols-2 gap-x-4 border-t pt-3 text-sm">
                {driver.date_of_birth && <div><dt className="type-body-small text-subtle">Born</dt><dd>{formatDate(driver.date_of_birth)}</dd></div>}
                {driver.place_of_birth && <div><dt className="type-body-small text-subtle">From</dt><dd>{driver.place_of_birth}</dd></div>}
              </dl>
            )}
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <h2 className="type-heading-large mb-3">Biography</h2>
          <div className="prose-ads max-w-3xl">
            {driver.bio.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        {driver.image_url && (
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral">
            <Image src={driver.image_url} alt={name} fill sizes="(min-width: 1024px) 20rem, 100vw" className="object-cover object-top" />
          </div>
        )}
      </section>

      {stories.length > 0 && (
        <section className="container-x pt-4">
          <SectionHeading eyebrow="In the news" title={`${driver.first_name}'s latest`} href="/news" />
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        </section>
      )}
    </>
  );
}
