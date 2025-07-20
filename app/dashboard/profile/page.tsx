"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Save, User, Loader2, Image } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { databases, storage, appwriteConfig } from "@/lib/appwrite"
import { ID } from "appwrite"
import ProfileLoadingSkeleton from "@/components/skeletons/profile-skeleton"
import { parseTextWithFormatting } from "@/components/utils"

interface PersonalInfo {
  name: string
  surname: string
  email: string
  about: string
  image_url: string
  about_image_url: string
  location: string
  phone: string
  linkedin: string
  github: string
  headline: string
  role: string
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PersonalInfo>({
    name: "",
    surname: "",
    email: "",
    about: "",
    image_url: "",
    about_image_url: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
    headline: "",
    role: ""
  });

  const [originalData, setOriginalData] = useState<PersonalInfo>({
    name: "",
    surname: "",
    email: "",
    about: "",
    image_url: "",
    about_image_url: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
    headline: "",
    role: ""
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [aboutImagePreview, setAboutImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAboutFile, setSelectedAboutFile] = useState<File | null>(null);

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await databases.getDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.userCollectionId!,
        appwriteConfig.userDocumentId!
      )
      
      const userData = response as any
      const profileData = {
        name: userData.name || "",
        surname: userData.surname || "",
        email: userData.email || "",
        about: userData.about || "",
        image_url: userData.image_url || "",
        about_image_url: userData.about_image_url || "",
        location: userData.location || "",
        phone: userData.phone || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        headline: userData.headline || "",
        role: userData.role || ""
      }
      
      setFormData(profileData)
      setOriginalData(profileData) // Store original data for comparison
      setImagePreview(userData.image_url || "")
      setAboutImagePreview(userData.about_image_url || "")
    } catch (error) {
      console.error("Error loading user profile:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedAboutFile(file)
    
    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setAboutImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const uploadImageToAppwrite = async (file: File, isAboutImage: boolean = false): Promise<string> => {
    try {
      if (isAboutImage) {
        setIsUploadingAboutImage(true)
      } else {
        setIsUploadingImage(true)
      }
      
      // Delete previous image if exists
      const existingImageUrl = isAboutImage ? formData.about_image_url : formData.image_url
      if (existingImageUrl) {
        try {
          // Extrct file ID from URL if it's an Appwrite URL
          const urlParts = existingImageUrl.split('/')
          const fileId = urlParts[urlParts.length - 2] // Usually the second to last part
          await storage.deleteFile(appwriteConfig.userImageStorage!, fileId)
        } catch (deleteError) {
          console.warn("Could not delete previous image:", deleteError)
        }
      }

      // Upload new image
      const uploadResponse = await storage.createFile(
        appwriteConfig.userImageStorage!,
        ID.unique(),
        file
      )

      // Get file view URL
      const fileUrl = storage.getFileView(
        appwriteConfig.userImageStorage!,
        uploadResponse.$id
      )

      return fileUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    } finally {
      if (isAboutImage) {
        setIsUploadingAboutImage(false)
      } else {
        setIsUploadingImage(false)
      }
    }
  }

  const getChangedFields = () => {
    const changes: Partial<PersonalInfo> = {}
    
    // Compare each field with original data
    Object.keys(formData).forEach((key) => {
      const typedKey = key as keyof PersonalInfo
      if (formData[typedKey] !== originalData[typedKey]) {
        changes[typedKey] = formData[typedKey]
      }
    })
    
    return changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image_url
      let aboutImageUrl = formData.about_image_url
      let hasImageChanged = false
      let hasAboutImageChanged = false

      // Upload new profile image if selected
      if (selectedFile) {
        imageUrl = await uploadImageToAppwrite(selectedFile, false)
        hasImageChanged = true
      }

      // Upload new about image if selected
      if (selectedAboutFile) {
        aboutImageUrl = await uploadImageToAppwrite(selectedAboutFile, true)
        hasAboutImageChanged = true
      }

      // Get only changed fields
      const changedFields = getChangedFields()
      
      // If images changed, include them in the update
      if (hasImageChanged) {
        changedFields.image_url = imageUrl
      }
      if (hasAboutImageChanged) {
        changedFields.about_image_url = aboutImageUrl
      }

      // Only proceed if there are changes
      if (Object.keys(changedFields).length === 0) {
        toast({
          title: "No Changes",
          description: "No changes were made to your profile.",
        })
        setIsLoading(false)
        return
      }

      // console.log("Updating fields:", changedFields) // For debugging

      // Update only changed fields in Appwrite
      await databases.updateDocument(
        appwriteConfig.databaseId!,
        appwriteConfig.userCollectionId!,
        appwriteConfig.userDocumentId!,
        changedFields
      )

      // Update local state
      const updatedFormData = { ...formData, image_url: imageUrl, about_image_url: aboutImageUrl }
      setFormData(updatedFormData)
      setOriginalData(updatedFormData) // Update original data to new state
      setSelectedFile(null)
      setSelectedAboutFile(null)

      toast({
        title: "Profile Updated",
        description: `Updated ${Object.keys(changedFields).join(', ')} successfully.`,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !formData.name) {
    return (
      <ProfileLoadingSkeleton/>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Personal Information</h1>
        <p className="text-primary/70 mt-2">Manage your profile details and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Images */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Profile Images</CardTitle>
              <CardDescription className="text-primary/60">Upload your professional and about photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-primary mb-2">Profile Picture</h3>
                </div>
                <div className="relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-secondary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <Label htmlFor="profileImage" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                    disabled={isUploadingImage}
                    asChild
                  >
                    <span>
                      {isUploadingImage ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 mr-2" />
                      )}
                      {isUploadingImage ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </Label>
              </div>

              {/* About Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-primary mb-2">About Image</h3>
                </div>
                <div className="relative">
                  {aboutImagePreview ? (
                    <img
                      src={aboutImagePreview}
                      alt="About"
                      className="w-24 h-24 rounded-full object-cover border-4 border-secondary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-secondary flex items-center justify-center">
                      <Image className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  {isUploadingAboutImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <Label htmlFor="aboutImage" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                    disabled={isUploadingAboutImage}
                    asChild
                  >
                    <span>
                      {isUploadingAboutImage ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-3 w-3 mr-2" />
                      )}
                      {isUploadingAboutImage ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                  <Input
                    id="aboutImage"
                    type="file"
                    accept="image/*"
                    onChange={handleAboutImageUpload}
                    className="hidden"
                    disabled={isUploadingAboutImage}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="border-secondary lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Basic Information</CardTitle>
              <CardDescription className="text-primary/60">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name" className="text-primary font-bold">
                    First Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="border-secondary focus:border-green"
                  />
                </div>
                <div>
                  <Label htmlFor="surname" className="text-primary font-bold">
                    Last Name
                  </Label>
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="border-secondary focus:border-green"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                <Label htmlFor="email" className="text-primary font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  className="border-secondary focus:border-green"
                />
                </div>

                <div>
                  <Label htmlFor="headline" className="text-primary font-bold">
                    Headline
                  </Label>
                  <Input
                    id="headline"
                    name="headline"
                    type="text"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="Hello, I'm <John Doe>"
                    className="border-secondary focus:border-green"
                  />
                </div>
              </div>

              
                <div>
                  <Label htmlFor="role" className="text-primary font-bold">
                    Role/Position or Title
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="Computer Science and Engineering Student"
                    className="border-secondary focus:border-green"
                  />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone" className="text-primary font-bold">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+27 67 123 4567"
                    className="border-secondary focus:border-green"
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-primary font-bold">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Cape Town, Western Cape"
                    className="border-secondary focus:border-green"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="about" className="text-primary font-bold">
                  About
                </Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell visitors about yourself, your skills, and what you're passionate about..."
                  rows={4}
                  className="border-secondary focus:border-green resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Social Links</CardTitle>
            <CardDescription className="text-primary/60">Your online presence and portfolio links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="linkedin" className="text-primary">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="border-secondary focus:border-green"
                />
              </div>
              <div>
                <Label htmlFor="github" className="text-primary">
                  GitHub
                </Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="border-secondary focus:border-green"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-md font-bold text-primary">Preview</CardTitle>
            <CardDescription className="text-primary/60 text-[12px]">
              How your information will appear on your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6 p-6 bg-white border border-secondary rounded-lg">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-10 w-10 text-primary/30" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-md font-bold text-primary mb-1">
                  {formData.name || "First"} {formData.surname || "Last"}
                </h2>
                {formData.location && <p className="text-primary mb-2 text-[12px] font-bold">{formData.location}</p>}
                <p className="text-primary/70 mb-3 text-[12px]">{parseTextWithFormatting(formData.about) || "Your about will appear here..."}</p>
                <div className="flex gap-4 text-sm">
                  {formData.email && <span className="text-green text-[12px]">{formData.email}</span>}
                  {formData.phone && <span className="text-green text-[12px]">{formData.phone}</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-green hover:bg-green/90 text-white"
            disabled={isLoading || isUploadingImage || isUploadingAboutImage}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}