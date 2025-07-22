"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { MoreHorizontal, Edit, Trash2, Archive, Star, Copy, Share, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"
import { toast } from "@/hooks/use-toast"

interface JobActionsProps {
  job: any
}

export const JobActions: React.FC<JobActionsProps> = ({ job }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { deleteJobApplication, updateJobApplication } = useJob()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteJobApplication(job.$id)
      toast({ title: "Application deleted successfully" })
      router.push("/dashboard/jobs")
    } catch (error) {
      toast({ title: "Failed to delete application", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleArchive = async () => {
    try {
      await updateJobApplication(job.$id, { status: "ARCHIVED" })
      toast({title: "Application archived"})
    } catch (error) {
      toast({ title: "Failed to archive application", variant: "destructive" })
    }
  }

  const handleToggleFeatured = async () => {
    try {
      await updateJobApplication(job.$id, { featured_application: !job.featured_application })
      toast({ title: job.featured_application ? "Removed from featured" : "Added to featured" })
    } catch (error) {
      toast({ title: "Failed to update application", variant: "destructive" })
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/jobs/${job.$id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link copied to clipboard" })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.job_title} at ${job.company_name}`,
          text: `Job application for ${job.job_title} at ${job.company_name}`,
          url: `${window.location.origin}/dashboard/jobs/${job.$id}`,
        })
      } catch (error) {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push(`/dashboard/jobs/edit/${job.$id}`)}
          className="bg-green hover:bg-green/90 text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleToggleFeatured}>
              <Star className="h-4 w-4 mr-2" />
              {job.featured_application ? "Remove from Featured" : "Add to Featured"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
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
