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
import { ArrowLeft, Upload, X, Plus, Save, Loader2, Calendar, MapPin, Building, ExternalLink, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useExperience, Experience } from "@/app/context/experience-context"

// Helper function to format date for input fields
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ""
  
  try {
    // Handle various date formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    
    // Format as YYYY-MM-DD for HTML input
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date:', error)
    return ""
  }
}

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
  
  // Image handling states
  const [existingCoverImage, setExistingCoverImage] = useState<string>("")
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([])
  const [newCoverImageFile, setNewCoverImageFile] = useState<File | null>(null)
  const [newAdditionalImageFiles, setNewAdditionalImageFiles] = useState<File[]>([])
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [shouldUpdateCover, setShouldUpdateCover] = useState(false)
  const [shouldUpdateAdditional, setShouldUpdateAdditional] = useState(false)
  
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
        startDate: formatDateForInput(experienceData.startDate),
        endDate: formatDateForInput(experienceData.endDate),
        current: experienceData.current,
      })
      setSkills(experienceData.skills)
      
      // Set existing images
      if (experienceData.images.length > 0) {
        setExistingCoverImage(experienceData.images[0])
        setCoverImagePreview(experienceData.images[0])
        
        if (experienceData.images.length > 1) {
          const additionalImages = experienceData.images.slice(1)
          setExistingAdditionalImages(additionalImages)
          setAdditionalImagePreviews(additionalImages)
        }
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

      setNewCoverImageFile(file)
      setShouldUpdateCover(true)
      
      // Create preview
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
    
    // Check total count (existing + new)
    const totalCount = existingAdditionalImages.length + files.length
    if (totalCount > 5) {
      toast({
        title: "Too Many Images",
        description: `You can have a maximum of 5 additional images. Currently you have ${existingAdditionalImages.length} existing images.`,
        variant: "destructive",
      })
      return
    }
    
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

    if (validFiles.length === 0) return

    setNewAdditionalImageFiles(prev => [...prev, ...validFiles])
    setShouldUpdateAdditional(true)
    
    // Create previews for new files
    const newPreviews: string[] = []
    let loadedCount = 0
    
    validFiles.forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        newPreviews[index] = result
        loadedCount++
        
        if (loadedCount === validFiles.length) {
          // Add new previews to existing ones
          setAdditionalImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeExistingAdditionalImage = (index: number) => {
    const imageToRemove = existingAdditionalImages[index]
    setExistingAdditionalImages(prev => prev.filter((_, i) => i !== index))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
    setImagesToDelete(prev => [...prev, imageToRemove])
    setShouldUpdateAdditional(true)
  }

  const removeNewAdditionalImage = (index: number) => {
    const adjustedIndex = index - existingAdditionalImages.length
    setNewAdditionalImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex))
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index))
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
        shouldUpdateCover ? newCoverImageFile || undefined : undefined,
        shouldUpdateAdditional ? newAdditionalImageFiles : undefined
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
                    {coverImagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={coverImagePreview}
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
                  Upload up to 5 additional images for your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Images */}
                  {additionalImagePreviews.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-primary">Current Images ({additionalImagePreviews.length}/5)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {additionalImagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Additional preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (index < existingAdditionalImages.length) {
                                  removeExistingAdditionalImage(index)
                                } else {
                                  removeNewAdditionalImage(index)
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={saving}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Area */}
                  {additionalImagePreviews.length < 5 && (
                    <div className="border-2 border-dashed border-secondary rounded-lg p-6 text-center">
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-primary/30 mx-auto" />
                        <div>
                          <Label htmlFor="additionalImages" className="cursor-pointer">
                            <span className="text-primary hover:text-green">
                              {additionalImagePreviews.length === 0 ? "Click to upload additional images" : "Add more images"}
                            </span>
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
                          <p className="text-sm text-primary/60 mt-1">
                            PNG, JPG, GIF up to 10MB each ({5 - additionalImagePreviews.length} remaining)
                          </p>
                        </div>
                      </div>
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