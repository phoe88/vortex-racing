import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getNextRace, getRaces } from "@/features/races/queries";
import { RaceCard, raceWeekendRange } from "@/components/shared/race-card";
import { Countdown } from "@/components/shared/countdown";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { flagEmoji } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.season} Race Calendar`,
  description: `Every round of the ${siteConfig.season} season: dates, circuits, session times and results.`,
  alternates: { canonical: "/races" },
};

export default async function RacesPage() {
  const [races, next] = await Promise.all([getRaces(), getNextRace()]);
  const completed = races.filter((r) => r.status === "completed");
  const upcoming = races.filter((r) => r.status !== "completed");

  return (
    <>
      <PageHero eyebrow={`${siteConfig.season} season`} title="Race calendar" description={`${races.length} rounds. ${completed.length} down, ${upcoming.length} to go.`} />

      {next && (
        <section className="container-x -mt-4 mb-16">
          <Link href={`/races/${next.slug}`} className="group relative block overflow-hidden rounded-2xl bg-navy-2">
            {next.hero_image_url && <Image src={next.hero_image_url} alt="" fill priority sizes="100vw" className="object-cover opacity-50 transition duration-700 group-hover:scale-[1.03]" />}
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-night/20" />
            <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-end">
              <div>
                <Badge tone="yellow">{next.status === "live" ? "Live" : "Next up"} · Round {next.round}</Badge>
                <h2 className="display mt-4 text-5xl sm:text-6xl">{flagEmoji(next.country_code)} {next.name}</h2>
                <p className="mt-3 text-ice/80">{next.circuit_name} · {raceWeekendRange(next)}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent-2">Circuit guide <ArrowRight className="size-4" /></span>
              </div>
              <Countdown target={next.race_start} className="lg:max-w-md lg:justify-self-end" />
            </div>
          </Link>
        </section>
      )}

      <section className="container-x pb-16">
        <SectionHeading eyebrow="Up next" title="Remaining rounds" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {upcoming.map((r) => <StaggerItem key={r.id}><RaceCard race={r} highlight={r.id === next?.id} /></StaggerItem>)}
          {upcoming.length === 0 && <p className="text-muted">Season complete. See you next year.</p>}
        </Stagger>
      </section>

      <section className="container-x pb-8">
        <SectionHeading eyebrow="Results" title="Completed rounds" href="/standings" linkLabel="Standings" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...completed].reverse().map((r) => <RaceCard key={r.id} race={r} />)}
        </div>
      </section>
    </>
  );
}
