"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  next: z.string().optional(),
});

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message, values: { email: formData.get("email") } };
  }
  const supabase = await createServerSupabase();
  if (!supabase) return { ok: false, message: "Supabase is not configured. Add the environment variables to enable admin sign-in." };

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { ok: false, message: "Invalid email or password.", values: { email: parsed.data.email } };

  const next = parsed.data.next && parsed.data.next.startsWith("/admin") ? parsed.data.next : "/admin";
  redirect(next);
}

export async function signOut() {
  const supabase = await createServerSupabase();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}
