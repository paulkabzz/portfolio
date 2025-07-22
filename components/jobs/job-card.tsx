"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MapPin,
  DollarSign,
  Calendar,
  User,
  ExternalLink,
  Edit,
  Trash2,
  Archive,
  Star,
  AlertCircle,
  Building2,
  MoreHorizontal,
  Copy,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"
import { toast } from "@/hooks/use-toast"

interface JobApplication {
  $id: string
  job_title: string
  company_name: string
  status: string
  location: string
  min_salary: number
  max_salary: number
  application_date: string
  contact_person?: string
  notes?: string
  job_url?: string
  source?: string
  featured_application?: boolean
  urgent_application?: boolean
}

interface JobCardProps {
  job: JobApplication
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { deleteJobApplication, updateJobApplication } = useJob()

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "outline" | "default" | "secondary" | "destructive"> = {
      APPLIED: "default",
      INTERVIEWING: "secondary",
      OFFER_RECEIVED: "default",
      REJECTED: "destructive",
      ARCHIVED: "outline",
    }
    return variants[status] || "outline"
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteJobApplication(job.$id)
      toast({
        title: "Success",
        description: "Application deleted successfully"
      })
      setShowDeleteDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArchive = async () => {
    try {
      await updateJobApplication(job.$id, { status: "ARCHIVED" })
      toast({
        title: "Success",
        description: "Application archived"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive application",
        variant: "destructive"
      })
    }
  }

  const handleCopyUrl = () => {
    if (job.job_url) {
      navigator.clipboard.writeText(job.job_url)
      toast({
        title: "Success",
        description: "Job URL copied to clipboard"
      })
    }
  }

  const formatSalary = (min: number, max: number) => {
    if (min === max) return `${min.toLocaleString('en-ZA', {
          style: 'currency',
          currency: 'ZAR'
    })}`
    return `${min.toLocaleString('en-ZA', {
          style: 'currency',
          currency: 'ZAR'
    })} - ${max.toLocaleString('en-ZA', {
          style: 'currency',
          currency: 'ZAR'
    })}`
  }

  return (
    <>
      <Card className="border-secondary hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-primary">{job.job_title}</h3>
                {job.featured_application && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                {job.urgent_application && <AlertCircle className="h-4 w-4 text-red-500" />}
              </div>
              <p className="text-primary font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {job.company_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(job.status)} className="bg-green/10 text-green border-green/20">
                {job.status.replace("_", " ")}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/jobs/edit/${job.$id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  {job.job_url && (
                    <>
                      <DropdownMenuItem onClick={() => window.open(job.job_url, "_blank")}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Job
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleCopyUrl}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-primary/70">
              <MapPin className="h-4 w-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-primary/70">
              <DollarSign className="h-4 w-4 mr-2" />
              {formatSalary(job.min_salary, job.max_salary)}
            </div>
            <div className="flex items-center text-sm text-primary/70">
              <Calendar className="h-4 w-4 mr-2" />
              Applied: {new Date(job.application_date).toLocaleDateString()}
            </div>
            {job.contact_person && (
              <div className="flex items-center text-sm text-primary/70">
                <User className="h-4 w-4 mr-2" />
                {job.contact_person}
              </div>
            )}
          </div>

          {job.notes && <p className="text-sm text-primary/60 mb-4 line-clamp-2">{job.notes}</p>}

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/jobs/${job.$id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            <span className="text-xs text-primary/50">Source: {job.source || "Unknown"}</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job application for {job.job_title} at {job.company_name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
