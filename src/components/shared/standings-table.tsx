import { cn, flagEmoji, formatPoints } from "@/lib/utils";
import type { ConstructorStanding, DriverStanding } from "@/types";

/* Table styling follows the Atlassian Design System dynamic table: small bold
   subtle headers over a 2px rule, hairline row dividers, selected rows tinted. */
const th = "type-body-small border-b-2 px-2 py-1.5 font-bold text-subtle first:pl-0 last:pr-0";
const td = "px-2 py-2 first:pl-0 last:pr-0";
const num = "text-right tabular-nums";

export function DriverStandingsTable({ rows, compact = false }: { rows: DriverStanding[]; compact?: boolean }) {
  return (
    <div className="scrollbar-none overflow-x-auto">
      <table className={cn("w-full text-left text-sm", !compact && "min-w-[32rem]")}>
        <thead>
          <tr>
            <th className={cn(th, "w-10")}>Pos</th>
            <th className={th}>Driver</th>
            {!compact && <th className={th}>Team</th>}
            {!compact && <th className={cn(th, "text-right")}>Wins</th>}
            {!compact && <th className={cn(th, "text-right")}>Podiums</th>}
            <th className={cn(th, "text-right")}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={cn("border-b", r.is_team && "bg-selected")}>
              <td className={cn(td, "font-medium tabular-nums", r.is_team && "pl-2! text-selected")}>{r.position}</td>
              <td className={td}>
                <span className="mr-2" aria-hidden>{flagEmoji(r.country_code)}</span>
                <span className={cn("font-medium", r.is_team && "text-selected")}>{r.driver_name}</span>
                {compact && <span className="type-body-small block text-subtlest">{r.team_name}</span>}
              </td>
              {!compact && <td className={cn(td, "text-subtle")}>{r.team_name}</td>}
              {!compact && <td className={cn(td, num)}>{r.wins}</td>}
              {!compact && <td className={cn(td, num)}>{r.podiums}</td>}
              <td className={cn(td, num, "font-bold", r.is_team && "pr-2!")}>{formatPoints(r.points)}</td>
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
    <div className="scrollbar-none overflow-x-auto">
      <table className={cn("w-full text-left text-sm", !compact && "min-w-[26rem]")}>
        <thead>
          <tr>
            <th className={cn(th, "w-10")}>Pos</th>
            <th className={th}>Team</th>
            {!compact && <th className={cn(th, "text-right")}>Wins</th>}
            <th className={cn(th, "text-right")}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={cn("border-b", r.is_team && "bg-selected")}>
              <td className={cn(td, "font-medium tabular-nums", r.is_team && "pl-2! text-selected")}>{r.position}</td>
              <td className={td}>
                <span className={cn("font-medium", r.is_team && "text-selected")}>{r.team_name}</span>
                {/* Progress bar: share of the leader's points */}
                <div className="mt-1.5 h-1.5 w-full max-w-48 overflow-hidden rounded-full bg-neutral" aria-hidden>
                  <div className={cn("h-full rounded-full", r.is_team ? "bg-selected-bold" : "bg-neutral-bold")} style={{ width: `${Math.max(4, (r.points / max) * 100)}%` }} />
                </div>
              </td>
              {!compact && <td className={cn(td, num)}>{r.wins}</td>}
              <td className={cn(td, num, "font-bold", r.is_team && "pr-2!")}>{formatPoints(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
