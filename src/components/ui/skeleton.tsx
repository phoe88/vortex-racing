import { cn } from "@/lib/utils";

/** Loading placeholder in the design system's skeleton colour. */
export function Skeleton({ className }: { className?: string }) {
  // Default to radius.small unless the caller sets its own radius.
  const rounded = className?.includes("rounded") ? undefined : "rounded-sm";
  return <div className={cn("animate-pulse bg-skeleton", rounded, className)} aria-hidden />;
}

export function CardGridSkeleton({ count = 3, aspect = "aspect-[16/10]" }: { count?: number; aspect?: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={cn(aspect, "rounded-lg")} />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-5/6" />
        </div>
      ))}
    </div>
  );
}
