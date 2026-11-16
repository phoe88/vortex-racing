import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, flagEmoji, formatDate, formatDateRange } from "@/lib/utils";
import type { Race } from "@/types";

export function raceWeekendRange(race: Race) {
  const first = race.sessions?.[0]?.starts_at ?? race.race_start;
  return formatDateRange(first, race.race_start);
}

export function RaceCard({ race, highlight = false, className }: { race: Race; highlight?: boolean; className?: string }) {
  const status =
    race.status === "live" ? { label: "Live", tone: "accent" as const }
    : race.status === "completed" ? { label: "Completed", tone: "muted" as const }
    : race.status === "cancelled" ? { label: "Cancelled", tone: "outline" as const }
    : highlight ? { label: "Next up", tone: "yellow" as const } : null;

  return (
    <Link
      href={`/races/${race.slug}`}
      className={cn(
        "group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-navy-2 p-5 transition hover:border-white/25",
        highlight && "ring-1 ring-accent-2/60",
        className,
      )}
    >
      {race.circuit_image_url && (
        <Image
          src={race.circuit_image_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-30 transition duration-700 group-hover:scale-105 group-hover:opacity-45"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />
      <div className="relative flex items-start justify-between">
        <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">Round {String(race.round).padStart(2, "0")}</span>
        {status && <Badge tone={status.tone}>{status.label}</Badge>}
      </div>
      <div className="relative">
        <p className="text-2xl leading-none">{flagEmoji(race.country_code)}</p>
        <h3 className="display mt-2 text-2xl sm:text-3xl">{race.name}</h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ice/70"><MapPin className="size-3.5" /> {race.circuit_name}</p>
        <p className="mt-3 font-display text-lg font-semibold uppercase tracking-wide text-accent-2">
          {race.status === "completed" ? formatDate(race.race_start, { day: "numeric", month: "short" }) : raceWeekendRange(race)}
        </p>
      </div>
    </Link>
  );
}
