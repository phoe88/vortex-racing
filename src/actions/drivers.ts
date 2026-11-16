"use server";
import { deleteRow, saveRow } from "@/features/admin/crud";
import { driverSchema, teamMemberSchema } from "@/features/drivers/schema";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function saveDriver(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "drivers",
    schema: driverSchema,
    formData,
    id,
    tags: (row) => [TAGS.drivers, TAGS.driver(row.slug), TAGS.standings],
    redirectTo: () => "/admin/drivers?saved=1",
  });
}

export async function deleteDriver(id: string, slug: string): Promise<ActionState> {
  return deleteRow({ table: "drivers", id, tags: [TAGS.drivers, TAGS.driver(slug)] });
}

export async function saveTeamMember(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "team_members",
    schema: teamMemberSchema,
    formData,
    id,
    tags: [TAGS.team],
    redirectTo: () => "/admin/team?saved=1",
  });
}

export async function deleteTeamMember(id: string): Promise<ActionState> {
  return deleteRow({ table: "team_members", id, tags: [TAGS.team] });
}
