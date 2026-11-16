import { adminList } from "@/features/admin/queries";
import { AdminPageHeader } from "@/features/admin/components/page-header";
import { RowsEditor } from "@/features/admin/components/rows-editor";
import { saveStandings } from "@/actions/standings";
import { siteConfig } from "@/config/site";

export const metadata = { title: "Standings" };

export default async function AdminStandings() {
  const season = siteConfig.season;
  const [drivers, constructors] = await Promise.all([
    adminList("driver_standings", { orderBy: "position", ascending: true }),
    adminList("constructor_standings", { orderBy: "position", ascending: true }),
  ]);
  return (
    <>
      <AdminPageHeader title={`${season} standings`} description="Championship tables shown on the home page and /standings. Tick “Team” to highlight your own entries." />
      <div className="space-y-8">
        <RowsEditor
          action={saveStandings}
          hidden={{ season: String(season), kind: "drivers" }}
          title="Drivers' championship"
          columns={[
            { key: "position", label: "Pos", type: "number", width: "w-16" },
            { key: "driver_name", label: "Driver" },
            { key: "team_name", label: "Team" },
            { key: "country_code", label: "CC", width: "w-16" },
            { key: "points", label: "Pts", type: "number", step: "0.5", width: "w-20" },
            { key: "wins", label: "Wins", type: "number", width: "w-16" },
            { key: "podiums", label: "Podiums", type: "number", width: "w-20" },
            { key: "is_team", label: "Team", type: "checkbox", width: "w-14" },
          ]}
          initialRows={drivers.filter((d) => d.season === season).map((d) => ({
            position: d.position, driver_name: d.driver_name, team_name: d.team_name, country_code: d.country_code,
            points: d.points, wins: d.wins, podiums: d.podiums, is_team: d.is_team, driver_id: d.driver_id,
          }))}
          emptyRow={{ position: null, driver_name: "", team_name: "", country_code: "", points: 0, wins: 0, podiums: 0, is_team: false, driver_id: null }}
        />
        <RowsEditor
          action={saveStandings}
          hidden={{ season: String(season), kind: "constructors" }}
          title="Constructors' championship"
          columns={[
            { key: "position", label: "Pos", type: "number", width: "w-16" },
            { key: "team_name", label: "Team" },
            { key: "points", label: "Pts", type: "number", step: "0.5", width: "w-20" },
            { key: "wins", label: "Wins", type: "number", width: "w-16" },
            { key: "is_team", label: "Team", type: "checkbox", width: "w-14" },
          ]}
          initialRows={constructors.filter((c) => c.season === season).map((c) => ({
            position: c.position, team_name: c.team_name, points: c.points, wins: c.wins, is_team: c.is_team,
          }))}
          emptyRow={{ position: null, team_name: "", points: 0, wins: 0, is_team: false }}
        />
      </div>
    </>
  );
}
