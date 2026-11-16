import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv, isSupabaseConfigured } from "./env";

/**
 * Refreshes the Supabase session cookie on every matched request and returns
 * the current user. Based on the official @supabase/ssr Next.js pattern.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return { response, user: null };

  const { url, anonKey } = getSupabasePublicEnv();
  const supabase = createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() validates the JWT against Supabase Auth; do not use getSession() here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
