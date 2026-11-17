import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getArticles, getFeaturedArticle } from "@/features/news/queries";
import { getDrivers } from "@/features/drivers/queries";
import { getNextRace, getRaces } from "@/features/races/queries";
import { getChampionshipSnapshot } from "@/features/standings/queries";
import { getCurrentCar } from "@/features/cars/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { CarShowcase } from "@/components/shared/car-showcase";
import { DriverCard } from "@/components/shared/driver-card";
import { NextSessionCountdown } from "@/components/shared/countdown";
import { NewsletterBlock } from "@/components/shared/newsletter-block";
import { RaceCard, raceWeekendRange } from "@/components/shared/race-card";
import { ButtonLink } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { CATEGORY_META } from "@/features/news/categories";
import { flagEmoji, formatPoints } from "@/lib/utils";
import type { ArticleCategory } from "@/types";

const PILL_CATEGORIES: ArticleCategory[] = ["race-report", "feature", "video", "team"];

export default async function HomePage() {
  const [featured, nextRace, races, snapshot, drivers, car] = await Promise.all([
    getFeaturedArticle(),
    getNextRace(),
    getRaces(),
    getChampionshipSnapshot(),
    getDrivers(),
    getCurrentCar(),
  ]);
  const latest = await getArticles({ limit: 12, excludeId: featured?.id ?? null });
  const [wide, ...rest] = latest;
  const pair = rest.slice(0, 2);
  const railStories = rest.slice(2, 10);
  const raceDrivers = drivers.filter((d) => d.role === "race");
  const upcoming = races.filter((r) => r.status !== "completed");
  const pool = [featured, ...latest].filter(Boolean);
  const pills = PILL_CATEGORIES.map((c) => ({ category: c, image: pool.find((a) => a?.category === c)?.cover_image_url ?? null }));

  return (
    <>
      {/* ─── Hero mosaic ──────────────────────────────────────────────── */}
      <section className="px-2 pt-[5.5rem] sm:px-8 lg:pt-[7.5rem]">
        <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-[minmax(20rem,1fr)_minmax(20rem,1fr)]">
          {featured && <ArticleCard article={featured} variant="hero" priority className="lg:row-span-2" />}
          {wide && <ArticleCard article={wide} variant="overlay" priority />}
          {pair.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {pair.map((a) => <ArticleCard key={a.id} article={a} variant="overlay" />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── Category pills ───────────────────────────────────────────── */}
      <nav aria-label="Story categories" className="scrollbar-none mt-10 flex justify-start gap-3 overflow-x-auto px-4 sm:justify-center">
        {pills.map(({ category, image }) => (
          <Link
            key={category}
            href={`/news?category=${category}`}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-neutral py-2 pl-2 pr-4 text-sm transition-colors hover:bg-neutral-hovered"
          >
            <span className="relative size-8 overflow-hidden rounded-full bg-navy-raised">
              {image && <Image src={image} alt="" fill sizes="32px" className="object-cover" />}
            </span>
            {CATEGORY_META[category].label}
          </Link>
        ))}
      </nav>

      {/* ─── Standings, next race and countdown ───────────────────────── */}
      <section className="container-x mt-20 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <Link href="/standings" className="card group block px-8 py-10 sm:px-12">
          <h2 className="type-heading-large">{siteConfig.season} Driver Standings</h2>
          <ul className="mt-5">
            {snapshot.teamDrivers.map((d) => (
              <li key={d.id} className="flex items-center gap-4 border-t py-2.5">
                <span className="type-metric-small w-12 tabular-nums">{String(d.position).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{d.driver_name}</span>
                  <span className="type-body-small block text-subtle">{d.team_name}</span>
                </span>
                <span className="type-metric-small tabular-nums">{formatPoints(d.points)}</span>
              </li>
            ))}
          </ul>
        </Link>
        {nextRace && (
          <div className="card grid overflow-hidden sm:grid-cols-2">
            <Link href={`/races/${nextRace.slug}`} className="group relative isolate flex min-h-64 flex-col justify-start p-8 sm:p-10">
              {nextRace.hero_image_url && <Image src={nextRace.hero_image_url} alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.04]" />}
              <div className="absolute inset-0 -z-10 bg-navy/55" />
              <h2 className="type-heading-large">{nextRace.name}</h2>
              <p className="mt-3 flex items-center gap-2"><CalendarDays className="size-4" aria-hidden /> {raceWeekendRange(nextRace)}</p>
              <p className="mt-2 text-subtle"><span aria-hidden>{flagEmoji(nextRace.country_code)}</span> {nextRace.circuit_name}</p>
            </Link>
            <NextSessionCountdown sessions={nextRace.sessions} className="flex flex-col p-8 sm:p-10" />
          </div>
        )}
      </section>

      {/* ─── Latest news rail ─────────────────────────────────────────── */}
      {railStories.length > 0 && (
        <Carousel title="Latest News" className="mt-24 sm:mt-32">
          {railStories.map((a, i) => <ArticleCard key={a.id} article={a} number={i + 1} />)}
        </Carousel>
      )}

      {/* ─── Drivers ──────────────────────────────────────────────────── */}
      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">Our Drivers</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-10">
          {raceDrivers.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.1}>
              <DriverCard driver={d} tilt={i % 2 === 0 ? "left" : "right"} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <ButtonLink href="/team" appearance="primary" spacing="large">Meet the Team</ButtonLink>
        </div>
      </section>

      {/* ─── Car ──────────────────────────────────────────────────────── */}
      {car && (
        <section className="container-x mt-24 sm:mt-32">
          <h2 className="type-heading-xlarge mb-6">Our Cars</h2>
          <Reveal><CarShowcase car={car} drivers={drivers} /></Reveal>
        </section>
      )}

      {/* ─── Newsletter ───────────────────────────────────────────────── */}
      <NewsletterBlock source="home" className="mt-24 sm:mt-32" />

      {/* ─── Calendar rail ────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <Carousel title={`${siteConfig.season} Calendar`} className="mt-24 sm:mt-32" itemClassName="w-[78vw] sm:w-[20rem]">
          {upcoming.map((r) => <RaceCard key={r.id} race={r} highlight={r.id === nextRace?.id} />)}
        </Carousel>
      )}
    </>
  );
}
