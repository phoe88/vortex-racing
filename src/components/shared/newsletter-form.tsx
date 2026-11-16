"use client";
import { useActionState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/types";

export function NewsletterForm({ compact = false, source = "website" }: { compact?: boolean; source?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(subscribeToNewsletter, null);

  if (state?.ok) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
        <Check className="size-5 shrink-0" />
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-2" noValidate>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot — bots fill it, humans never see it */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className={cn("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <label htmlFor={`nl-email-${source}`} className="sr-only">Email address</label>
        <input
          id={`nl-email-${source}`}
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          defaultValue={(state?.values?.email as string) ?? ""}
          className={cn(
            "flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-ice placeholder:text-muted outline-none transition focus:border-accent-2/70 focus:ring-2 focus:ring-accent-2/20",
            compact ? "h-11" : "h-13 text-base",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 font-display font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#ff1a45] disabled:opacity-60",
            compact ? "h-11 text-xs" : "h-13 text-sm",
          )}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <>Subscribe <ArrowRight className="size-4" /></>}
        </button>
      </div>
      {state && !state.ok && <p className="text-xs text-red-400">{state.message}</p>}
      {!compact && <p className="text-xs text-muted">No spam. Unsubscribe any time.</p>}
    </form>
  );
}
