"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useJob } from "@/app/context/job-context"

interface ErrorStateProps {
  error: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  const { fetchJobApplications } = useJob()

  return (
    <Card className="border-secondary">
      <CardContent className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">Something went wrong</h3>
        <p className="text-primary/60 mb-4">{error}</p>
        <Button onClick={fetchJobApplications} variant="outline" className="border-secondary bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}
