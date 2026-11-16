"use server";
import { updateTag } from "next/cache";
import { z } from "zod";
import { constructorStandingRow, driverStandingRow, standingsPayload } from "@/features/standings/schema";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { formToObject } from "@/lib/forms";
import { TAGS } from "@/lib/cache-tags";
import type { ActionState } from "@/types";

/** Replaces a season's standings table (drivers or constructors) wholesale. */
export async function saveStandings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await authorize("editor");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const parsed = standingsPayload.safeParse(formToObject(formData));
  if (!parsed.success) return { ok: false, message: "Invalid standings payload." };
  const { season, kind } = parsed.data;

  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };

  if (kind === "drivers") {
    const rows = z.array(driverStandingRow).safeParse(parsed.data.rows);
    if (!rows.success) return { ok: false, message: rows.error.issues[0]?.message ?? "Invalid rows." };
    const del = await db.from("driver_standings").delete().eq("season", season);
    if (del.error) return { ok: false, message: del.error.message };
    if (rows.data.length) {
      const ins = await db.from("driver_standings").insert(rows.data.map((r) => ({ ...r, season, driver_id: r.driver_id ?? null })));
      if (ins.error) return { ok: false, message: ins.error.message };
    }
  } else {
    const rows = z.array(constructorStandingRow).safeParse(parsed.data.rows);
    if (!rows.success) return { ok: false, message: rows.error.issues[0]?.message ?? "Invalid rows." };
    const del = await db.from("constructor_standings").delete().eq("season", season);
    if (del.error) return { ok: false, message: del.error.message };
    if (rows.data.length) {
      const ins = await db.from("constructor_standings").insert(rows.data.map((r) => ({ ...r, season })));
      if (ins.error) return { ok: false, message: ins.error.message };
    }
  }
  updateTag(TAGS.standings);
  return { ok: true, message: "Standings updated." };
}
