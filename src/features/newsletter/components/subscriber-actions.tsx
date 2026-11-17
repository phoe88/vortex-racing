"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteSubscriber, toggleSubscriber } from "@/actions/subscribers";
import { Button } from "@/components/ui/button";
import type { SubscriberStatus } from "@/types";

export function SubscriberActions({ id, status }: { id: string; status: SubscriberStatus }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const next: SubscriberStatus = status === "subscribed" ? "unsubscribed" : "subscribed";
  return (
    <div className="inline-flex gap-2">
      <Button disabled={pending} onClick={() => start(async () => { await toggleSubscriber(id, next); router.refresh(); })}>
        {status === "subscribed" ? "Unsubscribe" : "Re-subscribe"}
      </Button>
      <Button appearance="subtle" className="text-danger!" disabled={pending} onClick={() => { if (confirm("Permanently delete this subscriber?")) start(async () => { await deleteSubscriber(id); router.refresh(); }); }}>
        Delete
      </Button>
    </div>
  );
}
