"use client";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-24">
      <p className="eyebrow text-accent">Red flag</p>
      <h1 className="display mt-3 text-5xl sm:text-7xl">Something went wrong</h1>
      <p className="mt-4 max-w-md text-muted">The session has been suspended. Try again, or head back to the pit lane.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted/60">Ref {error.digest}</p>}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">Home</ButtonLink>
      </div>
    </div>
  );
}
