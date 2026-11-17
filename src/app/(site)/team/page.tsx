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
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {about.stats.map((s) => (
            <div key={s.label}>
              <dt className="type-body-small text-subtle">{s.label}</dt>
              <dd className="type-metric-large mt-0.5">{s.value}</dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="container-x py-8">
        <SectionHeading eyebrow={`${siteConfig.season} line-up`} title="Race drivers" />
        <div className="grid gap-4 sm:grid-cols-2">
          {race.map((d, i) => <DriverCard key={d.id} driver={d} priority={i < 2} className="sm:aspect-[4/5]" />)}
        </div>
      </section>

      {(reserve.length > 0 || academy.length > 0) && (
        <section className="container-x py-8">
          <SectionHeading eyebrow="Development" title="Reserve & Academy" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...reserve, ...academy].map((d) => <DriverCard key={d.id} driver={d} />)}
          </div>
        </section>
      )}

      <section className="container-x py-8">
        <SectionHeading eyebrow="Leadership" title="The people behind the car" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <StaggerItem key={m.id} className="card p-4 sm:p-6">
              <div className="flex items-center gap-3">
                {/* Avatar with initials */}
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-bold text-sm font-medium text-inverse" aria-hidden>
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0">
                  <h3 className="type-heading-small">{m.name}</h3>
                  <p className="type-body-small text-subtle">{m.role_title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-subtle">{m.bio}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="container-x pt-8">
        <dl className="card grid gap-6 p-6 sm:grid-cols-3">
          {[
            ["Base", siteConfig.base],
            ["Team Principal", siteConfig.teamPrincipal],
            ["Founded", String(siteConfig.foundedYear)],
          ].map(([k, v]) => (
            <div key={k}><dt className="type-body-small text-subtle">{k}</dt><dd className="type-heading-medium mt-0.5">{v}</dd></div>
          ))}
        </dl>
      </Reveal>
    </>
  );
}
