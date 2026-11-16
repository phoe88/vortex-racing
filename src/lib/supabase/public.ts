import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv, isSupabaseConfigured } from "./env";

let cached: SupabaseClient<Database> | null = null;

/**
 * Anonymous, cookie-free client for public reads. Safe to call inside
 * `"use cache"` scopes because it never touches request APIs. RLS limits it to
 * published / public rows.
 */
export function getPublicClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  const { url, anonKey } = getSupabasePublicEnv();
  cached = createClient<Database>(url!, anonKey!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "x-client-info": "vortex-web/public" } },
  });
  return cached;
}
