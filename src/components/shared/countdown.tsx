"use client";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function subscribeTick(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getClientSeconds = () => Math.floor(Date.now() / 1000) * 1000;
const getServerSeconds = () => null;

/** Current time, ticking once per second on the client; null on the server so markup matches during hydration. */
function useNow() {
  return useSyncExternalStore(subscribeTick, getClientSeconds, getServerSeconds);
}

function Digits({ target, now, size = "md" }: { target: string; now: number | null; size?: "md" | "lg" }) {
  const diff = now === null ? null : new Date(target).getTime() - now;
  const p = diff === null ? null : parts(diff);
  const items = [["Days", p?.days], ["Hours", p?.hours], ["Mins", p?.minutes], ["Secs", p?.seconds]] as const;
  return (
    <div className="flex gap-5 sm:gap-7" role="timer" aria-live="off" aria-label="Countdown">
      {items.map(([label, value]) => (
        <div key={label} className="text-center">
          <div className={cn("font-bold tabular-nums leading-none", size === "lg" ? "text-5xl sm:text-6xl" : "text-[2.5rem]")}>
            {value === undefined || value === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-subtle">{label}</div>
        </div>
      ))}
    </div>
  );
}

/** Countdown to one moment, e.g. the race start. */
export function Countdown({ target, className, size }: { target: string; className?: string; size?: "md" | "lg" }) {
  const now = useNow();
  if (now !== null && new Date(target).getTime() <= now) {
    return <p className={cn("type-heading-large", className)}>Lights out</p>;
  }
  return <div className={className}><Digits target={target} now={now} size={size} /></div>;
}

/**
 * "Next:" panel for a race weekend: names the next session that hasn't started
 * and counts down to it. Falls back to the first session before hydration.
 */
export function NextSessionCountdown({ sessions, className }: { sessions: { name: string; starts_at: string }[]; className?: string }) {
  const now = useNow();
  const next = (now === null ? sessions[0] : sessions.find((s) => new Date(s.starts_at).getTime() > now)) ?? null;
  return (
    <div className={className}>
      <p className="type-heading-large">Next:</p>
      <p className="mt-2">{next ? next.name : "Race weekend complete"}</p>
      {next && <div className="mt-auto pt-8"><Digits target={next.starts_at} now={now} /></div>}
    </div>
  );
}
