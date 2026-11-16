"use server";
import { z } from "zod";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { USER_ROLES, type ActionState } from "@/types";

/** Admin-only: change another user's role. Admins cannot demote themselves. */
export async function setUserRole(userId: string, role: string): Promise<ActionState> {
  let me;
  try {
    me = await authorize("admin");
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const parsed = z.enum(USER_ROLES).safeParse(role);
  if (!parsed.success) return { ok: false, message: "Unknown role." };
  if (userId === me.id && parsed.data !== "admin") return { ok: false, message: "You can't remove your own admin role." };

  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from("profiles").update({ role: parsed.data }).eq("id", userId);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Role updated." };
}
