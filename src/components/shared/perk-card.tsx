import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Perk } from "@/features/paddock/content";
import { cn } from "@/lib/utils";

/** Photo tile linking to a Paddock Pass benefit page. */
export function PerkCard({ perk, number, className }: { perk: Perk; number?: number; className?: string }) {
  return (
    <Link href={`/paddock/${perk.slug}`} className={cn("group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-navy-raised p-6", className)}>
      <Image src={perk.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw" className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="media-scrim absolute inset-0 -z-10" />
      {number !== undefined && (
        <span className="absolute left-6 top-5 text-[2.5rem] font-extrabold leading-none tabular-nums drop-shadow-[0_2px_12px_rgb(0_0_0/0.45)]" aria-hidden>
          {String(number).padStart(2, "0")}
        </span>
      )}
      <h3 className="type-heading-large">{perk.title}</h3>
      <p className="type-body-small mt-2 text-subtle">{perk.summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-medium">
        Find out more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
