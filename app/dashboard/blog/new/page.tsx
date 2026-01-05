"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, X, Plus, Loader2, Eye, Edit3 } from "lucide-react"
import { useBlogs } from "@/app/context/blog-context"
import { BlogContentBlock, CustomFont, generateSlug } from "@/lib/blog"
import { BlogContentEditor } from "@/components/blog-content-editor"
import { BlogContentRenderer } from "@/components/blog-content-renderer"
import { CustomFontsManager } from "@/components/custom-fonts-manager"
import { useToast } from "@/hooks/use-toast"

export default function NewBlogPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addBlog } = useBlogs()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    published: false,
  })

  const [content, setContent] = useState<BlogContentBlock[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      // Auto-generate slug from title
      if (name === "title") {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverImagePreview("")
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.excerpt) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the title and excerpt",
        variant: "destructive",
      })
      return
    }

    if (content.length === 0) {
      toast({
        title: "No content",
        description: "Please add at least one content block",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addBlog({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content,
        tags,
        published: formData.published,
        cover_image: coverImage || undefined,
        custom_fonts: customFonts,
      })

      toast({
        title: "Blog post created!",
        description: formData.published ? "Your post is now live" : "Your draft has been saved",
      })

      router.push("/dashboard/blog")
    } catch (error) {
      console.error("Error creating blog:", error)
      toast({
        title: "Error creating blog post",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.title && formData.excerpt && content.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover:bg-secondary/50" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Create New Post</h1>
          <p className="text-primary/70 mt-2">Write a new blog post for your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Post Details</CardTitle>
                <CardDescription className="text-primary/60">Basic information about your blog post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-primary">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="An Awesome Blog Post Title"
                    className="border-secondary focus:border-green"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="text-primary">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="an-awesome-blog-post-title"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-primary/60 mt-1">Auto-generated from title. Edit if needed.</p>
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-primary">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="A brief summary of your blog post..."
                    rows={3}
                    className="border-secondary focus:border-green resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content Editor with Preview Tabs */}
            <Card className="border-secondary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">Content</CardTitle>
                    <CardDescription className="text-primary/60">Build your blog post with content blocks</CardDescription>
                  </div>
                  <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as "edit" | "preview")}>
                    <TabsList>
                      <TabsTrigger value="edit" className="gap-1">
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-1">
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {activeTab === "edit" ? (
                  <BlogContentEditor
                    content={content}
                    onChange={setContent}
                    customFonts={customFonts}
                    disabled={isSubmitting}
                  />
                ) : (
                  <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg">
                    <BlogContentRenderer content={content} customFonts={customFonts} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar (1 col) */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Cover Image</CardTitle>
                <CardDescription className="text-primary/60">Featured image for your post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-secondary rounded-lg p-4 text-center">
                  {coverImagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeCoverImage}
                        className="border-secondary text-primary hover:bg-secondary/50"
                        disabled={isSubmitting}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="h-10 w-10 text-primary/30 mx-auto" />
                      <Label htmlFor="coverImage" className="cursor-pointer">
                        <span className="text-primary hover:text-green text-sm">Click to upload</span>
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </Label>
                      <p className="text-xs text-primary/60">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Tags</CardTitle>
                <CardDescription className="text-primary/60">Categorize your post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="border-secondary focus:border-green"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary text-primary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-500"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <CustomFontsManager
              fonts={customFonts}
              onChange={setCustomFonts}
              disabled={isSubmitting}
            />

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="text-primary">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-primary/60">
                  {formData.published
                    ? "This post will be visible to visitors"
                    : "Save as draft to publish later"}
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 bg-green hover:bg-green/90 text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : formData.published ? (
                  "Publish"
                ) : (
                  "Save Draft"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
