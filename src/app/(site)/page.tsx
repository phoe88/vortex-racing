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
import { raceStatus, raceWeekendRange } from "@/components/shared/race-card";
import { PartnerStrip } from "@/components/shared/partner-logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { ConstructorStandingsTable, DriverStandingsTable } from "@/components/shared/standings-table";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { darkSubtree } from "@/lib/theme";
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
  const nextStatus = nextRace ? raceStatus(nextRace, true) : null;

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="container-x grid gap-4 pt-4 sm:pt-6 lg:grid-cols-[1.25fr_1fr]">
        {featured && <ArticleCard article={featured} variant="hero" priority />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {nextRace && (
            <Link
              href={`/races/${nextRace.slug}`}
              {...darkSubtree}
              className="group relative isolate flex min-h-72 flex-col justify-between overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:col-span-2 sm:p-6 lg:col-span-1"
            >
              {nextRace.hero_image_url && (
                <Image src={nextRace.hero_image_url} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="-z-20 object-cover" />
              )}
              <div className="media-scrim absolute inset-0 -z-10" />
              <div className="flex items-center justify-between gap-2">
                {nextStatus && <Lozenge appearance={nextStatus.appearance}>{nextStatus.label}</Lozenge>}
                <span className="type-body-small text-subtle">Round {nextRace.round}</span>
              </div>
              <div>
                <p className="text-xl leading-none" aria-hidden>{flagEmoji(nextRace.country_code)}</p>
                <h2 className="type-heading-large mt-2 group-hover:underline">{nextRace.name}</h2>
                <p className="mt-1 text-sm text-subtle">{nextRace.circuit_name} · {raceWeekendRange(nextRace)}</p>
                <Countdown target={nextRace.race_start} className="mt-4" />
              </div>
            </Link>
          )}
          {sideStories.map((a) => (
            <ArticleCard key={a.id} article={a} variant="overlay" className="lg:hidden" />
          ))}
          {sideStories[0] && (
            <div className="hidden grid-cols-2 gap-4 lg:grid">
              {sideStories.map((a) => (
                <ArticleCard key={a.id} article={a} variant="overlay" fill />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Partners strip ───────────────────────────────────────────── */}
      {partners.length > 0 && <div className="mt-8"><PartnerStrip partners={partners} /></div>}

      {/* ─── Latest news ──────────────────────────────────────────────── */}
      <section className="container-x py-12">
        <SectionHeading eyebrow="Paddock feed" title="Latest from the team" href="/news" linkLabel="All news" />
        <Stagger className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {gridStories.map((a) => (
            <StaggerItem key={a.id}><ArticleCard article={a} /></StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ─── Race centre ──────────────────────────────────────────────── */}
      {(nextRace || lastRace) && (
        <section className="border-y bg-surface-sunken py-12">
          <div className="container-x grid gap-6 lg:grid-cols-2">
            {nextRace && (
              <Reveal className="card p-4 sm:p-6">
                <p className="type-heading-xxsmall mb-1 text-subtlest">Race weekend</p>
                <h2 className="type-heading-large">{nextRace.name}</h2>
                <p className="mt-1 text-sm text-subtle">{nextRace.city}, {nextRace.country} · {nextRace.circuit_name}</p>
                <ul className="mt-4 divide-y border-y">
                  {nextRace.sessions.map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-4 py-2 text-sm">
                      <span className={s.name === "Grand Prix" ? "font-bold" : undefined}>{s.name}</span>
                      <span className="tabular-nums text-subtle">
                        {new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: nextRace.timezone }).format(new Date(s.starts_at))}
                        <span className="ml-3 font-medium text-default">{formatTime(s.starts_at, nextRace.timezone)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={`/races/${nextRace.slug}`} className="mt-4">Circuit guide <ArrowRight className="size-4" aria-hidden /></ButtonLink>
              </Reveal>
            )}
            {lastRace && (
              <Reveal delay={0.05} className="card p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="type-heading-xxsmall text-subtlest">Last time out</p>
                  <Lozenge>Round {lastRace.round}</Lozenge>
                </div>
                <h3 className="type-heading-large mt-1">{lastRace.name}</h3>
                <ul className="mt-4 space-y-2">
                  {teamResults.map((r) => (
                    <li key={r.id} className="flex items-center gap-4 rounded-lg bg-neutral px-4 py-3">
                      <span className="type-metric-medium w-12 tabular-nums">
                        {r.position ? `P${r.position}` : "DNF"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{r.driver_name}</p>
                        <p className="type-body-small text-subtle">{r.status === "Finished" ? `Grid ${r.grid} · ${r.time_text}` : r.status}</p>
                      </div>
                      <Lozenge appearance={r.points ? "success" : "neutral"}>+{formatPoints(r.points)} pts</Lozenge>
                    </li>
                  ))}
                </ul>
                <Link href={`/races/${lastRace.slug}`} className="link mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Full classification <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ─── Championship ─────────────────────────────────────────────── */}
      <section className="container-x py-12">
        <SectionHeading eyebrow={`${siteConfig.season} ${siteConfig.championshipName}`} title="Championship" href="/standings" linkLabel="Full standings" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {snapshot.teamDrivers.map((d) => (
              <div key={d.id} className="card flex items-center gap-4 p-4">
                <span className="type-metric-large w-16 shrink-0 tabular-nums text-brand">{ordinal(d.position)}</span>
                <div className="min-w-0">
                  <p className="type-heading-small">{d.driver_name}</p>
                  <p className="type-body-small mt-0.5 text-subtle">{formatPoints(d.points)} pts · {d.wins} wins · {d.podiums} podiums</p>
                </div>
              </div>
            ))}
            {snapshot.teamConstructor && (
              <div className="card flex items-center gap-4 p-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-yellow-subtler text-accent-yellow-bolder">
                  <Trophy className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="type-body-small text-subtle">Constructors&apos; championship</p>
                  <p className="type-heading-small">{ordinal(snapshot.teamConstructor.position)} · {formatPoints(snapshot.teamConstructor.points)} pts</p>
                </div>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.05} className="card p-4">
            <h3 className="type-heading-xsmall mb-2">Drivers&apos; top 5</h3>
            <DriverStandingsTable rows={snapshot.topDrivers} compact />
          </Reveal>
          <Reveal delay={0.1} className="card p-4">
            <h3 className="type-heading-xsmall mb-2">Constructors&apos; top 5</h3>
            <ConstructorStandingsTable rows={snapshot.topConstructors} compact />
          </Reveal>
        </div>
      </section>

      {/* ─── Drivers ──────────────────────────────────────────────────── */}
      <section className="container-x py-12">
        <SectionHeading eyebrow="The line-up" title="Our drivers" href="/team" linkLabel="Meet the team" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {raceDrivers.map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
          {otherDrivers.slice(0, 2).map((d) => (
            <DriverCard key={d.id} driver={d} />
          ))}
        </div>
      </section>

      {/* ─── Car ──────────────────────────────────────────────────────── */}
      {car && (
        <section className="border-y bg-surface-sunken py-12">
          <div className="container-x">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.3fr]">
              <Reveal>
                <Lozenge appearance="information">Season {car.season}</Lozenge>
                <h2 className="type-heading-xxlarge mt-2">{car.name}</h2>
                <p className="type-body-large mt-2 max-w-md text-subtle">{car.tagline}</p>
                <ButtonLink href={`/cars/${car.slug}`} appearance="primary" className="mt-4">Explore the car <ArrowRight className="size-4" aria-hidden /></ButtonLink>
              </Reveal>
              <Reveal delay={0.05} className="relative aspect-[16/9] overflow-hidden rounded-xl bg-neutral">
                {car.image_url && <Image src={car.image_url} alt={car.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />}
              </Reveal>
            </div>
            <Stagger className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {car.specs.slice(0, 4).map((s, i) => (
                <StaggerItem key={s.label} className="card flex items-center gap-3 p-4">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral text-icon-subtle">
                    {i === 0 ? <Gauge className="size-4" aria-hidden /> : i === 1 ? <Flag className="size-4" aria-hidden /> : <Trophy className="size-4" aria-hidden />}
                  </span>
                  <div className="min-w-0">
                    <p className="type-body-small text-subtle">{s.label}</p>
                    <p className="type-heading-small">{s.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* ─── Newsletter ───────────────────────────────────────────────── */}
      <section className="container-x pt-12">
        <Reveal className="card grid gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="type-heading-xxsmall mb-1 text-subtlest">Paddock Pass</p>
            <h2 className="type-heading-large">Get inside the garage</h2>
            <p className="mt-2 max-w-md text-sm text-subtle">Race previews, debriefs, tech explainers and ticket pre-sales. One email a week during the season.</p>
          </div>
          <NewsletterForm source="home" />
        </Reveal>
      </section>
    </>
  );
}
