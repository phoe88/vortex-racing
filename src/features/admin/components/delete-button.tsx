"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
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
  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmText)) return;
          start(async () => {
            const res = await action();
            if (res && !res.ok) setError(res.message ?? "Failed");
            else { onDone?.(); router.refresh(); }
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/15 disabled:opacity-50"
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        {!compact && label}
      </button>
      {error && <span className="mt-1 text-[11px] text-red-400">{error}</span>}
    </span>
  );
}
