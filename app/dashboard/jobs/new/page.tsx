"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  X,
  Loader2,
  Building2,
  MapPin,
  DollarSign,
  User,
  Calendar,
  Star,
  AlertCircle,
  Upload,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useJob } from "@/app/context/job-context"

type BadgeVariant = "default" | "destructive" | "outline" | "secondary"

export default function NewJobApplicationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createJobApplication, cvs, uploadCV, isLoading: contextLoading } = useJob()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingCV, setIsUploadingCV] = useState(false)
  const [showCVUpload, setShowCVUpload] = useState(false)
  const [newCVName, setNewCVName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    job_url: "",
    application_date: "",
    status: "APPLIED" as "APPLIED" | "INTERVIEWING" | "OFFER_RECEIVED" | "REJECTED" | "ARCHIVED",
    location: "",
    contact_person: "",
    contact_email: null,
    notes: "",
    source: "",
    feedback: "",
    min_salary: 0,
    max_salary: 0,
    cv_id: "",
    fk_cv_id: "",
    next_steps: "",
    response_deadline: "",
    featured_application: false,
    urgent_application: false,
  })

  const [interview_dates, setInterviewDates] = useState<string[]>([])
  const [newInterviewDate, setNewInterviewDate] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData((prev) => ({ ...prev, [name]: numValue }))
  }

  const addInterviewDate = () => {
    if (newInterviewDate.trim() && !interview_dates.includes(newInterviewDate.trim())) {
      setInterviewDates((prev) => [...prev, newInterviewDate.trim()])
      setNewInterviewDate("")
    }
  }

  const removeInterviewDate = (date: string) => {
    setInterviewDates((prev) => prev.filter((d) => d !== date))
  }

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !newCVName.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file and provide a CV name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploadingCV(true)
      const newCV = await uploadCV(file, newCVName.trim())
      setFormData((prev) => ({ 
        ...prev, 
        cv_id: newCV.cv_id,
        fk_cv_id: newCV.$id 
      }))
      setShowCVUpload(false)
      setNewCVName("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      toast({
        title: "CV uploaded successfully",
        description: "Your CV has been uploaded and selected",
      })
    } catch (error) {
      console.error("Error uploading CV:", error)
      toast({
        title: "Error uploading CV",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsUploadingCV(false)
    }
  }

  const handleCVSelect = (cvId: string) => {
    const selectedCV = cvs.find(cv => cv.$id === cvId)
    if (selectedCV) {
      setFormData((prev) => ({ 
        ...prev, 
        cv_id: selectedCV.cv_id,
        fk_cv_id: selectedCV.$id 
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.job_title || !formData.company_name || !formData.application_date || !formData.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill in job title, company name, application date, and location",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const jobApplicationData = {
        ...formData,
        interview_dates,
      }

      await createJobApplication(jobApplicationData)

      toast({
        title: "Job application created successfully",
        description: "Your job application has been added to your tracker",
      })

      router.push("/dashboard/jobs")
    } catch (error) {
      console.error("Error creating job application:", error)
      toast({
        title: "Error creating job application",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.job_title && formData.company_name && formData.application_date && formData.location

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    const variants: Record<string, BadgeVariant> = {
      APPLIED: "default",
      INTERVIEWING: "secondary",
      OFFER_RECEIVED: "default",
      REJECTED: "destructive",
      ARCHIVED: "outline",
    }
    return variants[status] || "outline"
  }

  const selectedCV = cvs.find(cv => cv.$id === formData.fk_cv_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover:bg-secondary/50" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Add New Job Application</h1>
          <p className="text-primary/70 mt-2">Track a new job application in your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Job Details</CardTitle>
                <CardDescription className="text-primary/60">Basic information about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name" className="text-primary">
                      Company Name *
                    </Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="TechCorp Inc."
                      className="border-secondary focus:border-green"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_title" className="text-primary">
                      Job Title *
                    </Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title}
                      onChange={handleInputChange}
                      placeholder="Senior Full Stack Developer"
                      className="border-secondary focus:border-green"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="job_url" className="text-primary">
                    Job URL
                  </Label>
                  <Input
                    id="job_url"
                    name="job_url"
                    type="url"
                    value={formData.job_url}
                    onChange={handleInputChange}
                    placeholder="https://company.com/careers/job-posting"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="application_date" className="text-primary">
                      Application Date *
                    </Label>
                    <Input
                      id="application_date"
                      name="application_date"
                      type="date"
                      value={formData.application_date}
                      onChange={handleInputChange}
                      className="border-secondary focus:border-green"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-primary">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "APPLIED" | "INTERVIEWING" | "OFFER_RECEIVED" | "REJECTED" | "ARCHIVED") => 
                        setFormData({ ...formData, status: value })
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="border-secondary focus:border-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPLIED">Applied</SelectItem>
                        <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                        <SelectItem value="OFFER_RECEIVED">Offer Received</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-primary">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Remote / Cape Town, SA"
                    className="border-secondary focus:border-green"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_salary" className="text-primary">
                      Minimum Salary
                    </Label>
                    <Input
                      id="min_salary"
                      name="min_salary"
                      type="number"
                      value={formData.min_salary || ""}
                      onChange={(e) => handleNumberChange("min_salary", e.target.value)}
                      placeholder="80000"
                      className="border-secondary focus:border-green"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_salary" className="text-primary">
                      Maximum Salary
                    </Label>
                    <Input
                      id="max_salary"
                      name="max_salary"
                      type="number"
                      value={formData.max_salary || ""}
                      onChange={(e) => handleNumberChange("max_salary", e.target.value)}
                      placeholder="100000"
                      className="border-secondary focus:border-green"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="source" className="text-primary">
                    Application Source
                  </Label>
                  <Select
                    value={formData.source}
                    onValueChange={(value) => setFormData({ ...formData, source: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="border-secondary focus:border-green">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Company Website">Company Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Job Board">Job Board</SelectItem>
                      <SelectItem value="Recruiter">Recruiter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Contact Information</CardTitle>
                <CardDescription className="text-primary/60">Details about your contact person</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_person" className="text-primary">
                      Contact Person
                    </Label>
                    <Input
                      id="contact_person"
                      name="contact_person"
                      value={formData.contact_person}
                      onChange={handleInputChange}
                      placeholder="Sarah Johnson"
                      className="border-secondary focus:border-green"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email" className="text-primary">
                      Contact Email
                    </Label>
                    <Input
                      id="contact_email"
                      name="contact_email"
                      type="email"
                      value={formData.contact_email ?? undefined}
                      onChange={handleInputChange}
                      placeholder="sarah@company.com"
                      className="border-secondary focus:border-green"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">CV Selection</CardTitle>
                <CardDescription className="text-primary/60">Choose or upload a CV for this application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showCVUpload ? (
                  <>
                    <div>
                      <Label htmlFor="cv_select" className="text-primary">
                        Select CV
                      </Label>
                      <Select
                        value={formData.fk_cv_id}
                        onValueChange={handleCVSelect}
                        disabled={isSubmitting || contextLoading}
                      >
                        <SelectTrigger className="border-secondary focus:border-green">
                          <SelectValue placeholder="Select a CV" />
                        </SelectTrigger>
                        <SelectContent>
                          {cvs.map((cv) => (
                            <SelectItem key={cv.$id} value={cv.$id}>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {cv.cv_name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCVUpload(true)}
                      className="w-full border-secondary text-primary hover:bg-secondary/50"
                      disabled={isSubmitting}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New CV
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cv_name" className="text-primary">
                        CV Name
                      </Label>
                      <Input
                        id="cv_name"
                        value={newCVName}
                        onChange={(e) => setNewCVName(e.target.value)}
                        placeholder="Senior Developer Resume v2.1"
                        className="border-secondary focus:border-green"
                        disabled={isUploadingCV}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cv_file" className="text-primary">
                        CV File
                      </Label>
                      <Input
                        id="cv_file"
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCVUpload}
                        className="border-secondary focus:border-green"
                        disabled={isUploadingCV}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCVUpload(false)
                          setNewCVName("")
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                        className="flex-1 border-secondary text-primary hover:bg-secondary/50"
                        disabled={isUploadingCV}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {selectedCV && (
                  <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                    <FileText className="h-4 w-4 text-green" />
                    <span className="text-sm text-primary">Selected: {selectedCV.cv_name}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Interview Dates</CardTitle>
                <CardDescription className="text-primary/60">Track your interview schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={newInterviewDate}
                    onChange={(e) => setNewInterviewDate(e.target.value)}
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    onClick={addInterviewDate}
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {interview_dates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interview_dates.map((date) => (
                      <Badge key={date} variant="secondary" className="bg-secondary text-primary">
                        {new Date(date).toLocaleDateString()}
                        <button
                          type="button"
                          onClick={() => removeInterviewDate(date)}
                          className="ml-2 hover:text-red-500"
                          disabled={isSubmitting}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Additional Details</CardTitle>
                <CardDescription className="text-primary/60">Extra information and tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="response_deadline" className="text-primary">
                    Response Deadline
                  </Label>
                  <Input
                    id="response_deadline"
                    name="response_deadline"
                    type="date"
                    value={formData.response_deadline}
                    onChange={handleInputChange}
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-primary">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes about the company, role, or application process..."
                    rows={4}
                    className="border-secondary focus:border-green resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="next_steps" className="text-primary">
                    Next Steps
                  </Label>
                  <Textarea
                    id="next_steps"
                    name="next_steps"
                    value={formData.next_steps}
                    onChange={handleInputChange}
                    placeholder="What are the next steps for this application?"
                    rows={3}
                    className="border-secondary focus:border-green resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="feedback" className="text-primary">
                    Feedback Received
                  </Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Any feedback received from interviews or applications..."
                    rows={3}
                    className="border-secondary focus:border-green resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured_application"
                      checked={formData.featured_application}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured_application: checked })}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="featured_application" className="text-primary">
                      Featured Application
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgent_application"
                      checked={formData.urgent_application}
                      onCheckedChange={(checked) => setFormData({ ...formData, urgent_application: checked })}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="urgent_application" className="text-primary">
                      Urgent Application
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Preview</CardTitle>
                <CardDescription className="text-primary/60">How your application will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-secondary rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-primary">{formData.job_title || "Job Title"}</h3>
                        {formData.featured_application && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        {formData.urgent_application && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </div>
                      <p className="text-primary font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {formData.company_name || "Company Name"}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(formData.status)}
                      className="bg-green/10 text-green border-green/20"
                    >
                      {formData.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {formData.location && (
                      <div className="flex items-center text-sm text-primary/70">
                        <MapPin className="h-4 w-4 mr-2" />
                        {formData.location}
                      </div>
                    )}
                    {(formData.min_salary > 0 || formData.max_salary > 0) && (
                      <div className="flex items-center text-sm text-primary/70">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {formData.min_salary > 0 && formData.max_salary > 0 
                          ? `$${formData.min_salary.toLocaleString()} - $${formData.max_salary.toLocaleString()}`
                          : formData.min_salary > 0 
                          ? `From $${formData.min_salary.toLocaleString()}`
                          : `Up to $${formData.max_salary.toLocaleString()}`
                        }
                      </div>
                    )}
                    {formData.application_date && (
                      <div className="flex items-center text-sm text-primary/70">
                        <Calendar className="h-4 w-4 mr-2" />
                        Applied: {new Date(formData.application_date).toLocaleDateString()}
                      </div>
                    )}
                    {formData.contact_person && (
                      <div className="flex items-center text-sm text-primary/70">
                        <User className="h-4 w-4 mr-2" />
                        {formData.contact_person}
                      </div>
                    )}
                    {selectedCV && (
                      <div className="flex items-center text-sm text-primary/70">
                        <FileText className="h-4 w-4 mr-2" />
                        CV: {selectedCV.cv_name}
                      </div>
                    )}
                  </div>

                  {formData.notes && <p className="text-sm text-primary/60 line-clamp-2">{formData.notes}</p>}

                  <div className="flex justify-between items-center pt-2 border-t border-secondary">
                    <span className="text-xs text-primary/50">Source: {formData.source || "Not specified"}</span>
                    {interview_dates.length > 0 && (
                      <span className="text-xs text-primary/50">{interview_dates.length} interview(s)</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/jobs">
            <Button
              variant="outline"
              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting || isUploadingCV}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Application...
              </>
            ) : (
              "Create Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}