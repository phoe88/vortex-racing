import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/6", className)} aria-hidden />;
}

export function CardGridSkeleton({ count = 3, aspect = "aspect-[16/10]" }: { count?: number; aspect?: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className={aspect} />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      ))}
    </div>
  );
}
