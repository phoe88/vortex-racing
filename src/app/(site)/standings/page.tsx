import type { Metadata } from "next";
import { getConstructorStandings, getDriverStandings } from "@/features/standings/queries";
import { getRaces } from "@/features/races/queries";
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
    <div className="container-x space-y-24 pt-36 sm:space-y-32 sm:pt-44">
      <section className="grid gap-10 lg:grid-cols-[22rem_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="type-heading-xxsmall mb-3 text-subtle">{siteConfig.season} {siteConfig.championshipName}</p>
          <h1 className="type-display">Driver Standings</h1>
          <p className="mt-4 text-subtle">After {done} of {races.length} rounds.</p>
        </div>
        <Reveal className="min-w-0"><DriverStandingsTable rows={drivers} /></Reveal>
      </section>
      <section className="grid gap-10 lg:grid-cols-[22rem_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="type-display">Team Standings</h2>
        </div>
        <Reveal className="min-w-0"><ConstructorStandingsTable rows={constructors} /></Reveal>
      </section>
    </div>
  );
}
