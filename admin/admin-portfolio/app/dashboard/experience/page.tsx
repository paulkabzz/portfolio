"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, ExternalLink, Building, Calendar } from "lucide-react"
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
// import { useExperience } from "@/app/context/experience-context"

interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: string
  endDate: string
  location: string
  companyUrl: string
  technologies: string[]
  createdAt: string
}

export default function ExperiencePage() {
//   const { experiences, loading } = useExperience();
const loading = false;
const experiences: Experience[] = [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExperiences = experiences.filter(
    (experience) =>
      experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.technologies.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const deleteExperience = (id: string) => {
    const updatedExperiences = experiences.filter((experience) => experience.id !== id);
    localStorage.setItem("portfolio-experiences", JSON.stringify(updatedExperiences));
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    const end = endDate ? new Date(endDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }) : 'Present';
    return `${start} - ${end}`;
  };

  if (loading) return <div>Loading..</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Experience</h1>
          <p className="text-primary/70 mt-2">Manage your work experience</p>
        </div>
        <Link href="/dashboard/experience/new">
          <Button className="bg-green hover:bg-green/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="border-secondary">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-4 w-4" />
            <Input
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-secondary focus:border-green"
            />
          </div>
        </CardContent>
      </Card>

      {/* Experience Grid */}
      {filteredExperiences.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="border-secondary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-secondary/50 p-2 rounded-lg">
                      <Building className="h-5 w-5 text-primary/60" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-lg">{experience.position}</h3>
                      <p className="text-primary/70 font-medium">{experience.company}</p>
                      <p className="text-primary/50 text-sm">{experience.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/dashboard/experience/edit/${experience.id}`}>
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
                          <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{experience.position} at {experience.company}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteExperience(experience.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-primary/60" />
                  <span className="text-primary/70 text-sm">
                    {formatDateRange(experience.startDate, experience.endDate)}
                  </span>
                </div>

                <p className="text-primary/70 text-sm mb-4 line-clamp-3">{experience.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {experience.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-secondary text-primary text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  {experience.companyUrl && (
                    <Button size="sm" variant="outline" className="flex-1 border-secondary bg-transparent" asChild>
                      <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Company
                      </a>
                    </Button>
                  )}
                </div>

                <p className="text-xs text-primary/50 mt-3">
                  Added: {new Date(experience.createdAt).toLocaleDateString()}
                </p>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5a3 3 0 01-3-3V9a3 3 0 013-3h4a3 3 0 013 3v5a3 3 0 01-3 3m-6 0a3 3 0 003-3V9a3 3 0 00-3-3m0 10v2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">
              {searchTerm ? "No experiences found" : "No experiences yet"}
            </h3>
            <p className="text-primary/60 mb-4">
              {searchTerm
                ? `No experiences match "${searchTerm}"`
                : "Start building your portfolio by adding your work experience"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/experience/new">
                <Button className="bg-green hover:bg-green/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Experience
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}