import { EntityForm, type FormSection } from "@/features/admin/components/entity-form";
import { saveTeamMember } from "@/actions/drivers";
import { saveTeamAbout } from "@/actions/settings";
import type { TeamMemberRow } from "@/types";
import type { TeamAbout } from "@/features/team/queries";

const memberSections: FormSection[] = [
  {
    title: "Team member",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "role_title", label: "Job title", required: true },
      { name: "bio", label: "Short bio", type: "textarea", rows: 4 },
      { name: "image_url", label: "Photo", type: "image", folder: "team" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "is_active", label: "Shown on the website", type: "checkbox" },
    ],
  },
];

export function TeamMemberForm({ member }: { member?: TeamMemberRow | null }) {
  return (
    <EntityForm
      action={saveTeamMember.bind(null, member?.id ?? null)}
      sections={memberSections}
      initial={member ?? { is_active: true, sort_order: 0 }}
      cancelHref="/admin/team"
      submitLabel={member ? "Save changes" : "Add team member"}
    />
  );
}

const aboutSections: FormSection[] = [
  {
    title: "Team page intro",
    description: "Shown at the top of /team.",
    fields: [
      { name: "heading", label: "Heading", required: true, span: 2 },
      { name: "body", label: "Intro paragraph", type: "textarea", rows: 4 },
      { name: "stats", label: "Key facts (JSON)", type: "json", hint: 'Array of { "label": "...", "value": "..." }.' },
    ],
  },
];

export function TeamAboutForm({ about }: { about: TeamAbout }) {
  return <EntityForm action={saveTeamAbout} sections={aboutSections} initial={about as unknown as Record<string, unknown>} submitLabel="Save intro" />;
}
