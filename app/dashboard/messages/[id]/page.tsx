"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { useMessages } from "@/app/context/messages-context"

export default function MessageDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const messageId = params.id as string

  // Use the MessagesContext
  const {
    messages,
    archivedMessages,
    loading: contextLoading,
    error: contextError,
    openMessage,
    deleteMessage: contextDeleteMessage,
    archiveMessage: contextArchiveMessage,
    markAsRead: contextMarkAsRead,
    markAsUnread: contextMarkAsUnread,
  } = useMessages()

  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false)

  // Memoize all messages to prevent unnecessary re-renders
  const allMessages = useMemo(() => [...messages, ...archivedMessages], [messages, archivedMessages])

  // Check if message exists in current context first
  const existingMessage = useMemo(() => {
    if (!messageId) return null
    return allMessages.find(msg => msg.$id === messageId)
  }, [allMessages, messageId])

  // Initial fetch - only when message doesn't exist in context and we haven't fetched yet
  useEffect(() => {
    const fetchMessage = async () => {
      if (!messageId || hasInitiallyFetched) return
      
      // If message exists in context, use it instead of fetching
      if (existingMessage) {
        setMessage(existingMessage)
        setLoading(false)
        setHasInitiallyFetched(true)
        return
      }

      setLoading(true)
      try {
        const fetchedMessage = await openMessage(messageId)
        setMessage(fetchedMessage)
        setHasInitiallyFetched(true)

        if (!fetchedMessage) {
          toast({
            title: "Message not found",
            description: "The message you're looking for doesn't exist.",
            variant: "destructive",
          })
        }
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
  }, [messageId, hasInitiallyFetched, existingMessage, openMessage, toast])

  // Update local message when context messages change (for real-time updates)
  // Only update if we already have the message and it exists in context
  useEffect(() => {
    if (hasInitiallyFetched && existingMessage && message) {
      setMessage(existingMessage)
    }
  }, [existingMessage, hasInitiallyFetched, message])

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

  const handleAction = useCallback(async (action: string, actionFunction: () => Promise<void>) => {
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
  }, [toast])

  const markAsRead = useCallback(async () => {
    if (!message) return
    await contextMarkAsRead(message.$id)
    toast({
      title: "Message marked as read",
      description: "The message has been marked as read.",
    })
  }, [message, contextMarkAsRead, toast])

  const markAsUnread = useCallback(async () => {
    if (!message) return
    await contextMarkAsUnread(message.$id)
    toast({
      title: "Message marked as unread",
      description: "The message has been marked as unread.",
    })
  }, [message, contextMarkAsUnread, toast])

  const archiveMessage = useCallback(async () => {
    if (!message) return
    await contextArchiveMessage(message.$id)
    toast({
      title: "Message archived",
      description: "The message has been archived successfully.",
    })
  }, [message, contextArchiveMessage, toast])

  const deleteMessage = useCallback(async () => {
    if (!message) return
    if (!confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      return
    }
    await contextDeleteMessage(message.$id)
    toast({
      title: "Message deleted",
      description: "The message has been deleted successfully.",
    })
    router.push("/dashboard/messages")
  }, [message, contextDeleteMessage, toast, router])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
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
  }, [toast])

  const composeReply = useCallback(() => {
    if (!message) return
    const subject = message.subject.startsWith("Re:") ? message.subject : `Re: ${message.subject}`
    const body = `\n\n---\nOriginal message from ${message.full_name} (${message.email}):\n${message.message}`
    const mailtoUrl = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, "_blank")
  }, [message])

  if (loading || contextLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading message...
        </div>
      </div>
    )
  }

  if (contextError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-red-600/70">{contextError}</p>
          <Link href="/dashboard/messages">
            <Button variant="outline" className="border-secondary text-primary hover:bg-secondary/50 bg-transparent">
              Back to Messages
            </Button>
          </Link>
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
                    <span className="font-semibold text-primary text-lg">{message.full_name}</span>
                  </div>
                  <CardTitle className="text-xl text-primary mb-3">{message.subject}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-primary/60">
                    <Clock className="h-4 w-4" />
                    <span>{formatRelativeDate(message.$createdAt)}</span>
                    <span className="text-primary/40">•</span>
                    <span>{formatDate(message.$createdAt)}</span>
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
                    <p className="text-primary/70 text-sm">{formatDate(message.$createdAt)}</p>
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
                    `Subject: ${message.subject}\nFrom: ${message.full_name} (${message.email})\nDate: ${formatDate(message.$createdAt)}\n\n${message.message}`,
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
              <div className="flex justify-between items-center text-sm">
                <span className="text-primary/60">Archived</span>
                <Badge
                  variant="secondary"
                  className={message.archived ? "bg-gray-500/10 text-gray-500" : "bg-green/10 text-green"}
                >
                  {message.archived ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}