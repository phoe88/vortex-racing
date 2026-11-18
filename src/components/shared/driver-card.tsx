import Image from "next/image";
import Link from "next/link";
import type { LozengeAppearance } from "@/components/ui/lozenge";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Driver } from "@/types";

export const DRIVER_ROLE: Record<Driver["role"], { label: string; appearance: LozengeAppearance }> = {
  race: { label: "Race driver", appearance: "accent-red" },
  reserve: { label: "Reserve driver", appearance: "discovery" },
  academy: { label: "Academy", appearance: "neutral" },
};

/** Career highlights shown on a driver card, biggest achievements first. */
export function driverHighlights(d: Driver): [string, string][] {
  const out: [string, string][] = [];
  if (d.championships > 0) out.push([`${d.championships}x`, "World Champion"]);
  if (d.career_wins > 0) out.push([`${d.career_wins}x`, "Grand Prix Winner"]);
  if (d.career_podiums > 0) out.push([`${d.career_podiums}x`, "Podium Finishes"]);
  if (out.length < 2 && d.career_starts > 0) out.push([`${d.career_starts}x`, "Grand Prix Starts"]);
  return out.slice(0, 3);
}

/**
 * Driver card in team-livery style: a dark navy frame with a racing-blue edge,
 * the portrait fading into navy and blue, red-and-blue speed lines behind the
 * red race number, an aerodynamic curve under the name and a red, white and
 * blue livery stripe above the footer. `tilt` angles the card slightly, the way
 * the home page line-up is presented.
 */
export function DriverCard({
  driver,
  className,
  priority = false,
  tilt = "none",
}: {
  driver: Driver;
  className?: string;
  priority?: boolean;
  tilt?: "left" | "right" | "none";
}) {
  const highlights = driverHighlights(driver);
  const photo = driver.card_image_url ?? driver.image_url;
  const aeroId = `aero-${driver.slug}`;
  return (
    <Link
      href={`/team/${driver.slug}`}
      className={cn(
        "group block rounded-2xl bg-gradient-to-b from-navy-raised via-navy to-navy-deep p-2.5 shadow-raised ring-1 ring-racing-blue/35 transition-[transform,box-shadow] duration-500 ease-out hover:rotate-0 hover:ring-racing-blue/70",
        tilt === "left" && "md:-rotate-3",
        tilt === "right" && "md:rotate-2",
        className,
      )}
    >
      <div className="relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-navy-deep p-5">
        {photo && (
          <Image
            src={photo}
            alt={`${driver.first_name} ${driver.last_name}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 90vw"
            className="-z-20 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="livery-scrim absolute inset-0 -z-10" />

        {/* Aerodynamic curve under the name: a blue sidepod sweep edged in red */}
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 w-full" aria-hidden>
          <defs>
            <linearGradient id={aeroId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--racing-blue)", stopOpacity: 0.55 }} />
              <stop offset="1" style={{ stopColor: "var(--racing-blue-deep)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d="M0 46 C 80 24, 170 64, 300 28 L300 120 L0 120 Z" fill={`url(#${aeroId})`} />
          <path d="M0 46 C 80 24, 170 64, 300 28" fill="none" style={{ stroke: "var(--red)" }} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Speed lines behind the number */}
        <div className="speed-lines pointer-events-none absolute left-0 top-0 h-32 w-44 opacity-60" aria-hidden />
        {driver.number != null && (
          <span className="absolute left-4 top-3 text-7xl font-extrabold italic leading-none text-red [text-shadow:4px_4px_0_var(--racing-blue)]">
            {driver.number}
          </span>
        )}
        <span className="absolute right-4 top-4 inline-flex h-7 items-center rounded-full bg-navy-deep/80 px-3 text-xs font-semibold text-white ring-1 ring-racing-blue/60 backdrop-blur-sm">
          {DRIVER_ROLE[driver.role].label}
        </span>

        {/* Name above the career highlights on every card, whatever the name length */}
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-[2rem] font-extrabold leading-[1.05] text-white">
            <span className="block">{driver.first_name}</span>
            {driver.last_name}
          </h3>
          {highlights.length > 0 && (
            <ul className="text-right text-lg leading-snug text-white">
              {highlights.map(([n, label]) => (
                <li key={label}><span className="font-extrabold text-red">{n}</span> <span className="font-bold">{label}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="livery-stripe mx-2 mt-3 h-1 rounded-full" aria-hidden />
      <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
        <span className="font-bold text-white">{driver.first_name} {driver.last_name}</span>
        <span className={buttonClass({ appearance: "primary", spacing: "compact", className: "bg-racing-blue! hover:bg-racing-blue-hover! active:bg-racing-blue-deep!" })}>View Profile</span>
      </div>
    </Link>
  );
}
