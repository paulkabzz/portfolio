"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Target, Filter, SortAsc, SortDesc } from "lucide-react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"
import { JobCard } from "./job-card"

export const ApplicationsTab = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const router = useRouter()
  const { jobApplications } = useJob()

  // Get unique sources for filter
  const uniqueSources = useMemo(() => {
    const sources = jobApplications.map((job) => job.source).filter(Boolean)
    return Array.from(new Set(sources))
  }, [jobApplications])

  // Filtered and sorted jobs
  const filteredJobs = useMemo(() => {
    const filtered = jobApplications.filter((job) => {
      const matchesSearch =
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || job.status === statusFilter
      const matchesSource = sourceFilter === "all" || job.source === sourceFilter

      return matchesSearch && matchesStatus && matchesSource
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.application_date)
          bValue = new Date(b.application_date)
          break
        case "company":
          aValue = a.company_name.toLowerCase()
          bValue = b.company_name.toLowerCase()
          break
        case "title":
          aValue = a.job_title.toLowerCase()
          bValue = b.job_title.toLowerCase()
          break
        case "salary":
          aValue = a.max_salary
          bValue = b.max_salary
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [jobApplications, searchTerm, statusFilter, sourceFilter, sortBy, sortOrder])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setSourceFilter("all")
    setSortBy("date")
    setSortOrder("desc")
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="border-secondary">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-primary/40" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-secondary focus:border-green"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-secondary focus:border-green">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                  <SelectItem value="OFFER_RECEIVED">Offer Received</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[180px] border-secondary focus:border-green">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source!}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] border-secondary focus:border-green">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="title">Job Title</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="border-secondary"
              >
                {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={clearFilters} className="border-secondary bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>

              <Button
                onClick={() => router.push("/dashboard/jobs/new")}
                className="bg-green hover:bg-green/90 text-white whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Application
              </Button>
            </div>
          </div>

          {/* Results summary */}
          <div className="mt-4 text-sm text-primary/60">
            Showing {filteredJobs.length} of {jobApplications.length} applications
            {(searchTerm || statusFilter !== "all" || sourceFilter !== "all") && <span> (filtered)</span>}
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.$id} job={job} />)
        ) : (
          <Card className="border-secondary">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">No applications found</h3>
              <p className="text-primary/60 mb-4">
                {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by adding your first job application"}
              </p>
              <Button
                onClick={() => router.push("/dashboard/jobs/new")}
                className="bg-green hover:bg-green/90 text-white"
              >
                Add Your First Application
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
