import "server-only";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import type { z } from "zod";
import { authorize, AuthorizationError } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { fieldErrorsOf, formToObject } from "@/lib/forms";
import type { ActionState, UserRole } from "@/types";
import type { Database } from "@/types/database";

type TableName = keyof Database["public"]["Tables"];

interface SaveOptions<S extends z.ZodTypeAny, T extends TableName> {
  table: T;
  schema: S;
  formData: FormData;
  id?: string | null;
  /** Cache tags to expire after a successful write. */
  tags: string[] | ((row: Database["public"]["Tables"][T]["Row"]) => string[]);
  /** Where to go after success. Return null to stay and show a success state. */
  redirectTo?: (row: Database["public"]["Tables"][T]["Row"]) => string | null;
  /** Final shaping of validated data before it hits the database. */
  transform?: (data: z.infer<S>, ctx: { id: string | null; userId: string }) => Record<string, unknown>;
  minRole?: UserRole;
}

/**
 * Validate → authorise → insert/update → revalidate → redirect.
 * Shared by every content server action so behaviour stays consistent.
 */
export async function saveRow<S extends z.ZodTypeAny, T extends TableName>(opts: SaveOptions<S, T>): Promise<ActionState> {
  const { table, schema, formData, id = null, tags, redirectTo, transform, minRole = "editor" } = opts;
  const raw = formToObject(formData);

  let user;
  try {
    user = await authorize(minRole);
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised.", values: raw };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: fieldErrorsOf(parsed.error), values: raw };
  }

  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured.", values: raw };

  const payload = (transform ? transform(parsed.data, { id, userId: user.id }) : parsed.data) as never;

  const query = id
    ? db.from(table).update(payload).eq("id" as never, id as never).select("*").single()
    : db.from(table).insert(payload).select("*").single();

  const { data, error } = await query;
  if (error) {
    const friendly = /duplicate key|unique/i.test(error.message)
      ? "A record with that slug / key already exists."
      : error.message;
    return { ok: false, message: friendly, values: raw };
  }

  const row = data as unknown as Database["public"]["Tables"][T]["Row"];
  for (const tag of typeof tags === "function" ? tags(row) : tags) updateTag(tag);

  const target = redirectTo ? redirectTo(row) : null;
  if (target) redirect(target);
  return { ok: true, message: "Saved." };
}

export async function deleteRow<T extends TableName>(opts: {
  table: T;
  id: string;
  tags: string[];
  redirectTo?: string;
  minRole?: UserRole;
  idColumn?: string;
}): Promise<ActionState> {
  const { table, id, tags, redirectTo, minRole = "editor", idColumn = "id" } = opts;
  try {
    await authorize(minRole);
  } catch (e) {
    return { ok: false, message: e instanceof AuthorizationError ? e.message : "Not authorised." };
  }
  const db = await createServerSupabase();
  if (!db) return { ok: false, message: "Supabase is not configured." };
  const { error } = await db.from(table).delete().eq(idColumn as never, id as never);
  if (error) return { ok: false, message: error.message };
  for (const tag of tags) updateTag(tag);
  if (redirectTo) redirect(redirectTo);
  return { ok: true, message: "Deleted." };
}
