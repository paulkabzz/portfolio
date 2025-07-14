"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, ExternalLink, Github } from "lucide-react"
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
import { useProjects } from "@/app/context/project-context"

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

export default function ProjectsPage() {
  const { projects } = useProjects();
  // const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // useEffect(() => {
  //   const savedProjects = localStorage.getItem("portfolio-projects")
  //   if (savedProjects) {
  //     setProjects(JSON.parse(savedProjects))
  //   }
  // }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id)
    // setProjects(updatedProjects)
    localStorage.setItem("portfolio-projects", JSON.stringify(updatedProjects))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Projects</h1>
          <p className="text-primary/70 mt-2">Manage your portfolio projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-green hover:bg-green/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="border-secondary">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-secondary focus:border-green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="border-secondary hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img
                  src={project.image_url || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary text-lg">{project.name}</h3>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/projects/edit/${project.id}`}>
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
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProject(project.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <p className="text-primary/70 text-sm mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary text-primary text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button size="sm" variant="outline" className="flex-1 border-secondary bg-transparent" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button size="sm" className="flex-1 bg-green hover:bg-green/90 text-white" asChild>
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-primary/50 mt-3">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
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
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-primary/60 mb-4">
              {searchTerm
                ? `No projects match "${searchTerm}"`
                : "Start building your portfolio by adding your first project"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/projects/new">
                <Button className="bg-green hover:bg-green/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
