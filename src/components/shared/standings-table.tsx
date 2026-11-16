import { cn, flagEmoji, formatPoints } from "@/lib/utils";
import type { ConstructorStanding, DriverStanding } from "@/types";

export function DriverStandingsTable({ rows, compact = false }: { rows: DriverStanding[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.18em] text-muted">
            <th className="py-3 pr-3 font-semibold">Pos</th>
            <th className="py-3 pr-3 font-semibold">Driver</th>
            {!compact && <th className="py-3 pr-3 font-semibold">Team</th>}
            {!compact && <th className="py-3 pr-3 text-right font-semibold">Wins</th>}
            {!compact && <th className="py-3 pr-3 text-right font-semibold">Podiums</th>}
            <th className="py-3 text-right font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={cn("border-b border-line/60 transition", r.is_team && "bg-accent-soft")}>
              <td className="py-3 pr-3 font-display text-lg font-bold tabular-nums">
                {r.position}
                {r.is_team && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />}
              </td>
              <td className="py-3 pr-3">
                <span className="mr-2">{flagEmoji(r.country_code)}</span>
                <span className={cn("font-semibold", r.is_team && "text-white")}>{r.driver_name}</span>
                {compact && <span className="block text-xs text-muted">{r.team_name}</span>}
              </td>
              {!compact && <td className="py-3 pr-3 text-muted">{r.team_name}</td>}
              {!compact && <td className="py-3 pr-3 text-right tabular-nums">{r.wins}</td>}
              {!compact && <td className="py-3 pr-3 text-right tabular-nums">{r.podiums}</td>}
              <td className="py-3 text-right font-display text-lg font-bold tabular-nums">{formatPoints(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConstructorStandingsTable({ rows, compact = false }: { rows: ConstructorStanding[]; compact?: boolean }) {
  const max = rows[0]?.points || 1;
  return (
    <div className="overflow-x-auto scrollbar-none">
      <table className="w-full min-w-[26rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.18em] text-muted">
            <th className="py-3 pr-3 font-semibold">Pos</th>
            <th className="py-3 pr-3 font-semibold">Team</th>
            {!compact && <th className="py-3 pr-3 text-right font-semibold">Wins</th>}
            <th className="py-3 text-right font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={cn("border-b border-line/60", r.is_team && "bg-accent-soft")}>
              <td className="py-3 pr-3 font-display text-lg font-bold tabular-nums">{r.position}</td>
              <td className="py-3 pr-3">
                <span className={cn("font-semibold", r.is_team && "text-white")}>{r.team_name}</span>
                <div className="mt-1.5 h-1 w-full max-w-48 overflow-hidden rounded-full bg-white/8">
                  <div className={cn("h-full rounded-full", r.is_team ? "bg-accent" : "bg-white/30")} style={{ width: `${Math.max(4, (r.points / max) * 100)}%` }} />
                </div>
              </td>
              {!compact && <td className="py-3 pr-3 text-right tabular-nums">{r.wins}</td>}
              <td className="py-3 text-right font-display text-lg font-bold tabular-nums">{formatPoints(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
