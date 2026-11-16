import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Lightweight uptime check for Vercel monitors. */
export async function GET() {
  return NextResponse.json(
    { ok: true, supabase: isSupabaseConfigured() ? "configured" : "demo-mode", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
