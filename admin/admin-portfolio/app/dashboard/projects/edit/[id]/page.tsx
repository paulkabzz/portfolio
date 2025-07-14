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
import { ArrowLeft, Upload, X, Plus, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description: string
  image: string
  githubUrl: string
  liveUrl: string
  technologies: string[]
  createdAt: string
}

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const projectId = params.id as string

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    githubUrl: "",
    liveUrl: "",
  })
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio-projects")
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects)
      const project = projects.find((p) => p.id === projectId)

      if (project) {
        setFormData({
          name: project.name,
          description: project.description,
          image: project.image,
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl,
        })
        setTechnologies(project.technologies)
        setImagePreview(project.image)
      } else {
        router.push("/dashboard/projects")
      }
    }
    setLoading(false)
  }, [projectId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setFormData((prev) => ({ ...prev, image: result }))
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const savedProjects = localStorage.getItem("portfolio-projects")
    if (savedProjects) {
      const projects: Project[] = JSON.parse(savedProjects)
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, ...formData, technologies } : project,
      )

      localStorage.setItem("portfolio-projects", JSON.stringify(updatedProjects))

      toast({
        title: "Project Updated",
        description: "Your project has been updated successfully.",
      })

      router.push("/dashboard/projects")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary">Loading...</div>
      </div>
    )
  }

  const isFormValid = formData.name && formData.description && formData.image

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" className="hover:bg-secondary/50 cursor-pointer flex items-center justify-center" onClick={() => router.back()}>
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
                  />
                </div>

                <div>
                  <Label htmlFor="githubUrl" className="text-primary">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/project"
                    className="border-secondary focus:border-green"
                  />
                </div>

                <div>
                  <Label htmlFor="liveUrl" className="text-primary">
                    Live URL
                  </Label>
                  <Input
                    id="liveUrl"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://myproject.com"
                    className="border-secondary focus:border-green"
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
                  />
                  <Button type="button" onClick={addTechnology} className="bg-green hover:bg-green/90 text-white">
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
                          src={imagePreview || "/placeholder.svg"}
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
                      src={imagePreview || "/placeholder.svg"}
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
            <Button variant="outline" className="border-secondary text-primary hover:bg-secondary/50 bg-transparent">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Update Project
          </Button>
        </div>
      </form>
    </div>
  )
}
