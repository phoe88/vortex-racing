import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCars } from "@/features/cars/queries";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cars",
  description: `Technical specifications and history of every ${siteConfig.name} race car.`,
  alternates: { canonical: "/cars" },
};

export default async function CarsPage() {
  const cars = await getCars();
  const [current, ...previous] = cars;

  return (
    <>
      <PageHero eyebrow="Engineering" title="The cars" description="From the first chassis to this season's challenger. Every car, every number." />
      {current && (
        <section className="container-x -mt-2 mb-12">
          <Link href={`/cars/${current.slug}`} className="group relative block overflow-hidden rounded-2xl bg-navy-2">
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              {current.image_url && <Image src={current.image_url} alt={current.name} fill priority sizes="100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />}
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10">
              <div>
                <Badge tone="accent">Season {current.season}</Badge>
                <h2 className="display mt-3 text-6xl sm:text-8xl">{current.name}</h2>
                <p className="mt-2 max-w-md text-ice/80">{current.tagline}</p>
              </div>
              <span className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ice px-6 font-display text-sm font-semibold uppercase tracking-[0.12em] text-night">Tech specs <ArrowRight className="size-4" /></span>
            </div>
          </Link>
        </section>
      )}
      <section className="container-x pb-8">
        <p className="eyebrow mb-6">Previous seasons</p>
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previous.map((c) => (
            <StaggerItem key={c.id}>
              <Link href={`/cars/${c.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-2">
                  {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />}
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="display text-4xl group-hover:text-accent-2">{c.name}</h3>
                  <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">{c.season}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{c.tagline}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
