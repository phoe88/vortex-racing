"use server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionState } from "@/types";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  source: z.string().trim().max(40).optional().default("website"),
  website: z.string().max(0).optional(), // honeypot
});

export async function subscribeToNewsletter(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    source: formData.get("source") ?? undefined,
    website: formData.get("website") ?? undefined,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    // A filled honeypot gets a silent "success" so bots learn nothing.
    if (first?.path[0] === "website") return { ok: true, message: "You're on the list. See you on race day." };
    return { ok: false, message: first?.message ?? "Invalid email.", values: { email: formData.get("email") } };
  }

  if (!isSupabaseConfigured()) {
    return { ok: true, message: "Demo mode: Supabase isn't configured, so nothing was saved — but the form works." };
  }

  const admin = getAdminClient();
  if (!admin) {
    return { ok: false, message: "Newsletter sign-up is temporarily unavailable. Please try again later." };
  }

  const { error } = await admin
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.data.email, source: parsed.data.source, status: "subscribed", unsubscribed_at: null },
      { onConflict: "email" },
    );

  if (error) {
    console.error("[newsletter] insert failed:", error.message);
    return { ok: false, message: "Something went wrong on our side. Please try again." };
  }

  return { ok: true, message: "You're on the list. See you on race day." };
}
