"use server";
import { revalidateTag, updateTag } from "next/cache";
import { teamAboutSchema } from "@/features/team/schema";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { fieldErrorsOf, formToObject } from "@/lib/forms";
import { ALL_CONTENT_TAGS, TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

export async function saveTeamAbout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const raw = formToObject(formData);
  const parsed = teamAboutSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: raw };
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from("site_settings").upsert({ key: "team_about", value: parsed.data }, { onConflict: "key" });
  if (error) return { ok: false, message: error.message };
  updateTag(TAGS.settings);
  return { ok: true, message: "Saved." };
}

/** Purge every public cache tag — useful after bulk edits or a reseed. */
export async function revalidateEverything(): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  for (const tag of ALL_CONTENT_TAGS) revalidateTag(tag, "max");
  return { ok: true, message: "Public cache marked stale. Pages refresh on their next visit." };
}
