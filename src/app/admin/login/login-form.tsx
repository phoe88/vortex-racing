"use client";
import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { signIn } from "@/actions/auth";
import { Field, Input } from "@/components/ui/form";
import type { ActionState } from "@/types";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, null);
  return (
    <form action={action} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {state && !state.ok && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{state.message}</div>}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={(state?.values?.email as string) ?? ""} />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <button type="submit" disabled={pending} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent font-display text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-[#ff1a45] disabled:opacity-60">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Sign in
      </button>
    </form>
  );
}
