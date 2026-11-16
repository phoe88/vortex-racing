import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { flagEmoji, cn } from "@/lib/utils";
import type { Driver } from "@/types";

const ROLE_LABEL = { race: "Race driver", reserve: "Reserve driver", academy: "Academy" } as const;

export function DriverCard({ driver, className, priority = false }: { driver: Driver; className?: string; priority?: boolean }) {
  return (
    <Link
      href={`/team/${driver.slug}`}
      className={cn("group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-navy-2", className)}
    >
      {driver.image_url && (
        <Image
          src={driver.image_url}
          alt={`${driver.first_name} ${driver.last_name}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.05]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
      {driver.number != null && (
        <span className="absolute right-4 top-2 font-display text-7xl font-extrabold italic leading-none text-white/15 transition group-hover:text-accent/60 sm:text-8xl">
          {driver.number}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="eyebrow mb-2 text-accent-2">
          {flagEmoji(driver.country_code)} {ROLE_LABEL[driver.role]}
        </p>
        <h3 className="display text-3xl">
          <span className="block font-medium text-ice/80">{driver.first_name}</span>
          {driver.last_name}
        </h3>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ice/80 transition group-hover:text-accent-2">
          Profile <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
