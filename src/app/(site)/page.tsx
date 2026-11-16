import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flag, Gauge, Trophy } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getArticles, getFeaturedArticle } from "@/features/news/queries";
import { getDrivers } from "@/features/drivers/queries";
import { getLastCompletedRace, getNextRace } from "@/features/races/queries";
import { getChampionshipSnapshot } from "@/features/standings/queries";
import { getCurrentCar } from "@/features/cars/queries";
import { getPartners } from "@/features/partners/queries";
import { ArticleCard } from "@/components/shared/article-card";
import { DriverCard } from "@/components/shared/driver-card";
import { Countdown } from "@/components/shared/countdown";
import { raceWeekendRange } from "@/components/shared/race-card";
import { PartnerMarquee } from "@/components/shared/partner-logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { ConstructorStandingsTable, DriverStandingsTable } from "@/components/shared/standings-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { flagEmoji, formatPoints, formatTime, ordinal } from "@/lib/utils";

export default async function HomePage() {
  const [featured, nextRace, lastRace, snapshot, drivers, car, partners] = await Promise.all([
    getFeaturedArticle(),
    getNextRace(),
    getLastCompletedRace(),
    getChampionshipSnapshot(),
    getDrivers(),
    getCurrentCar(),
    getPartners(),
  ]);
  const latest = await getArticles({ limit: 7, excludeId: featured?.id ?? null });
  const sideStories = latest.slice(0, 2);
  const gridStories = latest.slice(2, 8);
  const raceDrivers = drivers.filter((d) => d.role === "race");
  const otherDrivers = drivers.filter((d) => d.role !== "race");
  const teamResults = lastRace?.results.filter((r) => r.team_name === siteConfig.name) ?? [];

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-28">
        <div className="grid-fade absolute inset-x-0 top-0 -z-10 h-[40rem]" aria-hidden />
        <div className="container-x grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:gap-5">
          {featured && <ArticleCard article={featured} variant="hero" priority />}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1.2fr_1fr] lg:gap-5">
            {nextRace && (
              <Link href={`/races/${nextRace.slug}`} className="group relative overflow-hidden rounded-2xl bg-navy-2 sm:col-span-2 lg:col-span-1">
                {nextRace.hero_image_url && (
                  <Image src={nextRace.hero_image_url} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />
                <div className="relative flex h-full min-h-72 flex-col justify-between p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <Badge tone="yellow">{nextRace.status === "live" ? "Live now" : "Next race"}</Badge>
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice/70">Round {nextRace.round}</span>
                  </div>
                  <div>
                    <p className="text-2xl">{flagEmoji(nextRace.country_code)}</p>
                    <h2 className="display mt-1 text-3xl sm:text-4xl">{nextRace.name}</h2>
                    <p className="mt-1 text-sm text-ice/70">{nextRace.circuit_name} · {raceWeekendRange(nextRace)}</p>
                    <Countdown target={nextRace.race_start} className="mt-5" />
                  </div>
                </div>
              </Link>
            )}
            {sideStories.map((a) => (
              <ArticleCard key={a.id} article={a} variant="overlay" className="lg:hidden" />
            ))}
            {sideStories[0] && (
              <div className="hidden grid-cols-2 gap-4 lg:grid lg:gap-5">
                {sideStories.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="overlay" className="aspect-auto" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Partners strip ───────────────────────────────────────────── */}
      <div className="mt-14">{partners.length > 0 && <PartnerMarquee partners={partners} />}</div>

      {/* ─── Latest news ──────────────────────────────────────────────── */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="Paddock feed" title="Latest from the team" href="/news" linkLabel="All news" />
        <Stagger className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {gridStories.map((a) => (
            <StaggerItem key={a.id}><ArticleCard article={a} /></StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ─── Race centre ──────────────────────────────────────────────── */}
      {(nextRace || lastRace) && (
        <section className="relative overflow-hidden bg-navy/50 py-20 sm:py-24">
          <div className="racing-stripe absolute left-0 top-0 h-full w-2 opacity-60" aria-hidden />
          <div className="container-x grid gap-12 lg:grid-cols-2">
            {nextRace && (
              <Reveal>
                <p className="eyebrow mb-3 text-accent">Race weekend</p>
                <h2 className="display text-4xl sm:text-5xl">{nextRace.name}</h2>
                <p className="mt-3 text-muted">{nextRace.city}, {nextRace.country} · {nextRace.circuit_name}</p>
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {nextRace.sessions.map((s) => (
                    <li key={s.name} className="flex items-center justify-between py-3.5 text-sm">
                      <span className={s.name === "Grand Prix" ? "font-semibold text-white" : "text-ice/85"}>{s.name}</span>
                      <span className="tabular-nums text-muted">
                        {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: nextRace.timezone }).format(new Date(s.starts_at))}
                        <span className="ml-3 text-ice">{formatTime(s.starts_at, nextRace.timezone)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={`/races/${nextRace.slug}`} className="mt-8" variant="outline">Circuit guide <ArrowRight className="size-4" /></ButtonLink>
              </Reveal>
            )}
            {lastRace && (
              <Reveal delay={0.1} className="card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-accent-2">Last time out</p>
                  <Badge tone="muted">Round {lastRace.round}</Badge>
                </div>
                <h3 className="display mt-3 text-3xl">{lastRace.name}</h3>
                <ul className="mt-6 space-y-3">
                  {teamResults.map((r) => (
                    <li key={r.id} className="flex items-center gap-4 rounded-xl bg-white/4 px-4 py-3">
                      <span className="font-display text-3xl font-extrabold italic tabular-nums text-accent-2">
                        {r.position ? `P${r.position}` : "DNF"}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold">{r.driver_name}</p>
                        <p className="text-xs text-muted">{r.status === "Finished" ? `Grid ${r.grid} · ${r.time_text}` : r.status}</p>
                      </div>
                      <span className="font-display text-xl font-bold tabular-nums">+{formatPoints(r.points)}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/races/${lastRace.slug}`} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ice/80 hover:text-accent-2">
                  Full classification <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ─── Championship ─────────────────────────────────────────────── */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow={`${siteConfig.season} ${siteConfig.championshipName}`} title="Championship" href="/standings" linkLabel="Full standings" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {snapshot.teamDrivers.map((d) => (
              <div key={d.id} className="card flex items-center gap-5 p-5">
                <span className="display text-6xl text-accent">{ordinal(d.position)}</span>
                <div>
                  <p className="font-display text-xl font-bold uppercase">{d.driver_name}</p>
                  <p className="text-sm text-muted">{formatPoints(d.points)} pts · {d.wins} wins · {d.podiums} podiums</p>
                </div>
              </div>
            ))}
            {snapshot.teamConstructor && (
              <div className="card flex items-center gap-5 bg-accent-soft p-5">
                <Trophy className="size-10 text-accent-2" />
                <div>
                  <p className="eyebrow">Constructors&apos;</p>
                  <p className="font-display text-2xl font-bold uppercase">{ordinal(snapshot.teamConstructor.position)} · {formatPoints(snapshot.teamConstructor.points)} pts</p>
                </div>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.05} className="card p-5 sm:p-6">
            <p className="eyebrow mb-3">Drivers&apos; top 5</p>
            <DriverStandingsTable rows={snapshot.topDrivers} compact />
          </Reveal>
          <Reveal delay={0.1} className="card p-5 sm:p-6">
            <p className="eyebrow mb-3">Constructors&apos; top 5</p>
            <ConstructorStandingsTable rows={snapshot.topConstructors} compact />
          </Reveal>
        </div>
      </section>

      {/* ─── Drivers ──────────────────────────────────────────────────── */}
      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="The line-up" title="Our drivers" href="/team" linkLabel="Meet the team" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {raceDrivers.map((d) => (
            <DriverCard key={d.id} driver={d} className="lg:col-span-1" />
          ))}
          {otherDrivers.slice(0, 2).map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
        </div>
      </section>

      {/* ─── Car ──────────────────────────────────────────────────────── */}
      {car && (
        <section className="relative overflow-hidden py-20 sm:py-28">
          {car.hero_image_url && (
            <Image src={car.hero_image_url} alt="" fill sizes="100vw" className="object-cover opacity-25" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-night via-night/70 to-night" />
          <div className="container-x relative">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_1.3fr]">
              <Reveal>
                <p className="eyebrow mb-3 text-accent">Season {car.season}</p>
                <h2 className="display text-7xl sm:text-8xl lg:text-9xl">{car.name}</h2>
                <p className="mt-4 max-w-md text-lg text-ice/80">{car.tagline}</p>
                <ButtonLink href={`/cars/${car.slug}`} className="mt-8">Explore the car <ArrowRight className="size-4" /></ButtonLink>
              </Reveal>
              <Reveal delay={0.1} className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                {car.image_url && <Image src={car.image_url} alt={car.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />}
              </Reveal>
            </div>
            <Stagger className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
              {car.specs.slice(0, 4).map((s, i) => (
                <StaggerItem key={s.label} className="card flex items-center gap-4 p-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-2">
                    {i === 0 ? <Gauge className="size-5" /> : i === 1 ? <Flag className="size-5" /> : <Trophy className="size-5" />}
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{s.label}</p>
                    <p className="font-display text-xl font-bold">{s.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ─── Newsletter ───────────────────────────────────────────────── */}
      <section className="container-x pb-8 pt-12">
        <Reveal className="card relative overflow-hidden px-6 py-12 sm:px-12 sm:py-16">
          <div className="racing-stripe absolute -right-20 -top-20 size-72 rotate-12 opacity-20" aria-hidden />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-accent-2">Paddock Pass</p>
              <h2 className="display text-4xl sm:text-5xl">Get inside the garage</h2>
              <p className="mt-4 max-w-md text-muted">Race previews, debriefs, tech explainers and ticket pre-sales. One email a week during the season.</p>
            </div>
            <NewsletterForm source="home" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
