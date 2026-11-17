"use client";
import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="container-x flex min-h-[80vh] flex-col items-start justify-center pt-28">
      <p className="type-heading-xxsmall text-red">Red flag</p>
      <h1 className="type-display mt-3">Something went wrong</h1>
      <p className="type-body-large mt-5 max-w-md text-subtle">The session has been suspended. Try again, or head back to the pit lane.</p>
      {error.digest && <p className="type-code mt-3 text-subtlest">Ref {error.digest}</p>}
      <div className="mt-8 flex gap-3">
        <Button appearance="primary" onClick={reset}>Try again</Button>
        <ButtonLink href="/">Home</ButtonLink>
      </div>
    </div>
  );
}
