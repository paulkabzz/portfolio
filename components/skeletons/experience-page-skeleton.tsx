import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

const SkeletonCard = () => (
  <Card className="border-secondary hover:shadow-lg transition-shadow">
    <CardContent className="p-0">
      {/* Cover Image Skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg animate-pulse"></div>
      
      <div className="p-4">
        {/* Title and Actions Skeleton */}
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="flex gap-1">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Date Range Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Skills Skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-18 animate-pulse"></div>
        </div>

        {/* Created Date Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-24 animate-pulse mt-3"></div>
      </div>
    </CardContent>
  </Card>
)

export default function ExperiencePageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <Button disabled className="bg-gray-200 text-gray-400 cursor-not-allowed">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Search Skeleton */}
      <Card className="border-secondary">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 h-4 w-4" />
            <Input
              disabled
              placeholder="Loading..."
              className="pl-10 border-secondary bg-gray-50 cursor-not-allowed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experience Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  )
}