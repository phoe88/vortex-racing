import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { SessionUser, UserRole } from "@/types";

/**
 * Resolves the signed-in user plus their role from `profiles`.
 * Memoised per request with React.cache so layouts, pages and actions share
 * one round-trip.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? null,
    role: (profile?.role ?? "viewer") as UserRole,
  };
});

const ROLE_RANK: Record<UserRole, number> = { viewer: 0, editor: 1, admin: 2 };

export function hasRole(user: SessionUser | null, min: UserRole): user is SessionUser {
  return !!user && ROLE_RANK[user.role] >= ROLE_RANK[min];
}

/** For pages: redirects to the login screen (or a 403 page) when unauthorised. */
export async function requireUser(min: UserRole = "editor"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!hasRole(user, min)) redirect("/admin/forbidden");
  return user;
}

export class AuthorizationError extends Error {
  constructor(message = "You are not allowed to perform this action.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/** For server actions / route handlers: throws instead of redirecting. */
export async function authorize(min: UserRole = "editor"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthorizationError("You must be signed in.");
  if (!hasRole(user, min)) throw new AuthorizationError();
  return user;
}
