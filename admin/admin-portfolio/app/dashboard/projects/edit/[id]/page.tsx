"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useProjects } from "@/app/context/project-context"
import { Project, CreateProjectData } from "@/lib/project"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const projectId = params.id as string;

  const { getProjectById, editProject, loading: contextLoading } = useProjects();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    github_url: "",
    live_url: "",
  })
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const projectData = getProjectById(projectId)
    
    if (projectData) {
      setProject(projectData)
      setFormData({
        name: projectData.name,
        description: projectData.description,
        github_url: projectData.github_url,
        live_url: projectData.live_url,
      })
      setTechnologies(projectData.technologies)
      setImagePreview(projectData.image_url)
    } else if (!contextLoading) {
      // Project not found and context is not loading
      toast({
        title: "Project Not Found",
        description: "The project you're looking for doesn't exist.",
        variant: "destructive",
      })
      router.push("/dashboard/projects")
    }
    
    setLoading(contextLoading)
  }, [projectId, getProjectById, contextLoading, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      
      // Create preview
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
    
    if (!project) return
    
    setSaving(true)
    
    try {
      // Prepare update data
      const updateData: Partial<CreateProjectData> = {
        name: formData.name,
        description: formData.description,
        github_url: formData.github_url,
        live_url: formData.live_url,
        technologies,
      }

      // Add image file if a new one was selected
      if (imageFile) {
        updateData.image_url = imageFile
      }

      // Update the project through context
      await editProject(projectId, updateData)

      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      })

      router.push("/dashboard/projects")
    } catch (error) {
      console.error('Error updating project:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading project...
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-primary">Project Not Found</h2>
          <p className="text-primary/70">The project you're looking for doesn't exist.</p>
          <Link href="/dashboard/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isFormValid = formData.name.trim() && formData.description.trim() && (imagePreview || imageFile)

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-secondary/50 cursor-pointer flex items-center justify-center" 
          onClick={() => router.back()}
          disabled={saving}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Project</h1>
          <p className="text-primary/70 mt-2">Update your project information</p>
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                  />
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
                    disabled={saving}
                  />
                  <Button 
                    type="button" 
                    onClick={addTechnology} 
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={saving}
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
                          disabled={saving}
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
                <CardTitle className="text-primary">Project Image</CardTitle>
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
                        <div className="flex gap-2 justify-center">
                          <Label htmlFor="image" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                              asChild
                              disabled={saving}
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Change Image
                              </span>
                            </Button>
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={saving}
                            />
                          </Label>
                        </div>
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
                              disabled={saving}
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
              disabled={saving}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid || saving}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}