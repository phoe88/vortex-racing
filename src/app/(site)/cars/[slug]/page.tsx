import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarBySlug, getCarSlugs, getCars } from "@/features/cars/queries";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Lozenge } from "@/components/ui/lozenge";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export async function generateStaticParams() {
  return (await getCarSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Car not found" };
  return { title: `${car.name} (${car.season})`, description: car.tagline || car.description.slice(0, 160), alternates: { canonical: `/cars/${car.slug}` } };
}

export default async function CarPage({ params }: PageProps<"/cars/[slug]">) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();
  const others = (await getCars()).filter((c) => c.id !== car.id).slice(0, 3);
  const groups = car.specs.reduce<Record<string, typeof car.specs>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <>
      <section className="container-x pt-4 sm:pt-6">
        <Breadcrumbs items={[{ label: "Cars", href: "/cars" }, { label: car.name }]} />
        <div className="mt-4">
          <Lozenge appearance={car.is_current ? "information" : "neutral"}>Season {car.season}</Lozenge>
          <h1 className="type-heading-xxlarge mt-2">{car.name}</h1>
          <p className="type-body-large mt-1 max-w-2xl text-subtle">{car.tagline}</p>
        </div>
        <div className="relative mt-6 aspect-[16/8] overflow-hidden rounded-xl bg-neutral">
          {car.image_url && <Image src={car.image_url} alt={car.name} fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />}
        </div>
        {car.achievements.length > 0 && (
          <Stagger className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {car.achievements.map((a) => (
              <StaggerItem key={a.label} className="card p-4">
                <p className="type-body-small text-subtle">{a.label}</p>
                <p className="type-metric-large mt-0.5 tabular-nums">{a.value}</p>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>

      <section className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <h2 className="type-heading-large mb-3">Overview</h2>
          <div className="prose-ads">{car.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
          {(car.chassis || car.power_unit) && (
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {car.chassis && <div className="card p-4"><dt className="type-body-small text-subtle">Chassis</dt><dd className="mt-0.5 text-sm font-medium">{car.chassis}</dd></div>}
              {car.power_unit && <div className="card p-4"><dt className="type-body-small text-subtle">Power unit</dt><dd className="mt-0.5 text-sm font-medium">{car.power_unit}</dd></div>}
            </dl>
          )}
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="type-heading-large mb-3">Technical specification</h2>
          <div className="space-y-4">
            {Object.entries(groups).map(([group, specs]) => (
              <div key={group} className="card overflow-hidden">
                <h3 className="type-heading-xsmall border-b bg-surface-sunken px-4 py-2">{group}</h3>
                <dl className="divide-y">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-6 px-4 py-2 text-sm">
                      <dt className="text-subtle">{s.label}</dt>
                      <dd className="text-right font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {others.length > 0 && (
        <section className="container-x pt-4">
          <SectionHeading eyebrow="Garage" title="More cars" href="/cars" />
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
            {others.map((c) => (
              <Link key={c.id} href={`/cars/${c.slug}`} className="group block rounded-lg">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-neutral">
                  {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="33vw" className="object-cover transition-transform duration-(--ds-duration-xlong) ease-in-out group-hover:scale-[1.02]" />}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <h3 className="type-heading-medium group-hover:underline">{c.name}</h3>
                  <Lozenge>Season {c.season}</Lozenge>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
