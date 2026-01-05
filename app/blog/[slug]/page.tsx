"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { getBlogBySlug, Blog } from "@/lib/blog"
import { BlogContentRenderer } from "@/components/blog-content-renderer"
import { Calendar, ArrowLeft, Tag, Clock } from "lucide-react"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const blogData = await getBlogBySlug(slug)
        // Only show if published
        if (blogData && blogData.published) {
          setBlog(blogData)
        }
      } catch (error) {
        console.error("Error loading blog:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [slug])

  // Estimate reading time (roughly 200 words per minute)
  const estimateReadingTime = (content: Blog['content']) => {
    const text = content.map(block => block.content).join(' ')
    const words = text.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return minutes < 1 ? 1 : minutes
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary/50 rounded w-3/4 mb-4" />
            <div className="h-4 bg-secondary/50 rounded w-1/4 mb-8" />
            <div className="h-64 bg-secondary/50 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-secondary/50 rounded w-full" />
              <div className="h-4 bg-secondary/50 rounded w-full" />
              <div className="h-4 bg-secondary/50 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-primary/60 mb-8">The blog post you're looking for doesn't exist or isn't published.</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-green hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-primary/60 hover:text-green mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-primary/60 text-sm">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {estimateReadingTime(blog.content)} min read
            </span>
          </div>

          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {blog.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/50 text-primary/70 text-sm rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {blog.cover_image && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Excerpt */}
        <p className="text-lg text-primary/70 mb-10 leading-relaxed border-l-4 border-green pl-4 italic">
          {blog.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <BlogContentRenderer 
            content={blog.content} 
            customFonts={blog.custom_fonts}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-secondary">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-green hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  )
}
