"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Area, AreaChart } from "recharts"
import { Plus, Target, Users, CheckCircle, TrendingUp, AlertCircle, Calendar, Clock, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useJob } from "@/app/context/job-context"
import { StatCard } from "./stat-card"
import { useJobAnalytics } from "@/hooks/use-job-analytics"

export const OverviewTab = () => {
  const router = useRouter()
  const { jobApplications } = useJob()
  const analytics = useJobAnalytics()

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "outline" | "default" | "secondary" | "destructive"> = {
      APPLIED: "default",
      INTERVIEWING: "secondary",
      OFFER_RECEIVED: "default",
      REJECTED: "destructive",
      ARCHIVED: "outline",
    }
    return variants[status] || "outline"
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value={analytics.total} icon={Target} change="+2 this week" trend="up" />
        <StatCard
          title="Currently Interviewing"
          value={analytics.interviewing}
          icon={Users}
          change="2 active processes"
          trend="neutral"
        />
        <StatCard
          title="Offers Received"
          value={analytics.offers}
          icon={CheckCircle}
          change="1 pending decision"
          trend="up"
        />
        <StatCard
          title="Response Rate"
          value={`${analytics.responseRate}%`}
          icon={TrendingUp}
          change="Above average"
          trend="up"
        />
      </div>

      {/* Quick Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview Chart */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Application Status Overview</CardTitle>
            <CardDescription className="text-primary/60">Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Applications",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <BarChart data={analytics.statusChartData}>
                <XAxis dataKey="status" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#10b981" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Application Trend */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Application Trend</CardTitle>
            <CardDescription className="text-primary/60">Applications over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                applications: {
                  label: "Applications",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <AreaChart data={analytics.trendChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="applications" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="border-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">Recent Applications</CardTitle>
              <CardDescription className="text-primary/60">Your latest job applications</CardDescription>
            </div>
            <Button
              onClick={() => router.push("/dashboard/jobs/new")}
              className="bg-green hover:bg-green/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobApplications.slice(0, 5).map((job) => (
              <div
                key={job.$id}
                className="flex items-center justify-between p-4 border border-secondary rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/dashboard/jobs/${job.$id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-primary">{job.job_title}</h3>
                    <Badge
                      variant={getStatusBadgeVariant(job.status)}
                      className="bg-green/10 text-green border-green/20"
                    >
                      {job.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary/60 flex items-center gap-2">
                    <Building2 className="h-3 w-3" />
                    {job.company_name} • {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">
                    {job.min_salary.toLocaleString('en-ZA', {
                          style: 'currency',
                          currency: 'ZAR'
                    })} - {job.max_salary.toLocaleString('en-ZA', {
                          style: 'currency',
                          currency: 'ZAR'
                    })}
                  </p>
                  <p className="text-sm text-primary/50">{new Date(job.application_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <CardDescription className="text-primary/60">Important tasks and reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-4 h-auto border-secondary text-left flex-col items-start bg-transparent hover:bg-secondary/50"
            >
              <AlertCircle className="h-6 w-6 text-orange-500 mb-2" />
              <h3 className="font-medium text-primary">Urgent Follow-ups</h3>
              <p className="text-sm text-primary/60">
                {jobApplications.filter((job) => job.urgent_application).length} applications need attention
              </p>
            </Button>
            <Button
              variant="outline"
              className="p-4 h-auto border-secondary text-left flex-col items-start bg-transparent hover:bg-secondary/50"
            >
              <Calendar className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-medium text-primary">Upcoming Interviews</h3>
              <p className="text-sm text-primary/60">{analytics.interviewing} active interview processes</p>
            </Button>
            <Button
              variant="outline"
              className="p-4 h-auto border-secondary text-left flex-col items-start bg-transparent hover:bg-secondary/50"
            >
              <Clock className="h-6 w-6 text-red-500 mb-2" />
              <h3 className="font-medium text-primary">Response Deadlines</h3>
              <p className="text-sm text-primary/60">
                {jobApplications.filter((job) => job.response_deadline).length} deadlines approaching
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
