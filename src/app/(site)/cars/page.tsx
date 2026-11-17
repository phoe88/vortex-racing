import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCars } from "@/features/cars/queries";
import { PageHero } from "@/components/shared/page-hero";
import { buttonClass } from "@/components/ui/button";
import { Lozenge } from "@/components/ui/lozenge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { darkSubtree } from "@/lib/theme";
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
        <section className="container-x mb-8">
          <Link
            href={`/cars/${current.slug}`}
            {...darkSubtree}
            className="group relative isolate flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-xl bg-surface-sunken p-4 text-default sm:aspect-[21/9] sm:p-8"
          >
            {current.image_url && <Image src={current.image_url} alt={current.name} fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover" />}
            <div className="media-scrim-soft absolute inset-0 -z-10" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Lozenge appearance="information">Season {current.season}</Lozenge>
                <h2 className="type-heading-xxlarge mt-2 group-hover:underline">{current.name}</h2>
                <p className="mt-1 max-w-md text-sm text-subtle">{current.tagline}</p>
              </div>
              <span className={buttonClass({ appearance: "primary" })}>Tech specs <ArrowRight className="size-4" aria-hidden /></span>
            </div>
          </Link>
        </section>
      )}
      {previous.length > 0 && (
        <section className="container-x pt-4">
          <SectionHeading title="Previous seasons" />
          <Stagger className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {previous.map((c) => (
              <StaggerItem key={c.id}>
                <Link href={`/cars/${c.slug}`} className="group block rounded-lg">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral">
                    {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-(--ds-duration-xlong) ease-in-out group-hover:scale-[1.02]" />}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <h3 className="type-heading-medium group-hover:underline">{c.name}</h3>
                    <Lozenge>Season {c.season}</Lozenge>
                  </div>
                  <p className="mt-1 text-sm text-subtle">{c.tagline}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
    </>
  );
}
