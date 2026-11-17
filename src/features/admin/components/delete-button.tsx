"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/types";

export function DeleteButton({ action, label = "Delete", confirmText = "Delete this item? This cannot be undone.", onDone, compact = false }: {
  action: () => Promise<ActionState>;
  label?: string;
  confirmText?: string;
  onDone?: () => void;
  compact?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const icon = pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />;
  return (
    <span className="inline-flex flex-col items-end">
      <Button
        appearance={compact ? "subtle" : "danger"}
        iconOnly={compact}
        aria-label={compact ? label : undefined}
        title={compact ? label : undefined}
        disabled={pending}
        className={compact ? "text-danger!" : undefined}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          start(async () => {
            const res = await action();
            if (res && !res.ok) setError(res.message ?? "Failed");
            else { onDone?.(); router.refresh(); }
          });
        }}
      >
        {icon}
        {!compact && label}
      </Button>
      {error && <span className="type-body-small mt-1 text-danger">{error}</span>}
    </span>
  );
}
