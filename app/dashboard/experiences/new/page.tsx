"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X, Plus, Loader2, Calendar, Briefcase, MapPin, Globe } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useExperience } from "@/app/context/experience-context"

export default function NewExperiencePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { createExperience } = useExperience()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    company_url: "",
    startDate: "",
    endDate: "",
    current: false,
  })
  
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCurrentToggle = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      current: checked,
      endDate: checked ? "" : prev.endDate
    }))
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCoverImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Check if adding these files would exceed the limit
    if (additionalImages.length + files.length > 4) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 4 additional images",
        variant: "destructive",
      })
      return
    }

    const validFiles: File[] = []
    let processedCount = 0

    files.forEach(file => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Please select images smaller than 10MB`,
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return
      }

      validFiles.push(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        processedCount++
        
        setAdditionalImagePreviews(prev => [...prev, result])
        
        // Update files state when all files are processed
        if (processedCount === validFiles.length) {
          setAdditionalImages(prev => [...prev, ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverImagePreview("")
  }

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.company) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const experienceData = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        company_url: formData.company_url,
        startDate: formData.startDate,
        endDate: formData.current ? "" : formData.endDate,
        current: formData.current,
        skills: skills,
        images: [], // This will be populated by the context
      }

      await createExperience(experienceData, coverImage || undefined, additionalImages)

      toast({
        title: "Experience created successfully",
        description: "Your experience has been added to your portfolio",
      })

      router.push("/dashboard/experiences")
    } catch (error) {
      console.error('Error creating experience:', error)
      toast({
        title: "Error creating experience",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.company

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="hover:bg-secondary/50" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Add New Experience</h1>
          <p className="text-primary/70 mt-2">Add a new job experience to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience Details
                </CardTitle>
                <CardDescription className="text-primary/60">Basic information about your work experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-primary">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Software Engineer"
                    className="border-secondary focus:border-green"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-primary">
                    Company *
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Google"
                    className="border-secondary focus:border-green"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-primary flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="company_url" className="text-primary flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Company Website
                  </Label>
                  <Input
                    id="company_url"
                    name="company_url"
                    type="url"
                    value={formData.company_url}
                    onChange={handleInputChange}
                    placeholder="https://www.company.com"
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-primary">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your role, responsibilities, and achievements..."
                    rows={4}
                    className="border-secondary focus:border-green resize-none"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="current"
                    checked={formData.current}
                    onCheckedChange={handleCurrentToggle}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="current" className="text-primary">
                    I currently work here
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Employment Period
                </CardTitle>
                <CardDescription className="text-primary/60">When did you work at this company?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="startDate" className="text-primary">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate" className="text-primary">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="border-secondary focus:border-green"
                    disabled={isSubmitting || formData.current}
                    placeholder={formData.current ? "Current position" : ""}
                  />
                  {formData.current && (
                    <p className="text-sm text-primary/60 mt-1">End date is disabled for current positions</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Skills & Technologies</CardTitle>
                <CardDescription className="text-primary/60">Skills you used or developed in this role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., React, Leadership, Python"
                    className="border-secondary focus:border-green"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    disabled={isSubmitting}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill} 
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary text-primary">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
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
                <CardTitle className="text-primary">Cover Image</CardTitle>
                <CardDescription className="text-primary/60">
                  Upload a main image for this experience (company logo, office photo, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                    {coverImagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeCoverImage}
                          className="border-secondary text-primary hover:bg-secondary/50"
                          disabled={isSubmitting}
                        >
                          Remove Cover Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-primary/30 mx-auto" />
                        <div>
                          <Label htmlFor="coverImage" className="cursor-pointer">
                            <span className="text-primary hover:text-green">Click to upload cover image</span>
                            <Input
                              id="coverImage"
                              type="file"
                              accept="image/*"
                              onChange={handleCoverImageUpload}
                              className="hidden"
                              disabled={isSubmitting}
                            />
                          </Label>
                          <p className="text-sm text-primary/60 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Additional Images</CardTitle>
                <CardDescription className="text-primary/60">
                  Upload up to 4 additional images (team photos, workspace, achievements, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {additionalImages.length < 4 && (
                    <div className="border-2 border-dashed border-secondary rounded-lg p-4 text-center">
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-primary/30 mx-auto" />
                        <Label htmlFor="additionalImages" className="cursor-pointer">
                          <span className="text-primary hover:text-green text-sm">Add more images</span>
                          <Input
                            id="additionalImages"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAdditionalImagesUpload}
                            className="hidden"
                            disabled={isSubmitting}
                          />
                        </Label>
                        <p className="text-xs text-primary/60">
                          {4 - additionalImages.length} remaining
                        </p>
                      </div>
                    </div>
                  )}

                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 h-6 w-6 p-0 bg-white/80 hover:bg-white"
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Preview</CardTitle>
                <CardDescription className="text-primary/60">How your experience will appear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-secondary rounded-lg p-4 space-y-3">
                  {coverImagePreview && (
                    <img
                      src={coverImagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      {formData.title || "Job Title"}
                    </h3>
                    <p className="text-sm text-primary/60 font-medium">
                      {formData.company || "Company Name"}
                      {formData.location && ` • ${formData.location}`}
                    </p>
                    <p className="text-sm text-primary/70">
                      {formData.description || "Job description will appear here..."}
                    </p>
                    {(formData.startDate || formData.endDate) && (
                      <p className="text-sm text-primary/60">
                        {formData.startDate} - {formData.current ? "Present" : formData.endDate || "End Date"}
                      </p>
                    )}
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-secondary text-primary text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {skills.length > 3 && (
                        <Badge variant="secondary" className="bg-secondary text-primary text-xs">
                          +{skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/experiences">
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
            disabled={!isFormValid || isSubmitting}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Experience...
              </>
            ) : (
              "Create Experience"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}