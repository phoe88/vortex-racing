import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "./env";

let cached: SupabaseClient<Database> | null = null;

/**
 * Service-role client. Bypasses RLS — only ever import from server code paths
 * that have already authorised the caller (or that are intentionally public,
 * such as newsletter sign-up). The key is read from a non-public env var so it
 * can never reach the client bundle.
 */
export function getAdminClient(): SupabaseClient<Database> | null {
  const { url } = getSupabasePublicEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (cached) return cached;
  cached = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { "x-client-info": "vortex-web/admin" } },
  });
  return cached;
}
