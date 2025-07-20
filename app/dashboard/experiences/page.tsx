"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Calendar, Clock } from "lucide-react"
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
import { useExperience } from "@/app/context/experience-context"
import ExperiencePageSkeleton from "@/components/skeletons/experience-page-skeleton"

export default function ExperiencePage() {
  const { experiences, loading, deleteExperience } = useExperience();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExperiences = experiences.filter(
    (experience) =>
      experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      experience.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    const end = current || !endDate ? 'Present' : new Date(endDate).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
    return `${start} - ${end}`;
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  if (loading) return <ExperiencePageSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Experience</h1>
          <p className="text-primary/70 mt-2">Manage your work experience</p>
        </div>
        <Link href="/dashboard/experiences/new">
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
              <CardContent className="p-0">
                {experience.coverImage && (
                  <img
                    src={experience.coverImage}
                    alt={experience.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-primary text-lg">{experience.title}</h3>
                    <div className="flex gap-1">
                      <Link href={`/dashboard/experiences/edit/${experience.id}`}>
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
                              Are you sure you want to delete "{experience.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteExperience(experience.id)}
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
                      {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                    </span>
                    {experience.current && (
                      <Badge variant="secondary" className="bg-green/10 text-green-700 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    )}
                  </div>

                  <p className="text-primary/70 text-sm mb-3 line-clamp-3">{experience.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {experience.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary text-primary text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-xs text-primary/50 mt-3">
                    Added: {new Date(experience.createdAt).toLocaleDateString()}
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
              <Link href="/dashboard/experiences/new">
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