"use client"

import { useMemo } from "react"
import { useJob } from "@/app/context/job-context"

export const useJobAnalytics = () => {
  const { jobApplications } = useJob()

  return useMemo(() => {
    const total = jobApplications.length
    const applied = jobApplications.filter((job) => job.status === "APPLIED").length
    const interviewing = jobApplications.filter((job) => job.status === "INTERVIEWING").length
    const offers = jobApplications.filter((job) => job.status === "OFFER_RECEIVED").length
    const rejected = jobApplications.filter((job) => job.status === "REJECTED").length
    const archived = jobApplications.filter((job) => job.status === "ARCHIVED").length

    const responseRate = total > 0 ? (((interviewing + offers) / total) * 100).toFixed(1) : "0"
    const successRate = total > 0 ? ((offers / total) * 100).toFixed(1) : "0"

    const sourceDistribution = jobApplications.reduce<Record<string, number>>((acc, job) => {
      const source = job.source || "Unknown"
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    const statusDistribution = jobApplications.reduce<Record<string, number>>((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1
      return acc
    }, {})

    // Daily application trend over the last 365 days
    const today = new Date()
    const oneYearAgo = new Date(today)
    oneYearAgo.setFullYear(today.getFullYear() - 1)

    // Create a map of all days in the last 365 days with 0 applications
    const dailyTrend: Record<string, number> = {}
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0] // Format: YYYY-MM-DD
      dailyTrend[dateKey] = 0
    }

    // Count applications for each day
    jobApplications.forEach((job) => {
      const applicationDate = new Date(job.application_date)
      if (applicationDate >= oneYearAgo && applicationDate <= today) {
        const dateKey = applicationDate.toISOString().split('T')[0]
        dailyTrend[dateKey] = (dailyTrend[dateKey] || 0) + 1
      }
    })

    const statusChartData = Object.entries(statusDistribution).map(([status, count]) => ({
      status: status.replace("_", " "),
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }))

    const sourceChartData = Object.entries(sourceDistribution).map(([source, count]) => ({
      source,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }))

    // Convert daily trend to chart data, grouping by week for better visualisation
    const trendChartData = Object.entries(dailyTrend)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .reduce<Array<{ week: string; applications: number }>>((acc, [date, count], index) => {
        const weekIndex = Math.floor(index / 7)
        const weekStart = new Date(date)
        weekStart.setDate(weekStart.getDate() - (weekStart.getDay() || 7) + 1)
        const weekLabel = weekStart.toLocaleDateString("en-ZA", {
          month: "short",
          day: "numeric",
        })

        if (!acc[weekIndex]) {
          acc[weekIndex] = {
            week: weekLabel,
            applications: 0
          }
        }

        acc[weekIndex].applications += count
        return acc
      }, [])
      .filter(Boolean)

    return {
      total,
      applied,
      interviewing,
      offers,
      rejected,
      archived,
      responseRate,
      successRate,
      sourceDistribution,
      statusDistribution,
      statusChartData,
      sourceChartData,
      trendChartData,
    }
  }, [jobApplications])
}