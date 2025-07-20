"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  Loader2,
  Palette,
  SettingsIcon,
  Mail,
  Shield,
  Download,
  Upload,
  Eye,
  EyeOff,
  Globe,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsData {

  // Appearance Settings
  theme: "light" | "dark" | "system"
  accentColor: string

  // Portfolio Settings
  projectsPerPage: number
  experiencesPerPage: number
  showAvailabilityStatus: boolean
  availabilityMessage: string

  // Contact Settings
  emailNotifications: boolean
  contactFormEnabled: boolean
  autoReplyEnabled: boolean
  autoReplyMessage: string

  // Privacy Settings
  showEmail: boolean
  showLocation: boolean
  analyticsEnabled: boolean
}

const defaultSettings: SettingsData = {
  theme: "system",
  accentColor: "#10b981",
  projectsPerPage: 6,
  experiencesPerPage: 5,
  showAvailabilityStatus: true,
  availabilityMessage: "Available for new opportunities",
  emailNotifications: true,
  contactFormEnabled: true,
  autoReplyEnabled: false,
  autoReplyMessage: "Thank you for your message! I'll get back to you soon.",
  showEmail: true,
  showLocation: true,
  analyticsEnabled: false,
}

export default function SettingsPage() {
  const { toast } = useToast()

  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // CV/Resume upload states
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [currentCvName, setCurrentCvName] = useState<string>("")
  const [uploadingCv, setUploadingCv] = useState(false)

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {

        await new Promise((resolve) => setTimeout(resolve, 1000))

        setSettings(defaultSettings)
        setCurrentCvName("cv.pdf") 
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          title: "Error Loading Settings",
          description: "Failed to load your settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePasswordChange = (key: keyof typeof passwordData, value: string) => {
    setPasswordData((prev) => ({ ...prev, [key]: value }))
  }

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.includes("pdf") && !file.type.includes("doc")) {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF or DOC file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setCvFile(file)
    }
  }

  const uploadCv = async () => {
    if (!cvFile) return

    setUploadingCv(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCurrentCvName(cvFile.name)
      setCvFile(null)

      toast({
        title: "CV Updated",
        description: "Your CV has been uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading CV:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload CV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingCv(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const exportData = async () => {
    try {
      const data = {
        settings,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-settings-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data Exported",
        description: "Your settings have been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    )
  }

  const isPasswordFormValid =
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmPassword &&
    passwordData.newPassword === passwordData.confirmPassword

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-primary/70 mt-2">Manage your portfolio and account preferences</p>
      </div>

      <form onSubmit={handleSettingsSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">


            {/* Appearance Settings */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription className="text-primary/60">Customize how your portfolio looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-primary">
                    Theme
                  </Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "system") => handleSettingChange("theme", value)}
                    disabled={saving}
                  >
                    <SelectTrigger className="border-secondary focus:border-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accentColor" className="text-primary">
                    Accent Color
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                      className="w-16 h-10 border-secondary"
                      disabled={saving}
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => handleSettingChange("accentColor", e.target.value)}
                      placeholder="#10b981"
                      className="border-secondary focus:border-green"
                      disabled={saving}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Settings */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Portfolio Display
                </CardTitle>
                <CardDescription className="text-primary/60">Control how your content is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectsPerPage" className="text-primary">
                      Projects Per Page
                    </Label>
                    <Select
                      value={settings.projectsPerPage.toString()}
                      onValueChange={(value) => handleSettingChange("projectsPerPage", Number.parseInt(value))}
                      disabled={saving}
                    >
                      <SelectTrigger className="border-secondary focus:border-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experiencesPerPage" className="text-primary">
                      Experiences Per Page
                    </Label>
                    <Select
                      value={settings.experiencesPerPage.toString()}
                      onValueChange={(value) => handleSettingChange("experiencesPerPage", Number.parseInt(value))}
                      disabled={saving}
                    >
                      <SelectTrigger className="border-secondary focus:border-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showAvailabilityStatus"
                      checked={settings.showAvailabilityStatus}
                      onCheckedChange={(checked) => handleSettingChange("showAvailabilityStatus", checked)}
                      disabled={saving}
                    />
                    <Label htmlFor="showAvailabilityStatus" className="text-primary">
                      Show availability status
                    </Label>
                  </div>

                  {settings.showAvailabilityStatus && (
                    <div>
                      <Label htmlFor="availabilityMessage" className="text-primary">
                        Availability Message
                      </Label>
                      <Input
                        id="availabilityMessage"
                        value={settings.availabilityMessage}
                        onChange={(e) => handleSettingChange("availabilityMessage", e.target.value)}
                        placeholder="Available for new opportunities"
                        className="border-secondary focus:border-green"
                        disabled={saving}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CV/Resume Management */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  CV/Resume
                </CardTitle>
                <CardDescription className="text-primary/60">Manage your downloadable CV/Resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCvName && (
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <p className="text-sm text-primary">
                      Current CV: <span className="font-medium">{currentCvName}</span>
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="cvUpload" className="text-primary">
                    Upload New CV
                  </Label>
                  <Input
                    id="cvUpload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvUpload}
                    className="border-secondary focus:border-green"
                    disabled={saving || uploadingCv}
                  />
                  <p className="text-xs text-primary/60 mt-1">PDF, DOC, or DOCX up to 5MB</p>
                </div>

                {cvFile && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-primary flex-1">Ready to upload: {cvFile.name}</p>
                    <Button
                      type="button"
                      onClick={uploadCv}
                      disabled={uploadingCv}
                      className="bg-green hover:bg-green/90 text-white"
                    >
                      {uploadingCv ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Security Settings */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription className="text-primary/60">Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-primary">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className="border-secondary focus:border-green pr-10"
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={saving}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-primary">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className="border-secondary focus:border-green pr-10"
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={saving}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-primary">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className="border-secondary focus:border-green pr-10"
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={saving}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={!isPasswordFormValid || saving}
                    className="w-full bg-green hover:bg-green/90 text-white disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact & Notifications */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact & Notifications
                </CardTitle>
                <CardDescription className="text-primary/60">
                  Manage contact form and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    disabled={saving}
                  />
                  <Label htmlFor="emailNotifications" className="text-primary">
                    Email notifications for new messages
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="contactFormEnabled"
                    checked={settings.contactFormEnabled}
                    onCheckedChange={(checked) => handleSettingChange("contactFormEnabled", checked)}
                    disabled={saving}
                  />
                  <Label htmlFor="contactFormEnabled" className="text-primary">
                    Enable contact form
                  </Label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoReplyEnabled"
                      checked={settings.autoReplyEnabled}
                      onCheckedChange={(checked) => handleSettingChange("autoReplyEnabled", checked)}
                      disabled={saving}
                    />
                    <Label htmlFor="autoReplyEnabled" className="text-primary">
                      Auto-reply to contact form submissions
                    </Label>
                  </div>

                  {settings.autoReplyEnabled && (
                    <div>
                      <Label htmlFor="autoReplyMessage" className="text-primary">
                        Auto-reply Message
                      </Label>
                      <Textarea
                        id="autoReplyMessage"
                        value={settings.autoReplyMessage}
                        onChange={(e) => handleSettingChange("autoReplyMessage", e.target.value)}
                        placeholder="Thank you for your message! I'll get back to you soon."
                        rows={3}
                        className="border-secondary focus:border-green resize-none"
                        disabled={saving}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="border-secondary">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
                <CardDescription className="text-primary/60">
                  Control what information is publicly visible
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showEmail"
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
                    disabled={saving}
                  />
                  <Label htmlFor="showEmail" className="text-primary">
                    Show email address publicly
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showLocation"
                    checked={settings.showLocation}
                    onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
                    disabled={saving}
                  />
                  <Label htmlFor="showLocation" className="text-primary">
                    Show location publicly
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="analyticsEnabled"
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => handleSettingChange("analyticsEnabled", checked)}
                    disabled={saving}
                  />
                  <Label htmlFor="analyticsEnabled" className="text-primary">
                    Enable analytics tracking
                  </Label>
                </div>

                <Separator className="my-4" />

                <Button
                  type="button"
                  variant="outline"
                  onClick={exportData}
                  className="w-full border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                  disabled={saving}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={saving} className="bg-green hover:bg-green/90 text-white disabled:opacity-50">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
