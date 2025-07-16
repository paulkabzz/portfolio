"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, X, Plus, Save, Loader2, Calendar, MapPin, Building, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useExperience, Experience } from "@/app/context/experience-context"

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const experienceId = params.id as string;

  const { getExperience, updateExperience, loading: contextLoading } = useExperience();

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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState("")
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [experience, setExperience] = useState<Experience | null>(null)

  useEffect(() => {
    const experienceData = getExperience(experienceId)
    
    if (experienceData) {
      setExperience(experienceData)
      setFormData({
        title: experienceData.title,
        description: experienceData.description,
        company: experienceData.company,
        location: experienceData.location,
        company_url: experienceData.company_url,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        current: experienceData.current,
      })
      setSkills(experienceData.skills)
      
      // Set existing images
      if (experienceData.images.length > 0) {
        setImagePreview(experienceData.images[0])
        setAdditionalImagePreviews(experienceData.images.slice(1))
      }
    } else if (!contextLoading) {
      // Experience not found and context is not loading
      toast({
        title: "Experience Not Found",
        description: "The experience you're looking for doesn't exist.",
        variant: "destructive",
      })
      router.push("/dashboard/experiences")
    }
    
    setLoading(contextLoading)
  }, [experienceId, getExperience, contextLoading, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCurrentChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      current: checked,
      endDate: checked ? "" : prev.endDate
    }))
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file.",
          variant: "destructive",
        })
        return
      }

      setCoverImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} is too large. Please select images smaller than 10MB.`,
          variant: "destructive",
        })
        return false
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image file.`,
          variant: "destructive",
        })
        return false
      }
      
      return true
    })

    setAdditionalImageFiles(validFiles)
    
    // Create previews
    const previews: string[] = []
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        previews.push(result)
        if (previews.length === validFiles.length) {
          setAdditionalImagePreviews(previews)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!experience) return
    
    setSaving(true)
    
    try {
      // Prepare update data
      const updateData: Partial<Experience> = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        company_url: formData.company_url,
        startDate: formData.startDate,
        endDate: formData.current ? "" : formData.endDate,
        current: formData.current,
        skills,
      }

      // Update the experience through context
      await updateExperience(
        experienceId, 
        updateData, 
        coverImageFile || undefined, 
        additionalImageFiles.length > 0 ? additionalImageFiles : undefined
      )

      toast({
        title: "Experience Updated",
        description: "Your experience has been updated successfully.",
      })

      router.push("/dashboard/experiences")
    } catch (error) {
      console.error('Error updating experience:', error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update experience. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading experience...
        </div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-primary">Experience Not Found</h2>
          <p className="text-primary/70">The experience you're looking for doesn't exist.</p>
          <Link href="/dashboard/experiences">
            <Button variant="outline">Back to Experiences</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isFormValid = formData.title.trim() && formData.description.trim() && (formData.company || "").trim() && formData.startDate && (formData.current || formData.endDate)

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-secondary/50 cursor-pointer flex items-center justify-center" 
          onClick={() => router.back()}
          disabled={saving}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-primary">Edit Experience</h1>
          <p className="text-primary/70 mt-2">Update your experience information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Experience Details</CardTitle>
                <CardDescription className="text-primary/60">Basic information about your experience</CardDescription>
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
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="border-secondary focus:border-green"
                    required
                    disabled={saving}
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
                    placeholder="e.g., Google, Microsoft, Startup Inc"
                    className="border-secondary focus:border-green"
                    required
                    disabled={saving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-primary">
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, CA"
                      className="border-secondary focus:border-green"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_url" className="text-primary">
                      Company Website
                    </Label>
                    <Input
                      id="company_url"
                      name="company_url"
                      type="url"
                      value={formData.company_url}
                      onChange={handleInputChange}
                      placeholder="https://company.com"
                      className="border-secondary focus:border-green"
                      disabled={saving}
                    />
                  </div>
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
                    disabled={saving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-primary">
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="border-secondary focus:border-green"
                      required
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate" className="text-primary">
                      End Date {formData.current && "(Optional)"}
                    </Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="border-secondary focus:border-green"
                      disabled={formData.current || saving}
                      required={!formData.current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="current"
                    checked={formData.current}
                    onCheckedChange={handleCurrentChange}
                    disabled={saving}
                  />
                  <Label htmlFor="current" className="text-primary">
                    I currently work here
                  </Label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary">Skills</CardTitle>
                <CardDescription className="text-primary/60">Add the skills you gained or used in this experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., JavaScript, Project Management, Leadership"
                    className="border-secondary focus:border-green"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    disabled={saving}
                  />
                  <Button 
                    type="button" 
                    onClick={addSkill} 
                    className="bg-green hover:bg-green/90 text-white"
                    disabled={saving}
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
                          disabled={saving}
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
                  Upload a cover image for your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="flex gap-2 justify-center">
                          <Label htmlFor="coverImage" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                              asChild
                              disabled={saving}
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Change Cover
                              </span>
                            </Button>
                            <Input
                              id="coverImage"
                              type="file"
                              accept="image/*"
                              onChange={handleCoverImageUpload}
                              className="hidden"
                              disabled={saving}
                            />
                          </Label>
                        </div>
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
                              disabled={saving}
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
                  Upload additional images for your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                    {additionalImagePreviews.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {additionalImagePreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Additional preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                        <div className="flex gap-2 justify-center">
                          <Label htmlFor="additionalImages" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                              asChild
                              disabled={saving}
                            >
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                Change Images
                              </span>
                            </Button>
                            <Input
                              id="additionalImages"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleAdditionalImagesUpload}
                              className="hidden"
                              disabled={saving}
                            />
                          </Label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-primary/30 mx-auto" />
                        <div>
                          <Label htmlFor="additionalImages" className="cursor-pointer">
                            <span className="text-primary hover:text-green">Click to upload additional images</span>
                            <Input
                              id="additionalImages"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleAdditionalImagesUpload}
                              className="hidden"
                              disabled={saving}
                            />
                          </Label>
                          <p className="text-sm text-primary/60 mt-1">PNG, JPG, GIF up to 10MB each</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-primary/60">
                        {formData.company || "Company Name"}
                        {formData.company_url && (
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        )}
                      </span>
                    </div>
                    {formData.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/60" />
                        <span className="text-sm text-primary/60">{formData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      <span className="text-sm text-primary/60">
                        {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : "Start date"} - 
                        {formData.current ? " Present" : 
                         formData.endDate ? ` ${new Date(formData.endDate).toLocaleDateString()}` : " End date"}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-primary">{formData.title || "Job Title"}</h3>
                  <p className="text-sm text-primary/70">
                    {formData.description || "Experience description will appear here..."}
                  </p>
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
              disabled={saving}
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isFormValid || saving}
            className="bg-green hover:bg-green/90 text-white disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Experience
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}