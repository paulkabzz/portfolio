const AboutSkeleton = () => {
  return (
    <section className="w-full py-0 lg:py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mx-auto mb-4" />
          <div className="w-24 h-1 bg-gray-200 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section Skeleton */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="w-full h-[500px] lg:h-[600px] bg-gray-200 animate-pulse" />
              {/* Overlay gradient - keep for visual consistency */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/10 to-transparent"></div>
            </div>
          </div>

          {/* Text Content Skeleton */}
          <div className="space-y-8">
            {/* Simulate multiple paragraphs */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-11/12" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
            </div>
            
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSkeleton