import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCarBySlug, getCarSlugs, getCars } from "@/features/cars/queries";
import { getDrivers } from "@/features/drivers/queries";
import { CarName, CarShowcase } from "@/components/shared/car-showcase";
import { Reveal } from "@/components/ui/reveal";

export async function generateStaticParams() {
  return (await getCarSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Car not found" };
  return { title: `${car.name} (${car.season})`, description: car.tagline || car.description.slice(0, 160), alternates: { canonical: `/cars/${car.slug}` } };
}

/** Splits a spec value such as "15,000 rpm" into a number and a unit for display. */
function splitValue(value: string): [string, string] {
  const m = value.match(/^([\d.,]+)\s*(.*)$/);
  return m ? [m[1], m[2]] : [value, ""];
}

export default async function CarPage({ params }: PageProps<"/cars/[slug]">) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();
  const [cars, drivers] = await Promise.all([getCars(), getDrivers()]);
  const others = cars.filter((c) => c.id !== car.id);
  const groups = car.specs.reduce<Record<string, typeof car.specs>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});
  const numeric = car.specs.filter((s) => /^[\d.,]+/.test(s.value));

  return (
    <>
      {/* Full-bleed photo with the name set huge */}
      <section className="relative isolate flex min-h-screen flex-col justify-end overflow-hidden pb-10 pt-40">
        {(car.hero_image_url ?? car.image_url) && <Image src={(car.hero_image_url ?? car.image_url)!} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />}
        <div className="media-scrim-soft absolute inset-0 -z-10" />
        <div className="container-x">
          <CarName name={car.name} as="h1" className="text-[clamp(5rem,18vw,14rem)]" />
        </div>
      </section>

      {/* Statement */}
      <section className="container-x mt-24 grid gap-6 lg:grid-cols-[12rem_minmax(0,46rem)] sm:mt-32">
        <p className="type-heading-xxsmall text-subtle lg:pt-2">Season {car.season}</p>
        <div>
          {car.tagline && <p className="type-heading-large">{car.tagline}</p>}
          <div className="prose-site mt-8 text-subtle">{car.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
        </div>
      </section>

      {/* Achievements set large */}
      {car.achievements.length > 0 && (
        <section className="container-x mt-24 sm:mt-32">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {car.achievements.map((a) => (
              <Reveal key={a.label}>
                <p className="type-display-xl tabular-nums">{a.value}</p>
                <p className="type-heading-small mt-2 text-subtle">{a.label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* In numbers rail */}
      {numeric.length > 0 && (
        <section className="mt-24 sm:mt-32">
          <h2 className="container-x type-heading-medium">The {car.name} in numbers</h2>
          <div className="scrollbar-none mt-6 flex gap-3 overflow-x-auto px-4 sm:px-6 lg:px-10">
            {numeric.map((s) => {
              const [n, unit] = splitValue(s.value);
              return (
                <div key={s.label} className="card shrink-0 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em]">{s.label}</p>
                  <p className="mt-2 whitespace-nowrap">
                    <span className="type-metric-large">{n}</span>
                    {unit && <span className="ml-1.5 text-lg font-bold">{unit}</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Full specification */}
      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">Technical Specification</h2>
        <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-2">
          {(car.chassis || car.power_unit) && (
            <div>
              <h3 className="type-heading-small">Overview</h3>
              <dl className="mt-4">
                {car.chassis && <div className="flex justify-between gap-6 border-t py-4"><dt className="text-subtle">Chassis</dt><dd className="text-right font-medium">{car.chassis}</dd></div>}
                {car.power_unit && <div className="flex justify-between gap-6 border-t border-b py-4"><dt className="text-subtle">Power unit</dt><dd className="text-right font-medium">{car.power_unit}</dd></div>}
              </dl>
            </div>
          )}
          {Object.entries(groups).map(([group, specs]) => (
            <div key={group}>
              <h3 className="type-heading-small">{group}</h3>
              <dl className="mt-4">
                {specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-6 border-t py-4 last:border-b">
                    <dt className="text-subtle">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="container-x mt-24 space-y-28 sm:mt-32 sm:space-y-40">
          <h2 className="type-heading-xlarge">More Cars</h2>
          {others.map((c) => <CarShowcase key={c.id} car={c} drivers={drivers} />)}
        </section>
      )}
    </>
  );
}
