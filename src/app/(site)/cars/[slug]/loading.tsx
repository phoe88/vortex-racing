import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-x pt-32 sm:pt-40">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-14 w-3/4 max-w-2xl" />
      <Skeleton className="mt-4 h-6 w-1/2 max-w-md" />
      <Skeleton className="mt-10 aspect-[21/10] w-full rounded-2xl" />
    </div>
  );
}
