import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArchivedMessagesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Generate 5 skeleton cards */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="border-secondary bg-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-3">
                {/* Name and badges row */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  {/* Randomly show urgent badge on some skeletons */}
                  {index % 3 === 0 && <Skeleton className="h-5 w-12 rounded-full" />}
                </div>

                {/* Subject line */}
                <Skeleton className="h-4 w-3/4" />

                {/* Message preview */}
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>

                {/* Contact info and date */}
                <div className="flex items-center gap-4 mt-2">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}