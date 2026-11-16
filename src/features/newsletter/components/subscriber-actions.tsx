"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteSubscriber, toggleSubscriber } from "@/actions/subscribers";
import type { SubscriberStatus } from "@/types";

export function SubscriberActions({ id, status }: { id: string; status: SubscriberStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const next: SubscriberStatus = status === "subscribed" ? "unsubscribed" : "subscribed";
  return (
    <div className="inline-flex gap-2">
      <button type="button" disabled={pending} onClick={() => start(async () => { await toggleSubscriber(id, next); router.refresh(); })} className="rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:bg-white/6 disabled:opacity-50">
        {status === "subscribed" ? "Unsubscribe" : "Re-subscribe"}
      </button>
      <button type="button" disabled={pending} onClick={() => { if (confirm("Permanently delete this subscriber?")) start(async () => { await deleteSubscriber(id); router.refresh(); }); }} className="rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/15 disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}
