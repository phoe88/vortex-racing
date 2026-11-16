import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type TableName = keyof Database["public"]["Tables"];

/**
 * Uncached, request-time reads for the admin area. They run with the signed-in
 * user's session so RLS (staff-only drafts, subscribers, profiles) applies.
 */
export async function adminList<T extends TableName>(
  table: T,
  opts: { orderBy?: string; ascending?: boolean; limit?: number } = {},
): Promise<Database["public"]["Tables"][T]["Row"][]> {
  const db = await createServerSupabase();
  if (!db) return [];
  const { orderBy = "created_at", ascending = false, limit = 500 } = opts;
  const { data, error } = await db.from(table).select("*").order(orderBy, { ascending }).limit(limit);
  if (error) throw new Error(`adminList(${table}): ${error.message}`);
  return (data ?? []) as unknown as Database["public"]["Tables"][T]["Row"][];
}

export async function adminGet<T extends TableName>(
  table: T,
  id: string,
): Promise<Database["public"]["Tables"][T]["Row"] | null> {
  const db = await createServerSupabase();
  if (!db) return null;
  const idColumn = table === "site_settings" ? "key" : "id";
  // Column name is validated above; the generic eq() typing can't narrow across tables.
  const { data, error } = await db
    .from(table)
    .select("*")
    .eq(idColumn as never, id as never)
    .maybeSingle();
  if (error) throw new Error(`adminGet(${table}): ${error.message}`);
  return data as unknown as Database["public"]["Tables"][T]["Row"] | null;
}

export async function adminCounts() {
  const db = await createServerSupabase();
  if (!db) return null;
  const tables: TableName[] = ["articles", "drivers", "races", "cars", "partners", "newsletter_subscribers", "media"];
  const results = await Promise.all(
    tables.map(async (t) => {
      const { count } = await db.from(t).select("id", { count: "exact", head: true });
      return [t, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(results) as Record<(typeof tables)[number], number>;
}

export async function adminRaceResults(raceId: string) {
  const db = await createServerSupabase();
  if (!db) return [];
  const { data, error } = await db
    .from("race_results")
    .select("*")
    .eq("race_id", raceId)
    .order("position", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data;
}
