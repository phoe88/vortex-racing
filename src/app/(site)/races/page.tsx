import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getNextRace, getRaces } from "@/features/races/queries";
import { RaceCard, raceStatus, raceWeekendRange } from "@/components/shared/race-card";
import { Countdown } from "@/components/shared/countdown";
import { PageHero } from "@/components/shared/page-hero";
import { buttonClass } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { darkSubtree } from "@/lib/theme";
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
  const nextStatus = next ? raceStatus(next, true) : null;

  return (
    <>
      <PageHero eyebrow={`${siteConfig.season} season`} title="Race calendar" description={`${races.length} rounds. ${completed.length} down, ${upcoming.length} to go.`} />

      {next && (
        <section className="container-x mb-8">
          <Link
            href={`/races/${next.slug}`}
            {...darkSubtree}
            className="group relative isolate grid gap-6 overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:p-8 lg:grid-cols-2 lg:items-end"
          >
            {next.hero_image_url && <Image src={next.hero_image_url} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover" />}
            <div className="media-scrim-soft absolute inset-0 -z-10" />
            <div className="pt-24 sm:pt-32">
              <div className="flex items-center gap-2">
                {nextStatus && <Lozenge appearance={nextStatus.appearance}>{nextStatus.label}</Lozenge>}
                <span className="type-body-small text-subtle">Round {next.round}</span>
              </div>
              <h2 className="type-heading-xlarge mt-2 group-hover:underline"><span aria-hidden>{flagEmoji(next.country_code)}</span> {next.name}</h2>
              <p className="mt-1 text-sm text-subtle">{next.circuit_name} · {raceWeekendRange(next)}</p>
              <span className={buttonClass({ appearance: "primary", className: "mt-4" })}>Circuit guide <ArrowRight className="size-4" aria-hidden /></span>
            </div>
            <Countdown target={next.race_start} className="w-full lg:max-w-md lg:justify-self-end" />
          </Link>
        </section>
      )}

      <section className="container-x pb-8">
        <SectionHeading eyebrow="Up next" title="Remaining rounds" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {upcoming.map((r) => <StaggerItem key={r.id}><RaceCard race={r} highlight={r.id === next?.id} className="h-full" /></StaggerItem>)}
          {upcoming.length === 0 && <p className="text-sm text-subtle">Season complete. See you next year.</p>}
        </Stagger>
      </section>

      <section className="container-x pt-4">
        <SectionHeading eyebrow="Results" title="Completed rounds" href="/standings" linkLabel="Standings" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...completed].reverse().map((r) => <RaceCard key={r.id} race={r} />)}
        </div>
      </section>
    </>
  );
}
