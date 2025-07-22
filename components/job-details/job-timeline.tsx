"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Users, XCircle, Calendar, FileText, AlertCircle, Plus, Edit } from "lucide-react"

interface JobTimelineProps {
  job: any
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  type: "milestone" | "interview" | "note" | "follow-up"
  status: "completed" | "upcoming" | "overdue"
  icon: React.ReactNode
}

export const JobTimeline: React.FC<JobTimelineProps> = ({ job }) => {
  // Generate timeline events
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: "application-submitted",
        title: "Application Submitted",
        description: `Applied for ${job.job_title} at ${job.company_name}`,
        date: job.application_date,
        type: "milestone",
        status: "completed",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      },
    ]

    // Add interview events
    if (job.interview_dates && job.interview_dates.length > 0) {
      job.interview_dates.forEach((date: string, index: number) => {
        const isPast = new Date(date) < new Date()
        events.push({
          id: `interview-${index}`,
          title: `Interview Round ${index + 1}`,
          description: "Technical/behavioral interview session",
          date: date,
          type: "interview",
          status: isPast ? "completed" : "upcoming",
          icon: <Users className="h-4 w-4 text-blue-500" />,
        })
      })
    }

    // Add status change events
    if (job.status === "OFFER_RECEIVED") {
      events.push({
        id: "offer-received",
        title: "Offer Received",
        description: "Job offer received and under review",
        date: job.$updatedAt,
        type: "milestone",
        status: "completed",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      })
    }

    if (job.status === "REJECTED") {
      events.push({
        id: "application-rejected",
        title: "Application Rejected",
        description: job.feedback || "Application was not successful",
        date: job.$updatedAt,
        type: "milestone",
        status: "completed",
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      })
    }

    // Add response deadline if exists
    if (job.response_deadline) {
      const isOverdue = new Date(job.response_deadline) < new Date()
      events.push({
        id: "response-deadline",
        title: "Response Deadline",
        description: "Deadline to respond to job offer",
        date: job.response_deadline,
        type: "milestone",
        status: isOverdue ? "overdue" : "upcoming",
        icon: <AlertCircle className={`h-4 w-4 ${isOverdue ? "text-red-500" : "text-orange-500"}`} />,
      })
    }

    // Sort events by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const timelineEvents = generateTimelineEvents()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Upcoming</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <Card className="border-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary">Application Timeline</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full">
                    {event.icon}
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-primary">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary/60">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-primary/70">{event.description}</p>

                    {/* Additional info based on event type */}
                    {event.type === "interview" && (
                      <div className="mt-3 p-3 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-primary/70">
                          <Calendar className="h-4 w-4" />
                          <span>Interview scheduled</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-primary/60">Days Since Applied</p>
                <p className="text-lg font-semibold text-primary">
                  {Math.floor((Date.now() - new Date(job.application_date).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-primary/60">Interview Rounds</p>
                <p className="text-lg font-semibold text-primary">{job.interview_dates?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-primary/60">Response Time</p>
                <p className="text-lg font-semibold text-primary">
                  {job.status === "APPLIED" ? "Pending" : "2-3 days"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      {job.next_steps && (
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary/70">{job.next_steps}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
