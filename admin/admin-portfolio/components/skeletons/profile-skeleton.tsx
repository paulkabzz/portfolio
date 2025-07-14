import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

export default function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Image Skeleton */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Profile Picture</CardTitle>
              <CardDescription className="text-primary/60">Upload your professional photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information Skeleton */}
          <Card className="border-secondary lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Basic Information</CardTitle>
              <CardDescription className="text-primary/60">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Links Skeleton */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Social Links</CardTitle>
            <CardDescription className="text-primary/60">Your online presence and portfolio links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Skeleton */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Preview</CardTitle>
            <CardDescription className="text-primary/60">
              How your information will appear on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6 p-6 bg-white border border-secondary rounded-lg">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-10 w-10 text-primary/30" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}