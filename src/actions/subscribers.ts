"use server";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

export async function deleteSubscriber(id: string): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from("newsletter_subscribers").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Removed." };
}

export async function toggleSubscriber(id: string, status: "subscribed" | "unsubscribed"): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db
    .from("newsletter_subscribers")
    .update({ status, unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Updated." };
}
