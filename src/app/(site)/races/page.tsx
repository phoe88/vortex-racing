import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getNextRace, getRaces } from "@/features/races/queries";
import { getConstructorStandings, getDriverStandings } from "@/features/standings/queries";
import { raceDay, raceStatus, raceWeekendRange } from "@/components/shared/race-card";
import { Countdown } from "@/components/shared/countdown";
import { DriverStandingsTable } from "@/components/shared/standings-table";
import { ButtonLink } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { flagEmoji, formatPoints, ordinal } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Race } from "@/types";

export const metadata: Metadata = {
  title: `${siteConfig.season} Race Calendar`,
  description: `Every round of the ${siteConfig.season} season: dates, circuits, session times and results.`,
  alternates: { canonical: "/races" },
};

export default async function RacesPage() {
  const [races, next, drivers, constructors] = await Promise.all([getRaces(), getNextRace(), getDriverStandings(), getConstructorStandings()]);
  const completed = races.filter((r) => r.status === "completed").length;
  const ours = constructors.find((c) => c.is_team);

  return (
    <>
      {/* Next race, set large */}
      {next ? (
        <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden pb-14 pt-40">
          {next.hero_image_url && <Image src={next.hero_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-60" />}
          <div className="media-scrim-soft absolute inset-0 -z-10" />
          <div className="container-x grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="flex items-center gap-3 text-subtle">
                <span className="h-px w-12 bg-red" aria-hidden /> Round {next.round} of {races.length}
              </p>
              <h1 className="type-display-xl mt-4 max-w-5xl">{next.name}</h1>
              <p className="mt-5"><span aria-hidden>{flagEmoji(next.country_code)}</span> {next.circuit_name}</p>
              <p className="mt-1">{raceWeekendRange(next)}</p>
              <ButtonLink href={`/races/${next.slug}`} appearance="primary" className="mt-8">View Event Info</ButtonLink>
            </div>
            <Countdown target={next.race_start} size="lg" />
          </div>
        </section>
      ) : (
        <section className="container-x pb-10 pt-36 sm:pt-44"><h1 className="type-display">Race Calendar</h1></section>
      )}

      {/* Standings summary */}
      <section className="container-x mt-24 grid gap-10 lg:grid-cols-[22rem_1fr]">
        <div>
          <h2 className="type-display">Overall Standings</h2>
          <p className="mt-4 text-subtle">After {completed} of {races.length} rounds.{ours && ` ${siteConfig.name} are ${ordinal(ours.position)} with ${formatPoints(ours.points)} points.`}</p>
          <ButtonLink href="/standings" className="mt-6">Full standings</ButtonLink>
        </div>
        <DriverStandingsTable rows={drivers.slice(0, 8)} />
      </section>

      {/* Full calendar */}
      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">{siteConfig.season} Calendar</h2>
        <ol className="mt-8">
          {races.map((r) => <CalendarRow key={r.id} race={r} isNext={r.id === next?.id} />)}
        </ol>
      </section>
    </>
  );
}

function CalendarRow({ race, isNext }: { race: Race; isNext: boolean }) {
  const [day, month] = raceDay(race);
  const status = raceStatus(race, isNext);
  return (
    <li className="border-t last:border-b">
      <Link href={`/races/${race.slug}`} className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[6rem_1fr_auto_auto] sm:gap-8">
        <div>
          <p className="type-heading-xlarge tabular-nums leading-none">{day}</p>
          <p className="type-body-small mt-1 text-subtle"><span aria-hidden>{flagEmoji(race.country_code)}</span> {month}</p>
        </div>
        <div className="min-w-0">
          <p className="type-body-small text-subtle">Round {race.round}</p>
          <h3 className="type-heading-medium transition-opacity group-hover:opacity-70">{race.name}</h3>
          <p className="type-body-small text-subtle">{race.circuit_name}</p>
        </div>
        <div className="hidden sm:block">{status && <Lozenge appearance={status.appearance}>{status.label}</Lozenge>}</div>
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-neutral transition-colors group-hover:bg-neutral-hovered" aria-hidden>
          <ChevronRight className="size-5" />
        </span>
      </Link>
    </li>
  );
}
