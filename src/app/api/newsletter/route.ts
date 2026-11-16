import { NextResponse, type NextRequest } from "next/server";
import { subscribeToNewsletter } from "@/actions/newsletter";

/**
 * JSON endpoint for external sign-up forms (e.g. embedded widgets).
 * Body: { "email": "...", "source": "optional" }
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }
  const fd = new FormData();
  fd.set("email", body.email ?? "");
  fd.set("source", body.source ?? "api");
  const result = await subscribeToNewsletter(null, fd);
  return NextResponse.json(result, { status: result?.ok ? 200 : 400 });
}
