"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Target, TrendingUp, CheckCircle, Clock, BarChart3, Eye, AlertCircle, Building2, Calendar } from "lucide-react"
import { useJob } from "@/app/context/job-context"
import { StatCard } from "./stat-card"
import { useJobAnalytics } from "@/hooks/use-job-analytics"

export const AnalyticsTab = () => {
  const { jobApplications } = useJob()
  const analytics = useJobAnalytics()

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPLIED: "#3b82f6",
      INTERVIEWING: "#f59e0b",
      OFFER_RECEIVED: "#10b981",
      REJECTED: "#ef4444",
      ARCHIVED: "#6b7280",
    }
    return colors[status] || "#6b7280"
  }

  // Weekly application trend
  const weeklyTrend = React.useMemo(() => {
    const weeks: Record<string, number> = {}
    jobApplications.forEach((job) => {
      const date = new Date(job.application_date)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split("T")[0]
      weeks[weekKey] = (weeks[weekKey] || 0) + 1
    })

    return Object.entries(weeks)
      .map(([week, count]) => ({
        week: new Date(week).toLocaleDateString("en-ZA", { month: "short", day: "numeric" }),
        applications: count,
      }))
      .slice(-16) // Last 16 weeks
  }, [jobApplications])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={analytics.total}
          icon={Target}
          change="Last 30 days"
          description="All time applications"
        />
        <StatCard
          title="Response Rate"
          value={`${analytics.responseRate}%`}
          icon={TrendingUp}
          change="Interviews + Offers / Total"
          description="Companies that responded"
        />
        <StatCard
          title="Success Rate"
          value={`${analytics.successRate}%`}
          icon={CheckCircle}
          change="Offers / Total Applications"
          description="Applications to offers"
        />
        <StatCard
          title="Active Applications"
          value={analytics.applied + analytics.interviewing}
          icon={Clock}
          change="Currently in process"
          description="Pending responses"
        />
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Status Distribution
            </CardTitle>
            <CardDescription className="text-primary/60">Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Applications",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={analytics.statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                >
                  {analytics.statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Application Sources
            </CardTitle>
            <CardDescription className="text-primary/60">Where you're finding opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.sourceChartData.map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green" />
                    <span className="text-sm text-primary">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div className="bg-green h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium text-primary w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary">Weekly Application Trend</CardTitle>
          <CardDescription className="text-primary/60">Application volume over the last 8 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              applications: {
                label: "Applications",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <LineChart data={weeklyTrend}>
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Application Timeline */}
      <Card className="border-secondary">
        <CardHeader>
          <CardTitle className="text-primary">Recent Application Activity</CardTitle>
          <CardDescription className="text-primary/60">Timeline of your recent applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobApplications
              .sort((a, b) => new Date(b.application_date).getTime() - new Date(a.application_date).getTime())
              .slice(0, 8)
              .map((job) => (
                <div key={job.$id} className="flex items-center gap-4 p-4 border border-secondary rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(job.status) }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-primary">{job.job_title}</h4>
                        <p className="text-sm text-primary/60 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {job.company_name} • {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green/10 text-green border border-green/20">
                          {job.status.replace("_", " ")}
                        </span>
                        <p className="text-sm text-primary/50 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(job.application_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Performance Insights</CardTitle>
            <CardDescription className="text-primary/60">Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center p-4 bg-green/5 rounded-lg border border-green/20">
                <TrendingUp className="h-8 w-8 text-green mx-auto mb-2" />
                <h4 className="font-medium text-primary">Best Performing Source</h4>
                <p className="text-sm text-primary/60 mt-1">
                  {Object.entries(analytics.sourceDistribution).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
                </p>
              </div>
              <div className="text-center p-4 bg-green/5 rounded-lg border border-green/20">
                <CheckCircle className="h-8 w-8 text-green mx-auto mb-2" />
                <h4 className="font-medium text-primary">Applications This Month</h4>
                <p className="text-sm text-primary/60 mt-1">
                  {
                    jobApplications.filter((job) => {
                      const appDate = new Date(job.application_date)
                      const now = new Date()
                      return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
              </div>
              <div className="text-center p-4 bg-green/5 rounded-lg border border-green/20">
                <Clock className="h-8 w-8 text-green mx-auto mb-2" />
                <h4 className="font-medium text-primary">Average Response Time</h4>
                <p className="text-sm text-primary/60 mt-1">5-7 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Recommendations</CardTitle>
            <CardDescription className="text-primary/60">
              Personalized suggestions to improve your job search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Number(analytics.responseRate) < 30 && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Improve Response Rate</h4>
                    <p className="text-sm text-primary/60">
                      Your current response rate is {analytics.responseRate}%. Consider customizing your applications
                      more or targeting companies that align better with your profile.
                    </p>
                  </div>
                </div>
              )}
              {analytics.applied > analytics.interviewing + analytics.offers && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Follow Up Strategy</h4>
                    <p className="text-sm text-primary/60">
                      You have {analytics.applied} applications in "Applied" status. Consider following up with
                      companies after 1-2 weeks.
                    </p>
                  </div>
                </div>
              )}
              {analytics.total < 10 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-primary">Increase Application Volume</h4>
                    <p className="text-sm text-primary/60">
                      Consider applying to more positions to increase your chances. Aim for 2-3 quality applications per
                      week.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
