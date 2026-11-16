"use client";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

/** Shows a one-off success banner when the URL carries ?saved=1. Wrap in Suspense. */
export function SavedFlash() {
  const sp = useSearchParams();
  if (sp.get("saved") !== "1") return null;
  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-2.5 text-sm text-success">
      <Check className="size-4" /> Saved. The public site will show the change immediately.
    </div>
  );
}
