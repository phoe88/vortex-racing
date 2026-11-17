import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-[78vh] w-full rounded-none" />
      <div className="container-x mt-12 space-y-4">
        <Skeleton className="h-8 w-2/3 max-w-2xl" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
      </div>
    </div>
  );
}
