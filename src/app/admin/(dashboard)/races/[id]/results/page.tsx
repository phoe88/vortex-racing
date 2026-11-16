import { notFound } from "next/navigation";
import { adminGet, adminRaceResults } from "@/features/admin/queries";
import { DynamicRoute } from "@/components/shared/dynamic-route";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { RowsEditor } from "@/features/admin/components/rows-editor";
import { saveRaceResults } from "@/actions/races";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Race results" };

export default async function Page({ params }: PageProps<"/admin/races/[id]/results">) {
  const { id } = await params;
  const [race, results] = await Promise.all([adminGet("races", id), adminRaceResults(id)]);
  if (!race) notFound();
  return (
    <>
      <DynamicRoute />
      <AdminPageHeader title={`${race.name} — results`} description="Full classification. Saving replaces all rows for this race." backHref={`/admin/races/${race.id}`} />
      <RowsEditor
        action={saveRaceResults}
        hidden={{ race_id: race.id }}
        title="Classification"
        description="Use “Standard points” to apply 25-18-15-12-10-8-6-4-2-1 from the position column."
        pointsKey="points"
        columns={[
          { key: "position", label: "Pos", type: "number", width: "w-16" },
          { key: "driver_name", label: "Driver" },
          { key: "team_name", label: "Team" },
          { key: "grid", label: "Grid", type: "number", width: "w-16" },
          { key: "time_text", label: "Time / gap", width: "w-32" },
          { key: "status", label: "Status", width: "w-28" },
          { key: "points", label: "Pts", type: "number", step: "0.5", width: "w-20" },
          { key: "fastest_lap", label: "FL", type: "checkbox", width: "w-12" },
        ]}
        initialRows={results.map((r) => ({
          position: r.position, driver_name: r.driver_name, team_name: r.team_name, grid: r.grid,
          time_text: r.time_text, status: r.status, points: r.points, fastest_lap: r.fastest_lap, driver_id: r.driver_id,
        }))}
        emptyRow={{ position: null, driver_name: "", team_name: siteConfig.name, grid: null, time_text: "", status: "Finished", points: 0, fastest_lap: false, driver_id: null }}
      />
    </>
  );
}
