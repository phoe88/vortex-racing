"use server";
import { updateTag } from "next/cache";
import { deleteRow, saveRow } from "@/features/admin/crud";
import { raceSchema, resultsPayloadSchema } from "@/features/races/schema";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { formToObject, fieldErrorsOf } from "@/lib/forms";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function saveRace(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return saveRow({
    table: "races",
    schema: raceSchema,
    formData,
    id,
    tags: (row) => [TAGS.races, TAGS.race(row.slug)],
    redirectTo: () => "/admin/races?saved=1",
  });
}

export async function deleteRace(id: string, slug: string): Promise<ActionState> {
  return deleteRow({ table: "races", id, tags: [TAGS.races, TAGS.race(slug)] });
}

/** Replaces the full classification for one race. */
export async function saveRaceResults(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const parsed = resultsPayloadSchema.safeParse(formToObject(formData));
  if (!parsed.success) return { ok: false, message: "Invalid results data.", fieldErrors: fieldErrorsOf(parsed.error) };

  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };

  const { race_id, rows } = parsed.data;
  const { data: race } = await db.from("races").select("slug").eq("id", race_id).single();
  const del = await db.from("race_results").delete().eq("race_id", race_id);
  if (del.error) return { ok: false, message: del.error.message };
  if (rows.length) {
    const ins = await db.from("race_results").insert(rows.map((r) => ({ ...r, race_id, driver_id: r.driver_id ?? null })));
    if (ins.error) return { ok: false, message: ins.error.message };
  }
  updateTag(TAGS.races);
  if (race) updateTag(TAGS.race(race.slug));
  return { ok: true, message: `Saved ${rows.length} result rows.` };
}
