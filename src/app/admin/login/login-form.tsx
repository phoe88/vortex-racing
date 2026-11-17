"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { SectionMessage } from "@/components/ui/section-message";
import type { ActionState } from "@/types";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, null);
  return (
    <form action={action} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {state && !state.ok && <SectionMessage appearance="error">{state.message}</SectionMessage>}
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={(state?.values?.email as string) ?? ""} />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      <Button type="submit" appearance="primary" shouldFitContainer disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />} Sign in
      </Button>
    </form>
  );
}
