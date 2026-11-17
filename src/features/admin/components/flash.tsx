"use client";
import { useSearchParams } from "next/navigation";
import { SectionMessage } from "@/components/ui/section-message";

/** Shows a one-off success message when the URL carries ?saved=1. Wrap in Suspense. */
export function SavedFlash() {
  const sp = useSearchParams();
  if (sp.get("saved") !== "1") return null;
  return (
    <SectionMessage appearance="success" className="mb-4">
      Saved. The public site will show the change immediately.
    </SectionMessage>
  );
}
