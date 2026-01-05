"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getBlogs, Blog } from "@/lib/blog"
import { Calendar, ArrowRight, Tag } from "lucide-react"

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const allBlogs = await getBlogs()
        // Only show published blogs
        setBlogs(allBlogs.filter(blog => blog.published))
      } catch (error) {
        console.error("Error loading blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [])

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Blog
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl mx-auto">
            Thoughts, tutorials, and insights on development, design, and technology.
          </p>
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary/50 rounded-xl h-48 mb-4" />
                <div className="h-6 bg-secondary/50 rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary/50 rounded w-full mb-2" />
                <div className="h-4 bg-secondary/50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group"
              >
                <article className="bg-white/5 border border-secondary/50 rounded-xl overflow-hidden transition-all hover:border-green/50 hover:shadow-lg hover:shadow-green/5">
                  {blog.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-2 group-hover:text-green transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-primary/60 text-sm mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-primary/50">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      
                      <span className="flex items-center gap-1 text-sm text-green group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>

                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary/50 text-primary/70 text-xs rounded-full"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-primary/60 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
