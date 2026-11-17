import Link from "next/link";
import { MapPin } from "lucide-react";
import { Lozenge, type LozengeAppearance } from "@/components/ui/lozenge";
import { cn, flagEmoji, formatDate, formatDateRange } from "@/lib/utils";
import type { Race } from "@/types";

export function raceWeekendRange(race: Race) {
  const first = race.sessions?.[0]?.starts_at ?? race.race_start;
  return formatDateRange(first, race.race_start);
}

/** Status label for a race. `isNext` marks the upcoming race on the calendar. */
export function raceStatus(race: Pick<Race, "status">, isNext = false): { label: string; appearance: LozengeAppearance } | null {
  if (race.status === "live") return { label: "Live", appearance: "success" };
  if (race.status === "completed") return { label: "Completed", appearance: "neutral" };
  if (race.status === "cancelled") return { label: "Cancelled", appearance: "danger" };
  if (isNext) return { label: "Next race", appearance: "information" };
  return null;
}

export function RaceCard({ race, highlight = false, className }: { race: Race; highlight?: boolean; className?: string }) {
  const status = raceStatus(race, highlight);

  return (
    <Link
      href={`/races/${race.slug}`}
      className={cn(
        "card group flex min-h-44 flex-col justify-between gap-4 p-4 transition-colors hover:bg-surface-raised-hovered active:bg-surface-raised-pressed",
        highlight && "outline-2 -outline-offset-2 outline-(color:--ds-border-selected)",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="type-body-small text-subtlest">Round {String(race.round).padStart(2, "0")}</span>
        {status && <Lozenge appearance={status.appearance}>{status.label}</Lozenge>}
      </div>
      <div>
        <p className="text-xl leading-none" aria-hidden>{flagEmoji(race.country_code)}</p>
        <h3 className="type-heading-medium mt-2 group-hover:underline">{race.name}</h3>
        <p className="type-body-small mt-1 inline-flex items-center gap-1 text-subtle"><MapPin className="size-3.5" aria-hidden /> {race.circuit_name}</p>
        <p className="mt-2 text-sm font-medium">
          {race.status === "completed" ? formatDate(race.race_start, { day: "numeric", month: "short" }) : raceWeekendRange(race)}
        </p>
      </div>
    </Link>
  );
}
