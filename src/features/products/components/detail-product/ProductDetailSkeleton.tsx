import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => (
  <div className="grid gap-6 py-6">
    <div className="flex gap-8">
      <Skeleton className="h-[300px] w-[300px] rounded-lg" />
      <div className="flex-1 space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
