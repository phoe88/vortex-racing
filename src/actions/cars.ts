"use server";
import { deleteRow, saveRow } from "@/features/admin/crud";
import { carSchema } from "@/features/cars/schema";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function saveCar(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "cars",
    schema: carSchema,
    formData,
    id,
    tags: (row) => [TAGS.cars, TAGS.car(row.slug)],
    redirectTo: () => "/admin/cars?saved=1",
  });
}

export async function deleteCar(id: string, slug: string): Promise<ActionState> {
  return deleteRow({ table: "cars", id, tags: [TAGS.cars, TAGS.car(slug)] });
}
