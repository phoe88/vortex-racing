"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "./env";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/** Browser client (anon key + user session). Used for direct Storage uploads. */
export function getBrowserSupabase() {
  if (client) return client;
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  client = createBrowserClient<Database>(url, anonKey);
  return client;
}
