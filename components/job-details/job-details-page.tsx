"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"
import { JobHeader } from "./job-header"
import { JobKanban } from "./job-kanban"
import { JobTimeline } from "./job-timeline"
import { JobDetails } from "./job-details"
import { JobActions } from "./job-actions"
import { LoadingState } from "../jobs/loading-state"
import { ErrorState } from "../jobs/error-state"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutGrid, TimerIcon as Timeline, FileText } from "lucide-react"

interface JobDetailPageProps {
  jobId: string
}

type ViewMode = "kanban" | "timeline" | "details"

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [job, setJob] = useState<any>(null)
  const router = useRouter()
  const { jobApplications, isLoading, error } = useJob()

  useEffect(() => {
    const foundJob = jobApplications.find((j) => j.$id === jobId)
    if (foundJob) {
      setJob(foundJob)
    } else if (!isLoading && jobApplications.length > 0) {
      // Job not found, redirect back
      router.push("/dashboard/jobs")
    }
  }, [jobId, jobApplications, isLoading, router])

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!job) return <ErrorState error="Job not found" />

  const viewModes = [
    { id: "kanban" as const, label: "Board", icon: LayoutGrid },
    { id: "timeline" as const, label: "Timeline", icon: Timeline },
    { id: "details" as const, label: "Details", icon: FileText },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            {viewModes.map((mode) => (
              <Button
                key={mode.id}
                variant={viewMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode.id)}
                className={viewMode === mode.id ? "bg-green hover:bg-green/90 text-white" : ""}
              >
                <mode.icon className="h-4 w-4 mr-2" />
                {mode.label}
              </Button>
            ))}
          </div>
        </div>
        <JobActions job={job} />
      </div>

      {/* Job Header */}
      <JobHeader job={job} />

      {/* Content based on view mode */}
      {viewMode === "kanban" && <JobKanban job={job} />}
      {viewMode === "timeline" && <JobTimeline job={job} />}
      {viewMode === "details" && <JobDetails job={job} />}
    </div>
  )
}
