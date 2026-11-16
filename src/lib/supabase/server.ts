import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv, isSupabaseConfigured } from "./env";

/**
 * Request-scoped client bound to the current user's session cookies.
 * Use in Server Components, Server Actions and Route Handlers that need the
 * signed-in user. Never call inside a `"use cache"` scope.
 */
export async function createServerSupabase() {
  if (!isSupabaseConfigured()) return null;
  const { url, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component: cookies are read-only there. The
          // proxy (src/proxy.ts) refreshes sessions, so this is safe to ignore.
        }
      },
    },
  });
}
