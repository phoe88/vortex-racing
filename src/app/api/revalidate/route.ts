import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { ALL_CONTENT_TAGS } from "@/lib/cache-tags";

/**
 * On-demand cache purge for webhooks (e.g. a Supabase database webhook).
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "tags": ["articles"] }   // optional, defaults to every content tag
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const header = request.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "") || request.nextUrl.searchParams.get("secret") || "";
  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let tags: string[] = ALL_CONTENT_TAGS;
  try {
    const body = await request.json();
    if (Array.isArray(body?.tags) && body.tags.length) {
      tags = body.tags.filter((t: unknown): t is string => typeof t === "string").slice(0, 50);
    }
  } catch {
    // empty body → revalidate everything
  }
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, revalidated: tags, at: new Date().toISOString() });
}
