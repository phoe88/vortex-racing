import Image from "next/image";
import Link from "next/link";
import { Lozenge, type LozengeAppearance } from "@/components/ui/lozenge";
import { cn, flagEmoji, formatDate, formatDateRange } from "@/lib/utils";
import type { Race } from "@/types";

export function raceWeekendRange(race: Race) {
  const first = race.sessions?.[0]?.starts_at ?? race.race_start;
  return formatDateRange(first, race.race_start);
}

/** Status label for a race. `isNext` marks the upcoming race on the calendar. */
export function raceStatus(race: Pick<Race, "status">, isNext = false): { label: string; appearance: LozengeAppearance } | null {
  if (race.status === "live") return { label: "Live", appearance: "accent-red" };
  if (race.status === "completed") return { label: "Completed", appearance: "neutral" };
  if (race.status === "cancelled") return { label: "Cancelled", appearance: "danger" };
  if (isNext) return { label: "Next race", appearance: "warning" };
  return null;
}

/** Day and short month of the race, e.g. ["20", "Nov"]. */
export function raceDay(race: Race): [string, string] {
  const d = new Date(race.race_start);
  return [
    new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: race.timezone }).format(d),
    new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: race.timezone }).format(d),
  ];
}

/** Calendar tile: circuit photo with round, date and name over it. */
export function RaceCard({ race, highlight = false, className }: { race: Race; highlight?: boolean; className?: string }) {
  const status = raceStatus(race, highlight);
  const image = race.hero_image_url ?? race.circuit_image_url;

  return (
    <Link
      href={`/races/${race.slug}`}
      className={cn(
        "group relative isolate flex min-h-80 flex-col justify-between overflow-hidden rounded-xl bg-navy-raised p-5",
        highlight && "ring-2 ring-red ring-inset",
        className,
      )}
    >
      {image && (
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw" className="-z-20 object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      )}
      <div className="media-scrim absolute inset-0 -z-10" />
      <div className="flex items-start justify-between gap-2">
        <span className="type-body-small font-medium text-subtle">Round {String(race.round).padStart(2, "0")}</span>
        {status && <Lozenge appearance={status.appearance}>{status.label}</Lozenge>}
      </div>
      <div>
        <h3 className="type-heading-medium">{race.name}</h3>
        <p className="mt-1 text-subtle"><span aria-hidden>{flagEmoji(race.country_code)}</span> {race.circuit_name}</p>
        <p className="mt-3 font-medium">
          {race.status === "completed" ? formatDate(race.race_start, { day: "numeric", month: "long" }) : raceWeekendRange(race)}
        </p>
      </div>
    </Link>
  );
}
