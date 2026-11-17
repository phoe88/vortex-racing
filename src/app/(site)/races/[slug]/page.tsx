import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Repeat, Ruler, Timer, Zap } from "lucide-react";
import { getRaceBySlug, getRaceSlugs, getRaces } from "@/features/races/queries";
import { Countdown } from "@/components/shared/countdown";
import { RaceCard, raceWeekendRange } from "@/components/shared/race-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Lozenge } from "@/components/ui/lozenge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { darkSubtree } from "@/lib/theme";
import { cn, flagEmoji, formatPoints, formatTime } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return (await getRaceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/races/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) return { title: "Race not found" };
  return {
    title: `${race.name} ${race.season}`,
    description: `Round ${race.round} of the ${race.season} season at ${race.circuit_name}: session times, circuit facts and results.`,
    alternates: { canonical: `/races/${race.slug}` },
  };
}

/* Table cells, matching the standings tables. */
const th = "type-body-small border-b-2 px-2 py-1.5 font-bold text-subtle";
const td = "px-2 py-2";

export default async function RacePage({ params }: PageProps<"/races/[slug]">) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) notFound();
  const all = await getRaces(race.season);
  const idx = all.findIndex((r) => r.id === race.id);
  const neighbours = [all[idx - 1], all[idx + 1]].filter(Boolean);
  const upcoming = race.status === "upcoming" || race.status === "live";
  const winner = race.results.find((r) => r.position === 1);
  const fastest = race.results.find((r) => r.fastest_lap);
  const status =
    race.status === "live" ? { label: "Live", appearance: "success" as const }
    : race.status === "completed" ? { label: "Completed", appearance: "neutral" as const }
    : race.status === "cancelled" ? { label: "Cancelled", appearance: "danger" as const }
    : { label: "Upcoming", appearance: "information" as const };

  const facts = [
    { Icon: Ruler, label: "Circuit length", value: race.circuit_length_km ? `${race.circuit_length_km} km` : "—" },
    { Icon: Repeat, label: "Laps", value: race.laps ?? "—" },
    { Icon: Zap, label: "Race distance", value: race.circuit_length_km && race.laps ? `${(race.circuit_length_km * race.laps).toFixed(1)} km` : "—" },
    { Icon: Timer, label: "Lap record", value: race.lap_record ?? "—" },
  ];

  return (
    <>
      <section className="container-x pt-4 sm:pt-6">
        <Breadcrumbs items={[{ label: "Race calendar", href: "/races" }, { label: race.name }]} />
        {/* Race banner: always dark so the text stays legible over the photograph. */}
        <div
          {...darkSubtree}
          className="relative isolate mt-4 grid gap-6 overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-end"
        >
          {race.hero_image_url && <Image src={race.hero_image_url} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover" />}
          <div className="media-scrim-soft absolute inset-0 -z-10" />
          <div className="pt-24 sm:pt-40">
            <div className="flex items-center gap-2">
              <Lozenge appearance={status.appearance}>{status.label}</Lozenge>
              <span className="type-body-small text-subtle">Round {race.round} · {race.season}</span>
            </div>
            <h1 className="type-heading-xlarge sm:type-heading-xxlarge mt-2"><span aria-hidden>{flagEmoji(race.country_code)}</span> {race.name}</h1>
            <p className="type-body-large mt-1 text-subtle">{race.circuit_name} · {race.city}, {race.country}</p>
            <p className="mt-1 text-sm font-medium">{raceWeekendRange(race)}</p>
          </div>
          {upcoming ? (
            <Countdown target={race.race_start} />
          ) : winner ? (
            <div className="rounded-lg bg-surface-overlay p-4 shadow-overlay">
              <p className="type-body-small text-subtle">Race winner</p>
              <p className="type-heading-large mt-0.5">{winner.driver_name}</p>
              <p className="text-sm text-subtle">{winner.team_name} · {winner.time_text}</p>
              {fastest && <p className="type-body-small mt-2 text-subtle">Fastest lap: <span className="font-medium text-default">{fastest.driver_name}</span></p>}
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="type-heading-medium mb-3">Circuit facts</h2>
          <ul className="grid grid-cols-2 gap-4">
            {facts.map(({ Icon, label, value }) => (
              <li key={label} className="card p-4">
                <Icon className="size-4 text-icon-subtle" aria-hidden />
                <p className="type-body-small mt-2 text-subtle">{label}</p>
                <p className="type-heading-medium">{value}</p>
              </li>
            ))}
          </ul>
          {race.circuit_image_url && (
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-neutral">
              <Image src={race.circuit_image_url} alt={race.circuit_name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="type-heading-medium mb-3">Weekend schedule</h2>
          <ul className="card divide-y overflow-hidden">
            {race.sessions.map((s) => {
              const main = s.name === "Grand Prix";
              return (
                <li key={s.name} className={cn("flex items-center justify-between gap-4 px-4 py-3", main && "bg-selected")}>
                  <div>
                    <p className={cn("type-heading-xsmall", main && "text-selected")}>{s.name}</p>
                    <p className="type-body-small text-subtle">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: race.timezone }).format(new Date(s.starts_at))}</p>
                  </div>
                  <div className="text-right">
                    <p className="type-heading-small tabular-nums">{formatTime(s.starts_at, race.timezone)}</p>
                    <p className="type-body-small text-subtlest">local time</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {race.summary && <div className="prose-ads mt-6">{race.summary.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
        </Reveal>
      </section>

      {race.results.length > 0 && (
        <section className="container-x pb-8">
          <SectionHeading eyebrow="Classification" title="Race result" />
          <div className="scrollbar-none overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr>
                  <th className={cn(th, "w-12")}>Pos</th>
                  <th className={th}>Driver</th>
                  <th className={th}>Team</th>
                  <th className={cn(th, "text-right")}>Grid</th>
                  <th className={cn(th, "text-right")}>Time / Status</th>
                  <th className={cn(th, "text-right")}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {race.results.map((r) => {
                  const ours = r.team_name === siteConfig.name;
                  return (
                    <tr key={r.id} className={cn("border-b", ours && "bg-selected")}>
                      <td className={cn(td, "font-medium tabular-nums", ours && "text-selected")}>{r.position ?? "—"}</td>
                      <td className={cn(td, "font-medium", ours && "text-selected")}>
                        {r.driver_name}
                        {r.fastest_lap && <Lozenge appearance="discovery" className="ml-2 align-middle">Fastest lap</Lozenge>}
                      </td>
                      <td className={cn(td, "text-subtle")}>{r.team_name}</td>
                      <td className={cn(td, "text-right tabular-nums")}>{r.grid ?? "—"}</td>
                      <td className={cn(td, "text-right tabular-nums text-subtle")}>{r.status === "Finished" ? r.time_text : r.status}</td>
                      <td className={cn(td, "text-right font-bold tabular-nums")}>{r.points ? formatPoints(r.points) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {neighbours.length > 0 && (
        <section className="container-x pt-4">
          <SectionHeading eyebrow="Calendar" title="Around this round" href="/races" />
          <div className="grid gap-4 sm:grid-cols-2">
            {neighbours.map((r) => <RaceCard key={r.id} race={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
