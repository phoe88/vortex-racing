import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Ruler, Repeat, Timer, Zap } from "lucide-react";
import { getRaceBySlug, getRaceSlugs, getRaces } from "@/features/races/queries";
import { Countdown } from "@/components/shared/countdown";
import { RaceCard, raceWeekendRange } from "@/components/shared/race-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
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

  const facts = [
    { Icon: Ruler, label: "Circuit length", value: race.circuit_length_km ? `${race.circuit_length_km} km` : "—" },
    { Icon: Repeat, label: "Laps", value: race.laps ?? "—" },
    { Icon: Zap, label: "Race distance", value: race.circuit_length_km && race.laps ? `${(race.circuit_length_km * race.laps).toFixed(1)} km` : "—" },
    { Icon: Timer, label: "Lap record", value: race.lap_record ?? "—" },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        {race.hero_image_url && <Image src={race.hero_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/60 via-night/70 to-night" />
        <div className="container-x">
          <Link href="/races" className="inline-flex items-center gap-1.5 text-sm text-ice/80 hover:text-ice"><ArrowLeft className="size-4" /> Calendar</Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <Badge tone={race.status === "live" ? "accent" : race.status === "completed" ? "muted" : "yellow"}>
                  {race.status === "live" ? "Live" : race.status === "completed" ? "Completed" : "Upcoming"}
                </Badge>
                <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-ice/70">Round {race.round} · {race.season}</span>
              </div>
              <h1 className="display mt-4 text-5xl sm:text-6xl lg:text-8xl">{flagEmoji(race.country_code)} {race.name}</h1>
              <p className="mt-4 text-lg text-ice/85">{race.circuit_name} · {race.city}, {race.country}</p>
              <p className="mt-1 font-display text-2xl font-semibold uppercase text-accent-2">{raceWeekendRange(race)}</p>
            </div>
            {upcoming ? (
              <Countdown target={race.race_start} />
            ) : winner ? (
              <div className="card p-6">
                <p className="eyebrow text-accent-2">Race winner</p>
                <p className="display mt-2 text-4xl">{winner.driver_name}</p>
                <p className="text-sm text-muted">{winner.team_name} · {winner.time_text}</p>
                {fastest && <p className="mt-3 text-xs text-muted">Fastest lap: <span className="text-ice">{fastest.driver_name}</span></p>}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <p className="eyebrow mb-4 text-accent">Circuit facts</p>
          <ul className="grid grid-cols-2 gap-3">
            {facts.map(({ Icon, label, value }) => (
              <li key={label} className="card p-4">
                <Icon className="size-5 text-accent-2" />
                <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
                <p className="font-display text-2xl font-bold">{value}</p>
              </li>
            ))}
          </ul>
          {race.circuit_image_url && (
            <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl">
              <Image src={race.circuit_image_url} alt={race.circuit_name} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-4 text-accent">Weekend schedule</p>
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {race.sessions.map((s) => (
              <li key={s.name} className={cn("flex items-center justify-between px-5 py-4", s.name === "Grand Prix" && "bg-accent-soft")}>
                <div>
                  <p className="font-display text-lg font-bold uppercase">{s.name}</p>
                  <p className="text-xs text-muted">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: race.timezone }).format(new Date(s.starts_at))}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold tabular-nums">{formatTime(s.starts_at, race.timezone)}</p>
                  <p className="text-[11px] text-muted">local time</p>
                </div>
              </li>
            ))}
          </ul>
          {race.summary && <div className="prose-racing mt-8">{race.summary.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
        </Reveal>
      </section>

      {race.results.length > 0 && (
        <section className="container-x pb-16">
          <SectionHeading eyebrow="Classification" title="Race result" />
          <div className="overflow-x-auto rounded-2xl border border-line scrollbar-none">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-white/4 text-[11px] uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pos</th>
                  <th className="px-4 py-3 font-semibold">Driver</th>
                  <th className="px-4 py-3 font-semibold">Team</th>
                  <th className="px-4 py-3 text-right font-semibold">Grid</th>
                  <th className="px-4 py-3 text-right font-semibold">Time / Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {race.results.map((r) => {
                  const ours = r.team_name === siteConfig.name;
                  return (
                    <tr key={r.id} className={cn("border-t border-line/60", ours && "bg-accent-soft")}>
                      <td className="px-4 py-3 font-display text-lg font-bold tabular-nums">{r.position ?? "—"}</td>
                      <td className={cn("px-4 py-3 font-semibold", ours && "text-white")}>
                        {r.driver_name}
                        {r.fastest_lap && <span className="ml-2 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-purple-300">FL</span>}
                      </td>
                      <td className="px-4 py-3 text-muted">{r.team_name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.grid ?? "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-ice/85">{r.status === "Finished" ? r.time_text : r.status}</td>
                      <td className="px-4 py-3 text-right font-display text-lg font-bold tabular-nums">{r.points ? formatPoints(r.points) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {neighbours.length > 0 && (
        <section className="container-x pb-8">
          <SectionHeading eyebrow="Calendar" title="Around this round" href="/races" />
          <div className="grid gap-4 sm:grid-cols-2">
            {neighbours.map((r) => <RaceCard key={r.id} race={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
