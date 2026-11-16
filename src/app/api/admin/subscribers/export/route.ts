import { NextResponse } from "next/server";
import { getSessionUser, hasRole } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

function csvCell(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV export of newsletter subscribers. Staff only. */
export async function GET() {
  const user = await getSessionUser();
  if (!hasRole(user, "editor")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = await createServerSupabase();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });
  const { data, error } = await db.from("newsletter_subscribers").select("*").order("created_at", { ascending: true }).limit(50000);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const rows = [["email", "status", "source", "created_at", "unsubscribed_at"], ...data.map((s) => [s.email, s.status, s.source, s.created_at, s.unsubscribed_at])];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
