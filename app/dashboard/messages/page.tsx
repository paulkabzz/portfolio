"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  AlertCircle,
  Clock,
  User,
  ArrowUpDown,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
      "Hi there! I'm looking for a developer to help build an e-commerce website for my small business. We sell handmade crafts and need a modern, responsive site with payment integration. Could we schedule a call to discuss the project details and timeline?",
    urgent: true,
    createdAt: "2024-01-15T10:30:00Z",
    read: false,
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
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@startup.io",
    subject: "Collaboration Proposal",
    message:
      "I came across your portfolio and I'm impressed with your work! I'm working on a startup in the fintech space and would love to discuss a potential collaboration. We're looking for someone with your skills to help us build our MVP.",
    urgent: false,
    createdAt: "2024-01-13T09:15:00Z",
    read: true,
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@agency.com",
    phone: "+27 71 456 7890",
    subject: "Freelance Project - Dashboard Development",
    message:
      "We're a digital agency looking for a freelance developer to help with a client project. It involves building a complex dashboard with data visualization components. The project timeline is 6-8 weeks. Are you available for freelance work?",
    urgent: true,
    createdAt: "2024-01-12T16:45:00Z",
    read: false,
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@nonprofit.org",
    subject: "Website Redesign for Non-Profit",
    message:
      "Our non-profit organization needs a website redesign to better showcase our mission and make it easier for people to donate and volunteer. We have a limited budget but are passionate about our cause. Would you be interested in discussing this project?",
    urgent: false,
    createdAt: "2024-01-11T11:20:00Z",
    read: true,
  },
]

export default function MessagesPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUnread, setFilterUnread] = useState(false)
  const [filterUrgent, setFilterUrgent] = useState(false)
  const [sortBy, setSortBy] = useState<"date" | "name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const formatDate = (dateString: string) => {
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

  const markAsRead = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))
  }

  const filteredAndSortedMessages = messages
    .filter((message) => {
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesUnreadFilter = !filterUnread || !message.read
      const matchesUrgentFilter = !filterUrgent || message.urgent

      return matchesSearch && matchesUnreadFilter && matchesUrgentFilter
    })
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === "date") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        comparison = a.name.localeCompare(b.name)
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

  const unreadCount = messages.filter((msg) => !msg.read).length
  const urgentCount = messages.filter((msg) => msg.urgent && !msg.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">Messages</h1>
          <p className="text-primary/70 mt-2">Contact form submissions from your portfolio</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-green/10 text-green border-green/20">
              {unreadCount} unread
            </Badge>
          )}
          {urgentCount > 0 && (
            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
              {urgentCount} urgent
            </Badge>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-secondary">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-secondary focus:border-green"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterUnread ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUnread(!filterUnread)}
                className={
                  filterUnread
                    ? "bg-green hover:bg-green/90 text-white"
                    : "border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                }
              >
                <Filter className="h-4 w-4 mr-2" />
                Unread
              </Button>
              <Button
                variant={filterUrgent ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUrgent(!filterUrgent)}
                className={
                  filterUrgent
                    ? "bg-red-500 hover:bg-red-500/90 text-white"
                    : "border-secondary text-primary hover:bg-secondary/50 bg-transparent"
                }
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Urgent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  } else {
                    setSortBy("date")
                    setSortOrder("desc")
                  }
                }}
                className="border-secondary text-primary hover:bg-secondary/50 bg-transparent"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortBy === "date" ? "Date" : "Name"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredAndSortedMessages.length === 0 ? (
          <Card className="border-secondary">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">No messages found</h3>
                <p className="text-primary/60">
                  {searchTerm || filterUnread || filterUrgent
                    ? "Try adjusting your search or filters"
                    : "You haven't received any messages yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedMessages.map((message) => (
            <Card
              key={message.id}
              className={`border-secondary transition-all hover:shadow-md cursor-pointer ${
                !message.read ? "bg-green/5 border-green/20" : ""
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-primary/60 flex-shrink-0" />
                      <span className="font-semibold text-primary truncate">{message.name}</span>
                      {!message.read && (
                        <Badge variant="secondary" className="bg-green text-white text-xs">
                          New
                        </Badge>
                      )}
                      {message.urgent && (
                        <Badge variant="secondary" className="bg-red-500 text-white text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg text-primary mb-2 line-clamp-1">{message.subject}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary/60 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <p className="text-primary/80 leading-relaxed line-clamp-3">{message.message}</p>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-secondary">
                    <div className="flex items-center gap-2 text-sm text-primary/60">
                      <Mail className="h-4 w-4 text-green" />
                      <a
                        href={`mailto:${message.email}`}
                        className="hover:text-green transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {message.email}
                      </a>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-sm text-primary/60">
                        <Phone className="h-4 w-4 text-green" />
                        <a
                          href={`tel:${message.phone}`}
                          className="hover:text-green transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {message.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-primary/60">
                      <Calendar className="h-4 w-4 text-green" />
                      {new Date(message.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {messages.length > 0 && (
        <Card className="border-secondary">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{messages.length}</div>
                <div className="text-sm text-primary/60">Total Messages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green">{unreadCount}</div>
                <div className="text-sm text-primary/60">Unread</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">{urgentCount}</div>
                <div className="text-sm text-primary/60">Urgent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{messages.filter((msg) => msg.read).length}</div>
                <div className="text-sm text-primary/60">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
