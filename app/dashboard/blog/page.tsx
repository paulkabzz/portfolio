"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useBlogs } from "@/app/context/blog-context"
import { toast } from "@/hooks/use-toast"

export default function BlogPage() {
  const { blogs, loading, removeBlog } = useBlogs();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const deleteBlog = async (id: string) => {
    try {
      await removeBlog(id);
      toast({
        title: "Blog Deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to delete blog",
        variant: "destructive"
      });
      throw error;
    }
  }

  if (loading) return <div className="text-primary">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Blog</h1>
          <p className="text-primary/70 mt-2">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blog/new">
          <Button className="bg-green hover:bg-green/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="border-secondary">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-secondary focus:border-green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} className="border-secondary hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary text-lg line-clamp-1">{blog.title}</h3>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/blog/edit/${blog.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-secondary/50">
                          <Edit className="h-4 w-4 text-primary/60" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBlog(blog.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {blog.published ? (
                      <Badge variant="secondary" className="bg-green/10 text-green-700 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-600/10 text-yellow-700 text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>

                  <p className="text-primary/70 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-secondary text-primary text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-secondary text-primary text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-primary/50 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-secondary">
          <CardContent className="text-center py-12">
            <div className="text-primary/30 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchTerm ? "No blog posts found" : "No blog posts yet"}
            </h3>
            <p className="text-primary/60 mb-4">
              {searchTerm
                ? `No posts match "${searchTerm}"`
                : "Start sharing your thoughts by creating your first blog post"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/blog/new">
                <Button className="bg-green hover:bg-green/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
