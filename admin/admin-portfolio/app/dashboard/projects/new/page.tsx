"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { createProject } from "@/lib/project"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
// import { toast } from "@/components/ui/toaster"

export default function NewProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    completed: false,
    github_url: "",
    live_url: "",
  })
  
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [image_url, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies((prev) => [...prev, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !image_url) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields and upload an image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      await createProject({
        name: formData.name,
        description: formData.description,
        github_url: formData.github_url,
        completed: formData.completed,
        live_url: formData.live_url,
        technologies,
        image_url,
      })

      toast({
        title: "Project created successfully",
        description: "Your project has been added to your portfolio",
      })

      router.push("/dashboard/projects")
    } catch (error) {
      console.error('Error creating project:', error)
      toast({
        title: "Error creating project",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const isFormValid = formData.name && formData.description && image_url;

  const handleCompletedChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      completed: checked,
    }))
  }


  // const navigate = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hover:bg-secondary/50" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
          </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Add New Project</h1>
          <p className="text-primary/70 mt-2">Create a new project for your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Project Details</CardTitle>
                <CardDescription className="text-primary/60">Basic information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-primary">
                    Project Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="My Awesome Project"
                    className="border-secondary focus:border-green"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-primary">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project, its features, and what makes it special..."
                    rows={4}
                    className="border-secondary focus:border-green resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="github_url" className="text-primary">
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/project"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="live_url" className="text-primary">
                    Live URL
                  </Label>
                  <Input
                    id="live_url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleInputChange}
                    placeholder="https://myproject.com"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="completed"
                    checked={formData.completed}
                    onCheckedChange={handleCompletedChange}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="completed" className="text-primary">
                    The project is complete
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Technologies</CardTitle>
                <CardDescription className="text-primary/60">Add the technologies used in this project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="e.g., React, TypeScript, Node.js"
                    className="border-secondary focus:border-green"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="button" 
                    onClick={addTechnology} 
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary text-primary">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Project Image *</CardTitle>
                <CardDescription className="text-primary/60">
                  Upload a screenshot or preview of your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Project preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeImage}
                          className="border-secondary text-primary hover:bg-secondary/50"
                          disabled={isSubmitting}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-primary/30 mx-auto" />
                        <div>
                          <Label htmlFor="image" className="cursor-pointer">
                            <span className="text-primary hover:text-green">Click to upload image</span>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isSubmitting}
                            />
                          </Label>
                          <p className="text-sm text-primary/60 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Preview</CardTitle>
                <CardDescription className="text-primary/60">How your project will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-secondary rounded-lg p-4 space-y-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <h3 className="font-semibold text-primary">{formData.name || "Project Name"}</h3>
                  <p className="text-sm text-primary/70">
                    {formData.description || "Project description will appear here..."}
                  </p>
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-secondary text-primary text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {technologies.length > 3 && (
                        <Badge variant="secondary" className="bg-secondary text-primary text-xs">
                          +{technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/projects">
            <Button 
              variant="outline" 
              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Project...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}