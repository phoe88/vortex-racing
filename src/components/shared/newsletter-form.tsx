"use client";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { FieldError, HelperMessage } from "@/components/ui/form";
import { SectionMessage } from "@/components/ui/section-message";
import type { ActionState } from "@/types";

/** Email sign-up: a white field with the red submit button set inside it. */
export function NewsletterForm({ compact = false, source = "website" }: { compact?: boolean; source?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(subscribeToNewsletter, null);

  if (state?.ok) {
    return <SectionMessage appearance="success">{state.message}</SectionMessage>;
  }

  const error = state && !state.ok ? state.message : undefined;

  return (
    <form action={action} noValidate className="w-full max-w-md">
      <input type="hidden" name="source" value={source} />
      {/* Honeypot — bots fill it, humans never see it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex h-12 items-center gap-1 rounded-md bg-neutral-bold p-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
        <label htmlFor={`nl-email-${source}`} className="sr-only">Email address</label>
        <input
          id={`nl-email-${source}`}
          type="email"
          name="email"
          required
          placeholder="Your email address"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          defaultValue={(state?.values?.email as string) ?? ""}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-inverse outline-none placeholder:text-inverse/50"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-brand-bold px-5 text-sm font-medium transition-colors hover:bg-brand-bold-hovered active:bg-brand-bold-pressed disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-label="Signing up" /> : "Sign up"}
        </button>
      </div>
      {error && <FieldError errors={[error]} />}
      {!compact && !error && <HelperMessage>No spam. Unsubscribe any time.</HelperMessage>}
    </form>
  );
}
