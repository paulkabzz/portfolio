"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  CheckCircle,
  Clock,
  Users,
  XCircle,
  Archive,
  Plus,
  Calendar,
  MessageSquare,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useJob } from "@/app/context/job-context"
import { toast } from "@/hooks/use-toast"

interface JobKanbanProps {
  job: any
}

interface KanbanItem {
  id: string
  title: string
  description?: string
  type: "milestone" | "task" | "note"
  status: string
  date?: string
  completed?: boolean
}

const statusColumns = [
  {
    id: "APPLIED",
    title: "Applied",
    icon: Clock,
    color: "bg-blue-500",
    description: "Application submitted",
  },
  {
    id: "INTERVIEWING",
    title: "Interviewing",
    icon: Users,
    color: "bg-yellow-500",
    description: "In interview process",
  },
  {
    id: "OFFER_RECEIVED",
    title: "Offer Received",
    icon: CheckCircle,
    color: "bg-green-500",
    description: "Offer received",
  },
  {
    id: "OFFER_REJECTED",
    title: "Rejected",
    icon: XCircle,
    color: "bg-red-500",
    description: "Application rejected",
  },
  {
    id: "ARCHIVED",
    title: "Archived",
    icon: Archive,
    color: "bg-gray-500",
    description: "Archived application",
  },
]

const SortableItem: React.FC<{ item: KanbanItem; isUpdating: boolean }> = ({ item, isUpdating }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getItemIcon = () => {
    switch (item.type) {
      case "milestone":
        return <CheckCircle className="h-4 w-4" />
      case "task":
        return <FileText className="h-4 w-4" />
      case "note":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white border border-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative"
    >
      <div className="flex items-start gap-2">
        <div className="text-primary/60 mt-0.5">{getItemIcon()}</div>
        <div className="flex-1">
          <h4 className="font-medium text-primary text-sm">{item.title}</h4>
          {item.description && <p className="text-xs text-primary/60 mt-1">{item.description}</p>}
          {item.date && (
            <div className="flex items-center gap-1 mt-2">
              <Calendar className="h-3 w-3 text-primary/40" />
              <span className="text-xs text-primary/60">{new Date(item.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isUpdating && (
            <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
          )}
          {item.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>
    </div>
  )
}

// New Droppable Column Component
const DroppableColumn: React.FC<{
  column: typeof statusColumns[0]
  items: KanbanItem[]
  isOver: boolean
  isUpdating: boolean
}> = ({ column, items, isOver, isUpdating }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })

  return (
    <Card key={column.id} className="border-secondary">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <CardTitle className="text-sm font-medium text-primary">{column.title}</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {items.length}
          </Badge>
        </div>
        <p className="text-xs text-primary/60">{column.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] transition-colors ${
            isOver ? 'bg-blue-50 dark:bg-blue-950/20' : ''
          }`}
        >
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem key={item.id} item={item} isUpdating={isUpdating} />
            ))}
            {items.length === 0 && (
              <div className={`flex items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
                isOver 
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
                  : 'border-secondary'
              }`}>
                <p className="text-sm text-primary/40">Drop items here</p>
              </div>
            )}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  )
}

export const JobKanban: React.FC<JobKanbanProps> = ({ job }) => {
  const { updateJobApplication } = useJob()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Generate kanban items based on job data - FIXED: Only show items in current status column
  const generateKanbanItems = (): KanbanItem[] => {
    const items: KanbanItem[] = []
    const currentStatus = job.status

    // Base application item - always in current status
    items.push({
      id: "application-submitted",
      title: "Application Submitted",
      description: `Applied for ${job.job_title} at ${job.company_name}`,
      type: "milestone",
      status: currentStatus,
      date: job.application_date,
      completed: true,
    })

    // Add status-specific items only if they match current status
    if (currentStatus === "INTERVIEWING") {
      items.push({
        id: "screening-call",
        title: "Initial Screening",
        description: "Phone/video screening with recruiter",
        type: "milestone",
        status: "INTERVIEWING",
        completed: false,
      })

      if (job.interview_dates && job.interview_dates.length > 0) {
        job.interview_dates.forEach((date: string, index: number) => {
          items.push({
            id: `interview-${index}`,
            title: `Interview Round ${index + 1}`,
            description: "Technical/behavioral interview",
            type: "milestone",
            status: "INTERVIEWING",
            date: date,
            completed: false,
          })
        })
      }
    }

    if (currentStatus === "OFFER_RECEIVED") {
      items.push({
        id: "offer-received",
        title: "Offer Received",
        description: "Job offer received and under review",
        type: "milestone",
        status: "OFFER_RECEIVED",
        completed: true,
      })

      if (job.response_deadline) {
        items.push({
          id: "response-deadline",
          title: "Response Deadline",
          description: "Deadline to respond to offer",
          type: "task",
          status: "OFFER_RECEIVED",
          date: job.response_deadline,
        })
      }
    }

    if (currentStatus === "OFFER_REJECTED") {
      items.push({
        id: "application-rejected",
        title: "Application Rejected",
        description: job.feedback || "Application was not successful",
        type: "milestone",
        status: "OFFER_REJECTED",
        completed: true,
      })
    }

    if (currentStatus === "ARCHIVED") {
      items.push({
        id: "application-archived",
        title: "Application Archived",
        description: "Application has been archived",
        type: "milestone",
        status: "ARCHIVED",
        completed: true,
      })
    }

    // Add additional items that belong to current status
    if (job.next_steps) {
      items.push({
        id: "next-steps",
        title: "Next Steps",
        description: job.next_steps,
        type: "task",
        status: currentStatus,
      })
    }

    if (job.notes) {
      items.push({
        id: "notes",
        title: "Application Notes",
        description: job.notes,
        type: "note",
        status: currentStatus,
      })
    }

    return items
  }

  const [items, setItems] = useState<KanbanItem[]>(generateKanbanItems())

  // Regenerate items when job status changes
  useEffect(() => {
    setItems(generateKanbanItems())
  }, [job.status, job.interview_dates, job.notes, job.feedback, job.next_steps, job.response_deadline])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: any) => {
    setOverId(event.over?.id || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const activeItem = items.find((item) => item.id === active.id)
    const newStatus = over.id as string

    // Check if the drop target is a valid column and different from current status
    if (activeItem && statusColumns.some(col => col.id === newStatus) && job.status !== newStatus) {
      // Show updating indicator
      setIsUpdating(true)
      
      try {
        // Update the job status in the database
        await updateJobApplication(job.$id, { status: newStatus as any })
        toast({
          title: `Status updated to ${newStatus.replace("_", " ").toLowerCase()}`,
          duration: 2000,
        })
      } catch (error) {
        console.error("Failed to update application status:", error)
        toast({
          title: "Failed to update status",
          variant: "destructive",
          duration: 3000,
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {statusColumns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.id)
          const isOver = overId === column.id

          return (
            <DroppableColumn 
              key={column.id}
              column={column}
              items={columnItems}
              isOver={isOver}
              isUpdating={isUpdating}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="p-3 bg-white border border-secondary rounded-lg shadow-lg rotate-3">
            <div className="flex items-start gap-2">
              <div className="text-primary/60 mt-0.5">
                {activeItem.type === "milestone" && <CheckCircle className="h-4 w-4" />}
                {activeItem.type === "task" && <FileText className="h-4 w-4" />}
                {activeItem.type === "note" && <MessageSquare className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">{activeItem.title}</h4>
                {activeItem.description && <p className="text-xs text-primary/60 mt-1">{activeItem.description}</p>}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Quick Actions */}
      <Card className="border-secondary mt-6">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Interview
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
            {job.urgent_application && (
              <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 bg-transparent">
                <AlertCircle className="h-4 w-4 mr-2" />
                Urgent Follow-up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </DndContext>
  )
}