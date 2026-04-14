import { Skeleton } from "@/components/ui/skeleton";

export function MatchHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/40 bg-card/40 p-4 flex items-center gap-4"
        >
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-32 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}
