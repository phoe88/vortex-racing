"use server";
import { z } from "zod";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const recordSchema = z.object({
  path: z.string().min(1).max(500),
  url: z.url(),
  alt: z.string().max(300).default(""),
  mime_type: z.string().max(100).nullable().default(null),
  size_bytes: z.number().int().nonnegative().nullable().default(null),
  width: z.number().int().positive().nullable().default(null),
  height: z.number().int().positive().nullable().default(null),
});

/** Called by the uploader after a successful direct-to-Storage upload. */
export async function recordMedia(input: z.input<typeof recordSchema>): Promise<ActionState> {
  let user;
  try {
    user = await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const parsed = recordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid media metadata." };
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from("media").upsert({ ...parsed.data, bucket: "media", created_by: user.id }, { onConflict: "path" });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Uploaded." };
}

export async function deleteMedia(id: string, path: string): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const storage = await db.storage.from("media").remove([path]);
  if (storage.error) return { ok: false, message: storage.error.message };
  const { error } = await db.from("media").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Deleted." };
}

export async function updateMediaAlt(id: string, alt: string): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from("media").update({ alt: alt.slice(0, 300) }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Saved." };
}
