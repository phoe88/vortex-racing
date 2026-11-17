import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { saveDriver } from "@/actions/drivers";
import type { Driver } from "@/types";

const sections: FormSection[] = [
  {
    title: "Identity",
    fields: [
      { name: "first_name", label: "First name", required: true },
      { name: "last_name", label: "Last name", required: true },
      { name: "number", label: "Race number", type: "number" },
      { name: "role", label: "Role", type: "select", options: [{ value: "race", label: "Race driver" }, { value: "reserve", label: "Reserve driver" }, { value: "academy", label: "Academy" }] },
      { name: "nationality", label: "Nationality" },
      { name: "country_code", label: "Country code", hint: "ISO 2-letter, e.g. GB" },
      { name: "slug", label: "Slug", hint: "Leave blank to generate from the name." },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "tagline", label: "Tagline", span: 2 },
      { name: "bio", label: "Biography", type: "markdown", rows: 10, hint: "Plain paragraphs separated by a blank line." },
    ],
  },
  {
    title: "Images & social",
    fields: [
      { name: "image_url", label: "Portrait (3:4)", type: "image", folder: "drivers", hint: "Used for the profile avatar." },
      { name: "card_image_url", label: "Card photo (3:4)", type: "image", folder: "drivers", hint: "Shown on driver cards. Leave empty to use the portrait." },
      { name: "hero_image_url", label: "Profile hero (wide)", type: "image", folder: "drivers" },
      { name: "helmet_image_url", label: "Helmet", type: "image", folder: "drivers" },
      { name: "instagram_url", label: "Instagram URL", type: "url" },
      { name: "x_url", label: "X URL", type: "url" },
    ],
  },
  {
    title: "Personal",
    fields: [
      { name: "date_of_birth", label: "Date of birth", type: "date" },
      { name: "place_of_birth", label: "Place of birth" },
    ],
  },
  {
    title: "Career statistics",
    fields: [
      { name: "career_starts", label: "Grands Prix", type: "number" },
      { name: "career_wins", label: "Wins", type: "number" },
      { name: "career_podiums", label: "Podiums", type: "number" },
      { name: "career_poles", label: "Pole positions", type: "number" },
      { name: "career_points", label: "Career points", type: "number", step: "0.5" },
      { name: "championships", label: "World championships", type: "number" },
      { name: "is_active", label: "Active (shown on the website)", type: "checkbox" },
    ],
  },
];

export function DriverForm({ driver }: { driver?: Driver | null }) {
  return (
    <EntityForm
      action={saveDriver.bind(null, driver?.id ?? null)}
      sections={sections}
      initial={driver ?? { role: "race", is_active: true, sort_order: 0, career_starts: 0, career_wins: 0, career_podiums: 0, career_poles: 0, career_points: 0, championships: 0 }}
      cancelHref="/admin/drivers"
      submitLabel={driver ? "Save changes" : "Create driver"}
    />
  );
}
