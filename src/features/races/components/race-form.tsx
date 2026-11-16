import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { saveRace } from "@/actions/races";
import { siteConfig } from "@/config/site";
import type { Race } from "@/types";

const sections: FormSection[] = [
  {
    title: "Event",
    fields: [
      { name: "name", label: "Race name", required: true, placeholder: "Monaco Grand Prix" },
      { name: "official_name", label: "Official name" },
      { name: "season", label: "Season", type: "number", required: true },
      { name: "round", label: "Round", type: "number", required: true },
      { name: "slug", label: "Slug", hint: "Leave blank to generate from name + season." },
      { name: "status", label: "Status", type: "select", options: [{ value: "upcoming", label: "Upcoming" }, { value: "live", label: "Live" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }] },
    ],
  },
  {
    title: "Location & circuit",
    fields: [
      { name: "country", label: "Country", required: true },
      { name: "country_code", label: "Country code", hint: "ISO 2-letter" },
      { name: "city", label: "City" },
      { name: "circuit_name", label: "Circuit", required: true },
      { name: "circuit_length_km", label: "Lap length (km)", type: "number", step: "0.001" },
      { name: "laps", label: "Laps", type: "number" },
      { name: "lap_record", label: "Lap record", placeholder: "1:12.909" },
      { name: "timezone", label: "Time zone (IANA)", placeholder: "Europe/Monaco" },
      { name: "circuit_image_url", label: "Circuit image", type: "image", folder: "races" },
      { name: "hero_image_url", label: "Hero image", type: "image", folder: "races" },
    ],
  },
  {
    title: "Schedule",
    fields: [
      { name: "race_start", label: "Race start (UTC)", type: "datetime", required: true },
      { name: "sessions", label: "Sessions (JSON)", type: "json", hint: 'Array of { "name": "Qualifying", "starts_at": "2026-06-06T14:00:00Z" } in UTC.' },
      { name: "summary", label: "Race summary / report", type: "markdown", rows: 8 },
    ],
  },
];

export function RaceForm({ race }: { race?: Race | null }) {
  return (
    <EntityForm
      action={saveRace.bind(null, race?.id ?? null)}
      sections={sections}
      initial={race ?? { season: siteConfig.season, status: "upcoming", timezone: "UTC", sessions: [] }}
      cancelHref="/admin/races"
      submitLabel={race ? "Save changes" : "Create race"}
    />
  );
}
