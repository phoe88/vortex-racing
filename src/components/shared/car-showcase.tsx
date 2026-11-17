import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Car, Driver } from "@/types";

/** Splits "VR-26" into ["VR", "26"] so the number can be set in red. */
export function splitCarName(name: string): [string, string] {
  const m = name.match(/^([A-Za-z]+)[-\s]?(\d+)$/);
  return m ? [m[1], m[2]] : [name, ""];
}

/** The car's name set enormous: letters in white, number in red. */
export function CarName({ name, as: Tag = "p", className }: { name: string; as?: "h1" | "h2" | "p"; className?: string }) {
  const [letters, digits] = splitCarName(name);
  return (
    <Tag className={cn("type-mega select-none", className)} aria-label={name}>
      <span aria-hidden>{letters}</span>
      <span aria-hidden className="text-red">{digits}</span>
    </Tag>
  );
}

/**
 * Car feature block: the giant name with the car photo rising out of it, and a
 * panel with drivers, wins and podiums beside it.
 */
export function CarShowcase({ car, drivers = [], priority = false }: { car: Car; drivers?: Driver[]; priority?: boolean }) {
  const stat = (label: string) => car.achievements.find((a) => a.label.toLowerCase() === label)?.value;
  const wins = stat("wins");
  const podiums = stat("podiums");
  const raceDrivers = car.is_current ? drivers.filter((d) => d.role === "race") : [];

  return (
    <div className="grid items-end gap-10 lg:grid-cols-[1fr_18rem] lg:gap-16">
      <div className="relative">
        <CarName name={car.name} className="[mask-image:linear-gradient(to_bottom,black_50%,transparent_92%)]" />
        <div className="relative -mt-[12vw] aspect-[16/8] overflow-hidden rounded-xl [mask-image:linear-gradient(to_bottom,transparent,black_28%)] lg:-mt-40">
          {car.image_url && <Image src={car.image_url} alt={car.name} fill priority={priority} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />}
        </div>
      </div>
      <div className="pb-4">
        {raceDrivers.length > 0 && (
          <div className="border-b pb-5">
            <p className="type-body-large text-subtle">Drivers</p>
            {raceDrivers.map((d) => <p key={d.id} className="type-metric-small">{d.first_name} {d.last_name}</p>)}
          </div>
        )}
        {!car.is_current && car.tagline && <p className="type-body-large border-b pb-5 text-subtle">{car.tagline}</p>}
        {(wins || podiums) && (
          <dl className="grid grid-cols-2 divide-x py-5">
            {wins && <div className="pr-5"><dt className="type-body-large text-subtle">Wins</dt><dd className="type-metric-medium">{wins}</dd></div>}
            {podiums && <div className="pl-5"><dt className="type-body-large text-subtle">Podiums</dt><dd className="type-metric-medium">{podiums}</dd></div>}
          </dl>
        )}
        <ButtonLink href={`/cars/${car.slug}`} appearance="primary" spacing="large" className="mt-2">More Details</ButtonLink>
      </div>
    </div>
  );
}
