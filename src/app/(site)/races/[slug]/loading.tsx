import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-x pt-4 sm:pt-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-9 w-3/4 max-w-2xl" />
      <Skeleton className="mt-2 h-5 w-1/2 max-w-md" />
      <Skeleton className="mt-6 aspect-[21/10] w-full rounded-xl" />
    </div>
  );
}
