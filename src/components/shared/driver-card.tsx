import Image from "next/image";
import Link from "next/link";
import { Lozenge, type LozengeAppearance } from "@/components/ui/lozenge";
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
 * Driver card: a portrait in a translucent frame with the name set large over
 * the photo and career highlights beside it. `tilt` angles the card slightly,
 * the way the home page line-up is presented.
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
  return (
    <Link
      href={`/team/${driver.slug}`}
      className={cn(
        "group block rounded-2xl bg-white/10 p-2.5 backdrop-blur-sm transition-transform duration-500 ease-out hover:rotate-0",
        tilt === "left" && "md:-rotate-3",
        tilt === "right" && "md:rotate-2",
        className,
      )}
    >
      <div className="relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-navy-raised p-5">
        {(driver.card_image_url ?? driver.image_url) && (
          <Image
            src={(driver.card_image_url ?? driver.image_url)!}
            alt={`${driver.first_name} ${driver.last_name}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 90vw"
            className="-z-20 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="media-scrim absolute inset-0 -z-10" />
        {driver.number != null && (
          <span className="absolute left-4 top-3 text-7xl font-extrabold italic leading-none text-red drop-shadow-lg">{driver.number}</span>
        )}
        <Lozenge appearance={DRIVER_ROLE[driver.role].appearance} className="absolute right-4 top-4">{DRIVER_ROLE[driver.role].label}</Lozenge>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h3 className="text-[2rem] font-extrabold leading-[1.05]">
            <span className="block">{driver.first_name}</span>
            {driver.last_name}
          </h3>
          {highlights.length > 0 && (
            <ul className="text-right text-lg leading-snug">
              {highlights.map(([n, label]) => (
                <li key={label}>{n} <span className="font-bold">{label}</span></li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
        <span className="font-bold">{driver.first_name} {driver.last_name}</span>
        <span className={buttonClass({ spacing: "compact" })}>View Profile</span>
      </div>
    </Link>
  );
}
