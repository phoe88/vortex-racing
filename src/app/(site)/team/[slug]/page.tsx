import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { InstagramIcon, XIcon } from "@/components/shared/social-icons";
import { getDriverBySlug, getDriverSlugs } from "@/features/drivers/queries";
import { getDriverStandings } from "@/features/standings/queries";
import { getArticles } from "@/features/news/queries";
import { getCurrentCar } from "@/features/cars/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { CarShowcase } from "@/components/shared/car-showcase";
import { DRIVER_ROLE } from "@/components/shared/driver-card";
import { buttonClass } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
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
  const [standings, stories, car] = await Promise.all([
    getDriverStandings(),
    getArticles({ tag: `${driver.first_name} ${driver.last_name}`, limit: 8 }),
    driver.role === "race" ? getCurrentCar() : Promise.resolve(null),
  ]);
  const standing = standings.find((s) => s.driver_id === driver.id) ?? null;

  const details: [string, React.ReactNode][] = [
    ["Date of birth", driver.date_of_birth ? formatDate(driver.date_of_birth) : null],
    ["Place of birth", driver.place_of_birth],
    ["Nationality", <><span aria-hidden>{flagEmoji(driver.country_code)}</span> {driver.nationality}</>],
    ["Role", DRIVER_ROLE[driver.role].label],
    ["Race number", driver.number != null ? `#${driver.number}` : null],
    ["Championship", standing ? `${ordinal(standing.position)} · ${formatPoints(standing.points)} pts` : null],
  ];
  const stats: [string, string | number][] = [
    ["Grands Prix", driver.career_starts],
    ["Wins", driver.career_wins],
    ["Podiums", driver.career_podiums],
    ["Poles", driver.career_poles],
    ["Points", formatPoints(driver.career_points)],
    ["Titles", driver.championships],
  ];

  return (
    <>
      {/* Full-bleed portrait with the name at the bottom */}
      <section className="relative isolate flex min-h-[92vh] flex-col justify-end overflow-hidden pb-12 pt-40">
        {(driver.hero_image_url ?? driver.image_url) && (
          <Image src={(driver.hero_image_url ?? driver.image_url)!} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
        )}
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x grid items-end gap-6 lg:grid-cols-[12rem_1fr]">
          <div className="relative size-24 overflow-hidden rounded-full border-4 border-white/20 bg-navy-raised sm:size-36">
            {driver.image_url && <Image src={driver.image_url} alt="" fill sizes="144px" className="object-cover object-top" />}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="type-display">
                <span className="block">{driver.first_name}</span>
                {driver.last_name}
              </h1>
              <p className="mt-4 text-sm"><span aria-hidden>{flagEmoji(driver.country_code)}</span> {driver.nationality} · {DRIVER_ROLE[driver.role].label}</p>
            </div>
            {(driver.instagram_url || driver.x_url) && (
              <div className="flex gap-2">
                {driver.instagram_url && <a href={driver.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={buttonClass({ iconOnly: true })}><InstagramIcon className="size-4" /></a>}
                {driver.x_url && <a href={driver.x_url} target="_blank" rel="noopener noreferrer" aria-label="X" className={buttonClass({ iconOnly: true })}><XIcon className="size-4" /></a>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-x mt-12 grid gap-6 border-t pt-12 lg:grid-cols-[12rem_minmax(0,46rem)]">
        <div className="hidden lg:block" />
        <div>
          {driver.tagline && <p className="type-heading-large">{driver.tagline}</p>}
          <dl className="card mt-10 grid grid-cols-2 gap-x-6 gap-y-6 p-6 sm:grid-cols-3 sm:p-8">
            {details.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}>
                <dt className="type-body-small text-subtle">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <Reveal>
            <h2 className="type-heading-medium mt-16">Career in numbers</h2>
            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.map(([k, v]) => (
                <div key={k} className="card p-5">
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-subtle">{k}</dt>
                  <dd className="type-metric-large mt-2 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="prose-site mt-16">
            {driver.bio.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {car && (
        <section className="container-x mt-24 sm:mt-32">
          <h2 className="type-heading-xlarge mb-6">Driven Cars</h2>
          <CarShowcase car={car} />
        </section>
      )}

      {stories.length > 0 && (
        <Carousel title={`${driver.first_name} in the News`} className="mt-24 sm:mt-32">
          {stories.map((a, i) => <ArticleCard key={a.id} article={a} number={i + 1} />)}
        </Carousel>
      )}
    </>
  );
}
