import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { savePartner } from "@/actions/partners";
import { PARTNER_TIERS, type Partner } from "@/types";

const sections: FormSection[] = [
  {
    title: "Partner",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "tier", label: "Tier", type: "select", options: PARTNER_TIERS },
      { name: "slug", label: "Slug", hint: "Leave blank to generate." },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "website_url", label: "Website", type: "url", span: 2 },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "logo_url", label: "Logo (SVG/PNG, transparent)", type: "image", folder: "partners" },
      { name: "is_active", label: "Shown on the website", type: "checkbox" },
    ],
  },
];

export function PartnerForm({ partner }: { partner?: Partner | null }) {
  return (
    <EntityForm
      action={savePartner.bind(null, partner?.id ?? null)}
      sections={sections}
      initial={partner ?? { tier: "official", is_active: true, sort_order: 0 }}
      cancelHref="/admin/partners"
      submitLabel={partner ? "Save changes" : "Add partner"}
    />
  );
}
