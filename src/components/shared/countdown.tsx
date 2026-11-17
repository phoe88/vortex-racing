"use client";
import { useSyncExternalStore } from "react";
import { Lozenge } from "@/components/ui/lozenge";

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
    ["Days", p?.days], ["Hours", p?.hours], ["Minutes", p?.minutes], ["Seconds", p?.seconds],
  ] as const;

  if (diff !== null && diff <= 0) {
    return (
      <p className={className}>
        <Lozenge appearance="success">Lights out</Lozenge>
      </p>
    );
  }

  return (
    <div className={className} role="timer" aria-live="off" aria-label="Countdown to race start">
      <div className="grid grid-cols-4 gap-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-surface-raised px-2 py-3 text-center">
            <div className="type-metric-medium tabular-nums">
              {value === undefined || value === null ? "--" : String(value).padStart(2, "0")}
            </div>
            <div className="type-body-small mt-1 text-subtle">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
