import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRaceBySlug, getRaceSlugs, getRaces } from "@/features/races/queries";
import { Countdown } from "@/components/shared/countdown";
import { RaceCard, raceStatus, raceWeekendRange } from "@/components/shared/race-card";
import { Lozenge } from "@/components/ui/lozenge";
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

const th = "type-body-small px-3 pb-3 text-left font-medium text-subtle first:pl-0 last:pr-0";
const td = "px-3 py-4 first:pl-0 last:pr-0";

export default async function RacePage({ params }: PageProps<"/races/[slug]">) {
  const { slug } = await params;
  const race = await getRaceBySlug(slug);
  if (!race) notFound();
  const all = await getRaces(race.season);
  const idx = all.findIndex((r) => r.id === race.id);
  const neighbours = [all[idx - 1], all[idx + 1]].filter(Boolean);
  const upcoming = race.status === "upcoming" || race.status === "live";
  const winner = race.results.find((r) => r.position === 1);
  const status = raceStatus(race) ?? { label: "Upcoming", appearance: "warning" as const };

  const facts: { label: string; value: string; unit?: string }[] = [
    { label: "Circuit length", value: race.circuit_length_km ? String(race.circuit_length_km) : "—", unit: race.circuit_length_km ? "km" : undefined },
    { label: "Laps", value: race.laps ? String(race.laps) : "—" },
    { label: "Race distance", value: race.circuit_length_km && race.laps ? (race.circuit_length_km * race.laps).toFixed(1) : "—", unit: race.circuit_length_km && race.laps ? "km" : undefined },
    { label: "Lap record", value: race.lap_record ?? "—" },
  ];

  return (
    <>
      <section className="relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden pb-14 pt-40">
        {race.hero_image_url && <Image src={race.hero_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />}
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-3">
              <Lozenge appearance={status.appearance}>{status.label}</Lozenge>
              <span className="text-subtle">Round {race.round} · {race.season}</span>
            </div>
            <h1 className="type-display-xl mt-4 max-w-5xl">{race.name}</h1>
            <p className="mt-5"><span aria-hidden>{flagEmoji(race.country_code)}</span> {race.circuit_name} · {race.city}, {race.country}</p>
            <p className="mt-1">{raceWeekendRange(race)}</p>
          </div>
          {upcoming ? (
            <Countdown target={race.race_start} size="lg" />
          ) : winner ? (
            <div className="card min-w-72 p-6">
              <p className="text-subtle">Race winner</p>
              <p className="type-heading-large mt-1">{winner.driver_name}</p>
              <p className="type-body-small mt-1 text-subtle">{winner.team_name} · {winner.time_text}</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Circuit in numbers */}
      <section className="mt-20">
        <h2 className="container-x type-heading-medium">{race.circuit_name} in numbers</h2>
        <div className="scrollbar-none mt-6 flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-10">
          {facts.map((f) => (
            <div key={f.label} className="card shrink-0 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em]">{f.label}</p>
              <p className="mt-2 whitespace-nowrap">
                <span className="type-metric-large">{f.value}</span>
                {f.unit && <span className="ml-1 text-lg font-bold">{f.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-20 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <h2 className="type-heading-xlarge">Weekend Schedule</h2>
          <ul className="mt-8">
            {race.sessions.map((s) => {
              const main = s.name === "Grand Prix";
              return (
                <li key={s.name} className="flex items-center justify-between gap-4 border-t py-5 last:border-b">
                  <div>
                    <p className={cn("font-bold", main ? "text-2xl" : "text-lg")}>{s.name}</p>
                    <p className="type-body-small text-subtle">{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: race.timezone }).format(new Date(s.starts_at))}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold tabular-nums", main ? "text-2xl" : "text-lg")}>{formatTime(s.starts_at, race.timezone)}</p>
                    <p className="type-body-small text-subtle">local time</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {race.summary && <div className="prose-site mt-10">{race.summary.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
        </Reveal>
        {race.circuit_image_url && (
          <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-navy-raised lg:mt-20">
            <Image src={race.circuit_image_url} alt={race.circuit_name} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
          </Reveal>
        )}
      </section>

      {race.results.length > 0 && (
        <section className="container-x mt-24 sm:mt-32">
          <h2 className="type-heading-xlarge">Race Results</h2>
          <div className="scrollbar-none mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem]">
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
                    <tr key={r.id} className="border-t">
                      <td className={cn(td, "font-bold tabular-nums", ours ? "text-2xl" : "text-lg")}>{r.position ?? "—"}</td>
                      <td className={cn(td, "font-medium", ours && "text-2xl font-bold")}>
                        {r.driver_name}
                        {r.fastest_lap && <Lozenge appearance="discovery" className="ml-2 align-middle">Fastest lap</Lozenge>}
                      </td>
                      <td className={cn(td, "type-body-small text-subtle")}>{r.team_name}</td>
                      <td className={cn(td, "text-right tabular-nums text-subtle")}>{r.grid ?? "—"}</td>
                      <td className={cn(td, "text-right tabular-nums")}>{r.status === "Finished" ? r.time_text : r.status}</td>
                      <td className={cn(td, "text-right font-bold tabular-nums", ours ? "text-[1.8125rem]" : "text-lg")}>{r.points ? formatPoints(r.points) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {neighbours.length > 0 && (
        <section className="container-x mt-24 sm:mt-32">
          <h2 className="type-heading-xlarge">Around This Round</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {neighbours.map((r) => <RaceCard key={r.id} race={r} />)}
          </div>
        </section>
      )}
    </>
  );
}
