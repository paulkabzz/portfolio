"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Banknote,
  Calendar,
  User,
  Mail,
  ExternalLink,
  FileText,
  MessageSquare,
  Clock,
  Target,
  Edit,
  Star,
  AlertCircle,
} from "lucide-react"

interface JobDetailsProps {
  job: any
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPLIED: "text-blue-600 bg-blue-50 border-blue-200",
      INTERVIEWING: "text-yellow-600 bg-yellow-50 border-yellow-200",
      OFFER_RECEIVED: "text-green-600 bg-green-50 border-green-200",
      REJECTED: "text-red-600 bg-red-50 border-red-200",
      ARCHIVED: "text-gray-600 bg-gray-50 border-gray-200",
    }
    return colors[status] || "text-gray-600 bg-gray-50 border-gray-200"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card className="border-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary">Job Information</CardTitle>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-primary/60">Job Title</label>
                <p className="text-primary font-medium text-[12px]">{job.job_title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-primary/60">Company</label>
                <p className="text-primary text-[12px] font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {job.company_name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-primary/60">Location</label>
                <p className="text-primary text-[12px] font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-primary/60">Source</label>
                <p className="text-primary text-[12px] font-medium">{job.source || "Unknown"}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-primary/60">Salary Range</label>
                <p className="text-primary text-[12px] font-medium flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  {formatCurrency(job.min_salary)} - {formatCurrency(job.max_salary)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-primary/60">Application Date</label>
                <p className="text-primary text-[12px] font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(job.application_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Contact Information */}
        {(job.contact_person || job.contact_email) && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.contact_person && (
                <div>
                  <label className="text-sm font-medium text-primary/60">Contact Person</label>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {job.contact_person}
                  </p>
                </div>
              )}
              {job.contact_email && (
                <div>
                  <label className="text-sm font-medium text-primary/60">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="text-primary font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {job.contact_email}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`mailto:${job.contact_email}`, "_blank")}
                    >
                      Send Email
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {job.notes && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-primary/80 leading-relaxed whitespace-pre-wrap">{job.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback */}
        {job.feedback && (
        <Card className="border-secondary">
            <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Feedback
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-primary/80 leading-relaxed text-sm whitespace-pre-wrap">
                {job.feedback}
                </div>
            </div>
            </CardContent>
        </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border ${getStatusColor(job.status)}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-current" />
                <span className="font-medium">{job.status.replace("_", " ")}</span>
              </div>
              <p className="text-sm opacity-80">
                {job.status === "APPLIED" && "Your application has been submitted and is under review."}
                {job.status === "INTERVIEWING" && "You're currently in the interview process."}
                {job.status === "OFFER_RECEIVED" && "Congratulations! You've received a job offer."}
                {job.status === "REJECTED" && "Unfortunately, your application was not successful."}
                {job.status === "ARCHIVED" && "This application has been archived."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Priority Indicators */}
        {(job.featured_application || job.urgent_application) && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.featured_application && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Featured Application</span>
                </div>
              )}
              {job.urgent_application && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Urgent Follow-up Required</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timeline Summary */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/60">Days since applied</span>
              <span className="font-medium text-primary">
                {Math.floor((Date.now() - new Date(job.application_date).getTime()) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/60">Interview rounds</span>
              <span className="font-medium text-primary">{job.interview_dates?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary/60">Last updated</span>
              <span className="font-medium text-primary">{new Date(job.$updatedAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {job.next_steps && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Target className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary/70 leading-relaxed">{job.next_steps}</p>
            </CardContent>
          </Card>
        )}

        {/* Response Deadline */}
        {job.response_deadline && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Deadline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800">
                  {new Date(job.response_deadline).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {Math.ceil((new Date(job.response_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  remaining
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
