import { cn } from "@/lib/utils";

/** Loading placeholder. */
export function Skeleton({ className }: { className?: string }) {
  // Default to a small radius unless the caller sets its own.
  const rounded = className?.includes("rounded") ? undefined : "rounded-md";
  return <div className={cn("animate-pulse bg-skeleton", rounded, className)} aria-hidden />;
}

export function CardGridSkeleton({ count = 3, aspect = "aspect-[4/5]" }: { count?: number; aspect?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn(aspect, "rounded-xl")} />
      ))}
    </div>
  );
}
