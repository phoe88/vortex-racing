import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Lozenge, type LozengeAppearance } from "@/components/ui/lozenge";
import { darkSubtree } from "@/lib/theme";
import { flagEmoji, cn } from "@/lib/utils";
import type { Driver } from "@/types";

export const DRIVER_ROLE: Record<Driver["role"], { label: string; appearance: LozengeAppearance }> = {
  race: { label: "Race driver", appearance: "information" },
  reserve: { label: "Reserve driver", appearance: "discovery" },
  academy: { label: "Academy", appearance: "neutral" },
};

export function DriverCard({ driver, className, priority = false }: { driver: Driver; className?: string; priority?: boolean }) {
  const role = DRIVER_ROLE[driver.role];
  // Text sits on the portrait, so this card is always rendered in the dark theme.
  return (
    <Link
      href={`/team/${driver.slug}`}
      {...darkSubtree}
      className={cn("group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken text-default", className)}
    >
      {driver.image_url && (
        <Image
          src={driver.image_url}
          alt={`${driver.first_name} ${driver.last_name}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="-z-20 object-cover object-top transition-transform duration-(--ds-duration-xlong) ease-in-out group-hover:scale-[1.02]"
        />
      )}
      <div className="media-scrim absolute inset-0 -z-10" />
      {driver.number != null && (
        <span className="type-metric-small absolute right-3 top-3 rounded-md bg-surface-overlay px-2 py-1 tabular-nums shadow-overlay">
          #{driver.number}
        </span>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lozenge appearance={role.appearance}>{role.label}</Lozenge>
          <span aria-hidden>{flagEmoji(driver.country_code)}</span>
        </div>
        <h3 className="type-heading-large">
          <span className="type-body block text-subtle">{driver.first_name}</span>
          {driver.last_name}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-link group-hover:underline">
          View profile <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
