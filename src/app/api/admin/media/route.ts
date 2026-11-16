import { NextResponse } from "next/server";
import { getSessionUser, hasRole } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

/** Media list for the in-form library picker. Staff only. */
export async function GET() {
  const user = await getSessionUser();
  if (!hasRole(user, "editor")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = await createServerSupabase();
  if (!db) return NextResponse.json({ media: [] });
  const { data, error } = await db.from("media").select("*").order("created_at", { ascending: false }).limit(200);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ media: data }, { headers: { "Cache-Control": "private, no-store" } });
}
