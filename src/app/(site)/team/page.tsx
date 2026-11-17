import type { Metadata } from "next";
import Image from "next/image";
import { getDrivers } from "@/features/drivers/queries";
import { getTeamAbout, getTeamMembers } from "@/features/team/queries";
import { DriverCard } from "@/components/shared/driver-card";
import { PageHero } from "@/components/shared/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { unsplash, IMG } from "@/lib/seed/images";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Team",
  description: `Meet the ${siteConfig.name} drivers, reserve and academy line-up and the people who run the team.`,
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  const [drivers, members, about] = await Promise.all([getDrivers(), getTeamMembers(), getTeamAbout()]);
  const race = drivers.filter((d) => d.role === "race");
  const development = drivers.filter((d) => d.role !== "race");

  return (
    <>
      <PageHero title="The Team" image={unsplash(IMG.garageCrew, 2400)} size="lg" />

      {/* Intro statement */}
      <section className="container-x mt-20 grid gap-10 lg:grid-cols-[12rem_1fr]">
        <p className="type-heading-xxsmall text-subtle lg:pt-2">{siteConfig.season} season</p>
        <div>
          <p className="type-heading-large max-w-3xl">{about.heading} {about.body}</p>
          <dl className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {about.stats.map((s) => (
              <div key={s.label} className="border-t pt-4">
                <dt className="text-subtle">{s.label}</dt>
                <dd className="type-metric-medium mt-1">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x mt-24 sm:mt-32">
        <h2 className="type-heading-xlarge">Our Drivers</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {race.map((d, i) => <Reveal key={d.id} delay={i * 0.1}><DriverCard driver={d} priority={i < 2} /></Reveal>)}
        </div>
      </section>

      {development.length > 0 && (
        <section className="container-x mt-24">
          <h2 className="type-heading-xlarge">Reserve & Academy</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {development.map((d) => <DriverCard key={d.id} driver={d} />)}
          </div>
        </section>
      )}

      {/* Leadership on a red band */}
      {members.length > 0 && (
        <div className="mt-24 bg-red py-20 sm:mt-32 sm:py-28">
          <Carousel title="Leadership" itemClassName="w-[78vw] sm:w-[24rem]">
            {members.map((m) => (
              <article key={m.id} className="h-full">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-bold-pressed">
                  {m.image_url ? (
                    <Image src={m.image_url} alt={m.name} fill sizes="24rem" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-8xl font-extrabold text-white/30" aria-hidden>
                      {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  )}
                </div>
                <h3 className="type-heading-small mt-4">{m.name}</h3>
                <p className="font-medium text-white/80">{m.role_title}</p>
                <p className="type-body-small mt-2 text-white/80">{m.bio}</p>
              </article>
            ))}
          </Carousel>
        </div>
      )}

      <section className="container-x mt-24 text-center sm:mt-32">
        <h2 className="type-heading-xlarge">Become a Team Member</h2>
        <p className="mx-auto mt-4 max-w-xl text-subtle">Based in {siteConfig.base}, led by {siteConfig.teamPrincipal} and racing since {siteConfig.foundedYear}. We are always looking for people who want to go faster.</p>
        <ButtonLink href="/newsletter" appearance="primary" spacing="large" className="mt-8">Stay in the loop</ButtonLink>
      </section>
    </>
  );
}
