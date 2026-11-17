"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { FieldError, HelperMessage, Input } from "@/components/ui/form";
import { SectionMessage } from "@/components/ui/section-message";
import type { ActionState } from "@/types";

export function NewsletterForm({ compact = false, source = "website" }: { compact?: boolean; source?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(subscribeToNewsletter, null);

  if (state?.ok) {
    return <SectionMessage appearance="success">{state.message}</SectionMessage>;
  }

  const error = state && !state.ok ? state.message : undefined;

  return (
    <form action={action} noValidate>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot — bots fill it, humans never see it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-email-${source}`} className="sr-only">Email address</label>
        <Input
          id={`nl-email-${source}`}
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          defaultValue={(state?.values?.email as string) ?? ""}
          className="flex-1"
        />
        <Button type="submit" appearance="primary" disabled={pending} className="h-9!">
          {pending ? <Loader2 className="size-4 animate-spin" aria-label="Subscribing" /> : "Subscribe"}
        </Button>
      </div>
      {error && <FieldError errors={[error]} />}
      {!compact && !error && <HelperMessage>No spam. Unsubscribe any time.</HelperMessage>}
    </form>
  );
}
