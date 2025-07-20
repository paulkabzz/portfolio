import { Card, CardContent, CardHeader } from "@/components/ui/card";

const MessageSkeleton = () => (
  <Card className="border-secondary">
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-3/5 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-secondary">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MessagesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <Card className="border-secondary">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <MessageSkeleton key={index} />
        ))}
      </div>

      {/* Stats Skeleton */}
      <Card className="border-secondary">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}