"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  Banknote,
  Calendar,
  ExternalLink,
  Star,
  AlertCircle,
  User,
  Mail,
  Clock,
} from "lucide-react"

interface JobHeaderProps {
  job: any
}

export const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPLIED: "bg-blue-500",
      INTERVIEWING: "bg-yellow-500",
      OFFER_RECEIVED: "bg-green-500",
      REJECTED: "bg-red-500",
      ARCHIVED: "bg-gray-500",
    }
    return colors[status] || "bg-gray-500"
  }

  return (
    <Card className="border-secondary">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-primary">{job.job_title}</h1>
                  {job.featured_application && <Star className="h-6 w-6 text-yellow-500 fill-current" />}
                  {job.urgent_application && <AlertCircle className="h-6 w-6 text-red-500" />}
                </div>
                <div className="flex items-center gap-2 text-xl text-primary/80 mb-4">
                  <Building2 className="h-5 w-5" />
                  {job.company_name}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(job.status)}`} />
                <Badge variant={getStatusBadgeVariant(job.status)} className="text-sm px-3 py-1">
                  {job.status.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary/60" />
                <div>
                  <p className="text-sm text-primary/60">Location</p>
                  <p className="font-medium text-primary">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Banknote className="h-5 w-5 text-primary/60" />
                <div>
                  <p className="text-sm text-primary/60">Salary Range</p>
                  <p className="font-medium text-primary">
                    {job.min_salary.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR'})} - {job.max_salary.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR'})}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary/60" />
                <div>
                  <p className="text-sm text-primary/60">Applied Date</p>
                  <p className="font-medium text-primary">{new Date(job.application_date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary/60" />
                <div>
                  <p className="text-sm text-primary/60">Days Since Applied</p>
                  <p className="font-medium text-primary">
                    {Math.floor((Date.now() - new Date(job.application_date).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="flex flex-wrap gap-4">
              {job.job_url && (
                <Button variant="outline" size="sm" onClick={() => window.open(job.job_url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Job Posting
                </Button>
              )}
              {job.contact_person && (
                <div className="flex items-center gap-2 text-sm text-primary/70">
                  <User className="h-4 w-4" />
                  {job.contact_person}
                </div>
              )}
              {job.contact_email && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${job.contact_email}`, "_blank")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {job.notes && (
            <div className="lg:w-80">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h3 className="font-medium text-primary mb-2">Notes</h3>
                <p className="text-sm text-primary/70 leading-relaxed">{job.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
