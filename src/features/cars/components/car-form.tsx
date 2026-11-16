import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { saveCar } from "@/actions/cars";
import { siteConfig } from "@/config/site";
import type { Car } from "@/types";

const sections: FormSection[] = [
  {
    title: "Car",
    fields: [
      { name: "name", label: "Name", required: true, placeholder: "VR-26" },
      { name: "season", label: "Season", type: "number", required: true },
      { name: "slug", label: "Slug", hint: "Leave blank to generate from the name." },
      { name: "is_current", label: "Current season car", type: "checkbox" },
      { name: "chassis", label: "Chassis" },
      { name: "power_unit", label: "Power unit" },
      { name: "tagline", label: "Tagline", span: 2 },
      { name: "description", label: "Description", type: "markdown", rows: 8 },
    ],
  },
  {
    title: "Images",
    fields: [
      { name: "image_url", label: "Main image (16:9)", type: "image", folder: "cars" },
      { name: "hero_image_url", label: "Background hero", type: "image", folder: "cars" },
    ],
  },
  {
    title: "Specifications",
    fields: [
      { name: "specs", label: "Tech specs (JSON)", type: "json", rows: 12, hint: 'Array of { "group": "Power unit", "label": "Engine", "value": "1.6L V6 turbo hybrid" }.' },
      { name: "achievements", label: "Achievements (JSON)", type: "json", hint: 'Array of { "label": "Wins", "value": "5" }.' },
    ],
  },
];

export function CarForm({ car }: { car?: Car | null }) {
  return (
    <EntityForm
      action={saveCar.bind(null, car?.id ?? null)}
      sections={sections}
      initial={car ?? { season: siteConfig.season, specs: [], achievements: [] }}
      cancelHref="/admin/cars"
      submitLabel={car ? "Save changes" : "Create car"}
    />
  );
}
