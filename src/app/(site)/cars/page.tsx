import type { Metadata } from "next";
import { getCars } from "@/features/cars/queries";
import { getDrivers } from "@/features/drivers/queries";
import { CarShowcase } from "@/components/shared/car-showcase";
import { PageHero } from "@/components/shared/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cars",
  description: `Technical specifications and history of every ${siteConfig.name} race car.`,
  alternates: { canonical: "/cars" },
};

export default async function CarsPage() {
  const [cars, drivers] = await Promise.all([getCars(), getDrivers()]);
  return (
    <>
      <PageHero title="Our Cars" description="From the first chassis to this season's challenger. Every car, every number." />
      <div className="container-x space-y-28 sm:space-y-40">
        {cars.map((car, i) => (
          <Reveal key={car.id}>
            <p className="type-heading-xxsmall mb-2 text-subtle">Season {car.season}</p>
            <CarShowcase car={car} drivers={drivers} priority={i === 0} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
