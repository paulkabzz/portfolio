"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
  User,
  Archive,
  Trash2,
  Reply,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Message {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  urgent: boolean
  createdAt: string
  read: boolean
  archived?: boolean
}

// Mock data - replace with actual data fetching
const mockMessages: Message[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+27 67 123 4567",
    subject: "Project Inquiry - E-commerce Website",
    message:
      "Hi there! I'm looking for a developer to help build an e-commerce website for my small business. We sell handmade crafts and need a modern, responsive site with payment integration. Could we schedule a call to discuss the project details and timeline?\n\nI've been researching different developers and your portfolio really stood out to me. The projects you've worked on show exactly the kind of quality and attention to detail I'm looking for.\n\nSome specific requirements:\n- Mobile-responsive design\n- Payment gateway integration (PayPal, Stripe)\n- Inventory management system\n- Customer reviews and ratings\n- SEO optimization\n\nMy budget is around $5,000-$8,000 and I'd like to launch within 2-3 months. Would this be something you'd be interested in discussing further?\n\nLooking forward to hearing from you!\n\nBest regards,\nJohn",
    urgent: true,
    createdAt: "2024-01-15T10:30:00Z",
    read: false,
    archived: false,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    phone: "+27 82 987 6543",
    subject: "Job Opportunity - Senior Frontend Developer",
    message:
      "Hello! I'm a recruiter at TechCorp and we have an exciting opportunity for a Senior Frontend Developer position. The role involves working with React, TypeScript, and modern web technologies. Would you be interested in learning more about this position?",
    urgent: false,
    createdAt: "2024-01-14T14:22:00Z",
    read: true,
    archived: false,
  },
  // Add other mock messages...
]

export default function MessageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const messageId = params.id as string

  const [message, setMessage] = useState<Message | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call to fetch message
    const fetchMessage = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        const foundMessage = mockMessages.find((msg) => msg.id === messageId)
        setMessage(foundMessage || null)
      } catch (error) {
        console.error("Error fetching message:", error)
        toast({
          title: "Error",
          description: "Failed to load message. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMessage()
  }, [messageId, toast])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  const handleAction = async (action: string, actionFunction: () => Promise<void>) => {
    setActionLoading(action)
    try {
      await actionFunction()
    } catch (error) {
      console.error(`Error performing ${action}:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const markAsRead = async () => {
    if (!message) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessage({ ...message, read: true })
    toast({
      title: "Message marked as read",
      description: "The message has been marked as read.",
    })
  }

  const markAsUnread = async () => {
    if (!message) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessage({ ...message, read: false })
    toast({
      title: "Message marked as unread",
      description: "The message has been marked as unread.",
    })
  }

  const archiveMessage = async () => {
    if (!message) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    setMessage({ ...message, archived: true })
    toast({
      title: "Message archived",
      description: "The message has been archived successfully.",
    })
  }

  const deleteMessage = async () => {
    if (!message) return
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: "Message deleted",
      description: "The message has been deleted successfully.",
    })
    router.push("/dashboard/messages")
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const composeReply = () => {
    if (!message) return
    const subject = message.subject.startsWith("Re:") ? message.subject : `Re: ${message.subject}`
    const body = `\n\n---\nOriginal message from ${message.name} (${message.email}):\n${message.message}`
    const mailtoUrl = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading message...
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-primary">Message Not Found</h2>
          <p className="text-primary/70">The message you're looking for doesn't exist or has been deleted.</p>
          <Link href="/dashboard/messages">
            <Button variant="outline" className="border-secondary text-primary hover:bg-secondary/50 bg-transparent">
              Back to Messages
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-secondary/50 cursor-pointer flex items-center justify-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Message Details</h1>
          <p className="text-primary/70 mt-2">View and manage this message</p>
        </div>
        <div className="flex items-center gap-2">
          {!message.read && (
            <Badge variant="secondary" className="bg-green/10 text-green border-green/20">
              Unread
            </Badge>
          )}
          {message.urgent && (
            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
              <AlertCircle className="h-3 w-3 mr-1" />
              Urgent
            </Badge>
          )}
          {message.archived && (
            <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
              Archived
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <Card className="border-secondary">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={composeReply} className="bg-green hover:bg-green/90 text-white" disabled={!!actionLoading}>
              <Reply className="h-4 w-4 mr-2" />
              Reply via Email
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleAction(message.read ? "mark-unread" : "mark-read", message.read ? markAsUnread : markAsRead)
              }
              disabled={!!actionLoading}
              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
            >
              {actionLoading === (message.read ? "mark-unread" : "mark-read") ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : message.read ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Mark as {message.read ? "Unread" : "Read"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAction("archive", archiveMessage)}
              disabled={!!actionLoading || message.archived}
              className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
            >
              {actionLoading === "archive" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              Archive
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAction("delete", deleteMessage)}
              disabled={!!actionLoading}
              className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
            >
              {actionLoading === "delete" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message Content - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Header */}
          <Card className="border-secondary">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-5 w-5 text-primary/60" />
                    <span className="font-semibold text-primary text-lg">{message.name}</span>
                  </div>
                  <CardTitle className="text-xl text-primary mb-3">{message.subject}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-primary/60">
                    <Clock className="h-4 w-4" />
                    <span>{formatRelativeDate(message.createdAt)}</span>
                    <span className="text-primary/40">•</span>
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Message Body */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="text-primary/80 leading-relaxed whitespace-pre-wrap">{message.message}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Contact Info and Actions */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-medium text-sm">Email</p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`mailto:${message.email}`}
                        className="text-primary/70 text-sm hover:text-green transition-colors truncate"
                      >
                        {message.email}
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.email, "Email address")}
                        className="h-6 w-6 p-0 hover:bg-secondary/50"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {message.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-primary font-medium text-sm">Phone</p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`tel:${message.phone}`}
                          className="text-primary/70 text-sm hover:text-green transition-colors"
                        >
                          {message.phone}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.phone!, "Phone number")}
                          className="h-6 w-6 p-0 hover:bg-secondary/50"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-primary font-medium text-sm">Received</p>
                    <p className="text-primary/70 text-sm">{formatDate(message.createdAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={composeReply}
                className="w-full justify-start border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Email Client
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(message.email, "Email address")}
                className="w-full justify-start border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email Address
              </Button>
              {message.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(message.phone!, "Phone number")}
                  className="w-full justify-start border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Phone Number
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `Subject: ${message.subject}\nFrom: ${message.name} (${message.email})\nDate: ${formatDate(message.createdAt)}\n\n${message.message}`,
                    "Message content",
                  )
                }
                className="w-full justify-start border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Full Message
              </Button>
            </CardContent>
          </Card>

          {/* Message Stats */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-primary">Message Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/60">Status</span>
                <Badge
                  variant="secondary"
                  className={message.read ? "bg-gray-100 text-gray-600" : "bg-green/10 text-green"}
                >
                  {message.read ? "Read" : "Unread"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/60">Priority</span>
                <Badge
                  variant="secondary"
                  className={message.urgent ? "bg-red-500/10 text-red-500" : "bg-gray-100 text-gray-600"}
                >
                  {message.urgent ? "Urgent" : "Normal"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/60">Word Count</span>
                <span className="text-primary">{message.message.split(" ").length} words</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
