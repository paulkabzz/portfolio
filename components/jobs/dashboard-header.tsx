"use client"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"

export const DashboardHeader = () => {
  const router = useRouter()
  const { jobApplications } = useJob()

  const exportToCSV = () => {
    const headers = ["Job Title", "Company", "Status", "Location", "Application Date", "Salary Range"]
    const csvContent = [
      headers.join(","),
      ...jobApplications.map((job) =>
        [
          `"${job.job_title}"`,
          `"${job.company_name}"`,
          job.status,
          `"${job.location}"`,
          job.application_date,
          `"${job.min_salary} - ${job.max_salary}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `job-applications-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">Job Applications</h1>
        <p className="text-primary/70 mt-2">Track and manage your job applications with detailed analytics</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={exportToCSV} className="border-secondary bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button onClick={() => router.push("/dashboard/jobs/new")} className="bg-green hover:bg-green/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Application
        </Button>
      </div>
    </div>
  )
}
