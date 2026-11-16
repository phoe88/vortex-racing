"use client";
import { useSyncExternalStore } from "react";

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

export function Countdown({ target, className }: { target: string; className?: string }) {
  // Ticks once per second on the client; null on the server so markup matches during hydration.
  const now = useSyncExternalStore(subscribeTick, getClientSeconds, getServerSeconds);

  const diff = now === null ? null : new Date(target).getTime() - now;
  const p = diff === null ? null : parts(diff);
  const items = [
    ["Days", p?.days], ["Hrs", p?.hours], ["Min", p?.minutes], ["Sec", p?.seconds],
  ] as const;

  if (diff !== null && diff <= 0) {
    return (
      <p className={className}>
        <span className="inline-flex items-center gap-2 font-display text-2xl font-bold uppercase text-accent-2">
          <span className="relative flex size-3"><span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent" /><span className="relative inline-flex size-3 rounded-full bg-accent" /></span>
          Lights out
        </span>
      </p>
    );
  }

  return (
    <div className={className} role="timer" aria-live="off" aria-label="Countdown to race start">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur">
            <div className="font-display text-3xl font-bold tabular-nums leading-none sm:text-4xl">
              {value === undefined || value === null ? "--" : String(value).padStart(2, "0")}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
