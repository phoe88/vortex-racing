import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Cog } from "lucide-react";
import { getCarBySlug, getCarSlugs, getCars } from "@/features/cars/queries";
import { Badge } from "@/components/ui/badge";
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
      <section className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40">
        {car.hero_image_url && <Image src={car.hero_image_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night/40 via-night/60 to-night" />
        <div className="container-x">
          <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-ice/80 hover:text-ice"><ArrowLeft className="size-4" /> All cars</Link>
          <div className="mt-6 text-center">
            <Badge tone={car.is_current ? "accent" : "muted"}>Season {car.season}</Badge>
            <h1 className="display mt-4 text-[6rem] leading-[0.85] sm:text-[9rem] lg:text-[12rem]">{car.name}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ice/80">{car.tagline}</p>
          </div>
          <Reveal className="relative mx-auto mt-8 aspect-[16/8] max-w-6xl overflow-hidden rounded-2xl">
            {car.image_url && <Image src={car.image_url} alt={car.name} fill priority sizes="(min-width: 1280px) 1152px, 100vw" className="object-cover" />}
          </Reveal>
          {car.achievements.length > 0 && (
            <Stagger className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
              {car.achievements.map((a) => (
                <StaggerItem key={a.label} className="card p-4 text-center">
                  <p className="display text-4xl text-accent-2">{a.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted">{a.label}</p>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="eyebrow mb-4 text-accent">Overview</p>
          <div className="prose-racing">{car.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {car.chassis && <div className="card p-4"><dt className="eyebrow">Chassis</dt><dd className="mt-1 font-semibold">{car.chassis}</dd></div>}
            {car.power_unit && <div className="card p-4"><dt className="eyebrow">Power unit</dt><dd className="mt-1 font-semibold">{car.power_unit}</dd></div>}
          </dl>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow mb-4 flex items-center gap-2 text-accent"><Cog className="size-4" /> Technical specification</p>
          <div className="space-y-6">
            {Object.entries(groups).map(([group, specs]) => (
              <div key={group} className="overflow-hidden rounded-2xl border border-line">
                <p className="bg-white/4 px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em]">{group}</p>
                <dl className="divide-y divide-line/60">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-6 px-5 py-3 text-sm">
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="font-display text-lg font-bold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {others.length > 0 && (
        <section className="container-x pb-8">
          <SectionHeading eyebrow="Garage" title="More cars" href="/cars" />
          <div className="grid gap-5 sm:grid-cols-3">
            {others.map((c) => (
              <Link key={c.id} href={`/cars/${c.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-navy-2">
                  {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="33vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />}
                </div>
                <h3 className="display mt-3 text-3xl group-hover:text-accent-2">{c.name} <span className="text-base text-muted">{c.season}</span></h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
