"use client";

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, User, Plus, ExternalLink } from "lucide-react"
import Link from "next/link"
import { appwriteConfig, databases } from "@/lib/appwrite";
import { toast } from "@/hooks/use-toast";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";
import { useProjects } from "../context/project-context";
import { parseTextWithFormatting } from "@/components/utils";

interface Project {
  id: string
  name: string
  description: string
  image_url: string
  github_url: string
  live_url: string
  technologies: string[]
  createdAt: string
}

export interface PersonalInfo {
  name: string
  surname: string
  email: string
  about: string
  image_url: string
  about_image_url: string
  location: string
  phone: string
  linkedin: string
  github: string
  headline: string
  role: string
}

export default function DashboardPage() {
  // const [projects, setProjects] = useState<Project[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { projects, loading} = useProjects();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await databases.getDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.userCollectionId!,
        appwriteConfig.userDocumentId!
      )
      
      const userData = response as any
      const profileData = {
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        about: userData.about || "",
        image_url: userData.image_url || "",
        location: userData.location || "",
        phone: userData.phone || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        role: userData.role || ""
      }

      setPersonalInfo(profileData);
      
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }


  const recentProjects = projects.slice(0, 3);

  if (isLoading || loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-primary/70 mt-2">Manage your portfolio content and personal information</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{projects.length}</div>
            <p className="text-xs text-primary/60">Active portfolio projects</p>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Profile Status</CardTitle>
            <User className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green">Complete</div>
            <p className="text-xs text-primary/60">Personal information</p>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Recent Updates</CardTitle>
            <ExternalLink className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {projects.length > 0 ? new Date(projects[0]?.createdAt || Date.now()).toLocaleDateString() : "None"}
            </div>
            <p className="text-xs text-primary/60">Last project added</p>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-primary/60" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/projects/new">
              <Button size="sm" className="bg-green hover:bg-green/90 text-white">
                Add Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="border-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">Recent Projects</CardTitle>
              <CardDescription className="text-primary/60">Your latest portfolio additions</CardDescription>
            </div>
            <Link href="/dashboard/projects">
              <Button variant="outline" className="border-[#ddd] text-primary hover:bg-secondary/50 bg-transparent">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentProjects.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
              {recentProjects.map((project) => (
                <Card key={project.id} className="border-secondary">
                  <CardContent className="p-4">
                    <div className="w-full h-auto mb-5 overflow-hidden rounded-sm">
                      <img
                        src={project.image_url || "/placeholder.svg"}
                        alt={project.name}
                        className="w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-primary mb-1">{project.name}</h3>
                    <p className="text-sm text-primary/70 mb-2 line-clamp-2">{project.description}</p>
                    <div className="flex gap-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-secondary text-primary text-xs rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="px-2 py-1 bg-secondary text-primary text-xs rounded">
                          +{project.technologies.length - 2}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <p className="text-primary/60 mb-4">No projects yet</p>
              <Link href="/dashboard/projects/new">
                <Button className="bg-green hover:bg-green/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Info Preview */}
      {personalInfo && (
        <Card className="border-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-primary">Personal Information</CardTitle>
                <CardDescription className="text-primary/60">Your profile details</CardDescription>
              </div>
              <Link href="/dashboard/profile">
                <Button
                  variant="outline"
                  className="border-[#ddd] text-primary hover:bg-secondary/50 bg-transparent"
                >
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={personalInfo.image_url || "/placeholder.svg"}
                alt={`${personalInfo.name} ${personalInfo.surname}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-primary text-[1rem]">
                  {personalInfo.name} {personalInfo.surname}
                </h3>
                <p className="text-green text-[12px]">{personalInfo.email}</p>
                <p className="text-green text-[12px]">{personalInfo.phone}</p>
                <p className="text-sm text-primary/60 text-[12px]">{personalInfo.location}</p>
              </div>
            </div>
            <p className="mt-4 text-primary/70 text-[12px]">{parseTextWithFormatting(personalInfo.about)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
