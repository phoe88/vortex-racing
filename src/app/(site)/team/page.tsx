import type { Metadata } from "next";
import { getDrivers } from "@/features/drivers/queries";
import { getTeamAbout, getTeamMembers } from "@/features/team/queries";
import { DriverCard } from "@/components/shared/driver-card";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
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
  const reserve = drivers.filter((d) => d.role === "reserve");
  const academy = drivers.filter((d) => d.role === "academy");

  return (
    <>
      <PageHero eyebrow="The team" title={about.heading} description={about.body} image={unsplash(IMG.garageCrew, 2000)} size="lg">
        <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {about.stats.map((s) => (
            <div key={s.label}>
              <dt className="eyebrow">{s.label}</dt>
              <dd className="display mt-1 text-3xl sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="container-x py-16">
        <SectionHeading eyebrow={`${siteConfig.season} line-up`} title="Race drivers" />
        <div className="grid gap-5 sm:grid-cols-2">
          {race.map((d, i) => <DriverCard key={d.id} driver={d} priority={i < 2} className="sm:aspect-[4/5]" />)}
        </div>
      </section>

      {(reserve.length > 0 || academy.length > 0) && (
        <section className="container-x py-8">
          <SectionHeading eyebrow="Development" title="Reserve & Academy" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[...reserve, ...academy].map((d) => <DriverCard key={d.id} driver={d} />)}
          </div>
        </section>
      )}

      <section className="container-x py-20">
        <SectionHeading eyebrow="Leadership" title="The people behind the car" />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <StaggerItem key={m.id} className="card p-6">
              <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-accent-soft font-display text-xl font-bold text-accent-2">
                {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-display text-2xl font-bold uppercase leading-none">{m.name}</h3>
              <p className="mt-1 text-sm font-semibold text-accent-2">{m.role_title}</p>
              <p className="mt-3 text-sm text-muted">{m.bio}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="container-x pb-8">
        <div className="card grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-3">
          {[
            ["Base", siteConfig.base],
            ["Team Principal", siteConfig.teamPrincipal],
            ["Founded", String(siteConfig.foundedYear)],
          ].map(([k, v]) => (
            <div key={k}><p className="eyebrow">{k}</p><p className="display mt-2 text-3xl">{v}</p></div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
