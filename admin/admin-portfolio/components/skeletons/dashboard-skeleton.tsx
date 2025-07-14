import { Card, CardContent, CardHeader } from "@/components/ui/card"
// Skeleton component for loading states
const Skeleton = ({ className = "", ...props }) => (
  <div
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    {...props}
  />
)

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects Skeleton */}
      <Card className="border-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-36 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-secondary">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-32 rounded-md mb-3" />
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Skeleton */}
      <Card className="border-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}