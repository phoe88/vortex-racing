import { cn, flagEmoji, formatPoints } from "@/lib/utils";
import type { ConstructorStanding, DriverStanding } from "@/types";

/* Standings rows: position, name, team and points separated by hairlines.
   The team's own entries are set larger so they stand out in the list. */
const th = "type-body-small px-3 pb-3 text-left font-medium text-subtle first:pl-0 last:pr-0";
const td = "px-3 py-4 first:pl-0 last:pr-0";

export function DriverStandingsTable({ rows, compact = false }: { rows: DriverStanding[]; compact?: boolean }) {
  return (
    <div className="scrollbar-none overflow-x-auto">
      <table className={cn("w-full", !compact && "min-w-[36rem]")}>
        <thead className="sr-only sm:not-sr-only">
          <tr>
            <th className={cn(th, "w-12")}>Pos</th>
            <th className={th}>Driver</th>
            {!compact && <th className={th}><span className="sr-only">Nationality</span></th>}
            {!compact && <th className={th}>Team</th>}
            <th className={cn(th, "text-right")}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className={cn(td, "font-bold tabular-nums", r.is_team ? "text-2xl" : "text-lg")}>{r.position}</td>
              <td className={td}>
                <span className={cn("font-medium", r.is_team && "text-2xl font-bold")}>
                  {compact && <span className="mr-2" aria-hidden>{flagEmoji(r.country_code)}</span>}
                  {r.driver_name}
                </span>
                {compact && <span className="type-body-small block text-subtle">{r.team_name}</span>}
              </td>
              {!compact && <td className={cn(td, "text-xl")} aria-label={r.country_code}>{flagEmoji(r.country_code)}</td>}
              {!compact && <td className={cn(td, "type-body-small text-subtle")}>{r.team_name}</td>}
              <td className={cn(td, "text-right font-bold tabular-nums", r.is_team ? "text-[1.8125rem]" : "text-lg")}>{formatPoints(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConstructorStandingsTable({ rows, compact = false }: { rows: ConstructorStanding[]; compact?: boolean }) {
  return (
    <div className="scrollbar-none overflow-x-auto">
      <table className={cn("w-full", !compact && "min-w-[26rem]")}>
        <thead className="sr-only sm:not-sr-only">
          <tr>
            <th className={cn(th, "w-12")}>Pos</th>
            <th className={th}>Team</th>
            {!compact && <th className={cn(th, "text-right")}>Wins</th>}
            <th className={cn(th, "text-right")}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className={cn(td, "font-bold tabular-nums", r.is_team ? "text-2xl" : "text-lg")}>{r.position}</td>
              <td className={cn(td, "font-medium", r.is_team && "text-2xl font-bold")}>{r.team_name}</td>
              {!compact && <td className={cn(td, "text-right tabular-nums text-subtle")}>{r.wins}</td>}
              <td className={cn(td, "text-right font-bold tabular-nums", r.is_team ? "text-[1.8125rem]" : "text-lg")}>{formatPoints(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
