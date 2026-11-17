import type { Metadata } from "next";
import { getConstructorStandings, getDriverStandings } from "@/features/standings/queries";
import { getRaces } from "@/features/races/queries";
import { PageHero } from "@/components/shared/page-hero";
import { ConstructorStandingsTable, DriverStandingsTable } from "@/components/shared/standings-table";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.season} Standings`,
  description: `Drivers' and Constructors' championship standings for the ${siteConfig.season} season.`,
  alternates: { canonical: "/standings" },
};

export default async function StandingsPage() {
  const [drivers, constructors, races] = await Promise.all([getDriverStandings(), getConstructorStandings(), getRaces()]);
  const done = races.filter((r) => r.status === "completed").length;
  return (
    <>
      <PageHero eyebrow={`${siteConfig.season} ${siteConfig.championshipName}`} title="Standings" description={`After ${done} of ${races.length} rounds. Team entries highlighted.`} />
      <div className="container-x grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="card p-4 sm:p-6">
          <h2 className="type-heading-medium mb-3">Drivers&apos; championship</h2>
          <DriverStandingsTable rows={drivers} />
        </Reveal>
        <Reveal delay={0.05} className="card self-start p-4 sm:p-6">
          <h2 className="type-heading-medium mb-3">Constructors&apos; championship</h2>
          <ConstructorStandingsTable rows={constructors} />
        </Reveal>
      </div>
    </>
  );
}
