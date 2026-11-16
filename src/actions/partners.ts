"use server";
import { deleteRow, saveRow } from "@/features/admin/crud";
import { partnerSchema } from "@/features/partners/schema";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function savePartner(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "partners",
    schema: partnerSchema,
    formData,
    id,
    tags: [TAGS.partners],
    redirectTo: () => "/admin/partners?saved=1",
  });
}

export async function deletePartner(id: string): Promise<ActionState> {
  return deleteRow({ table: "partners", id, tags: [TAGS.partners] });
}
