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

    // Monthly application trend
    const monthlyTrend = jobApplications.reduce<Record<string, number>>((acc, job) => {
      const month = new Date(job.application_date).toLocaleDateString("en-ZA", {
        month: "short",
        year: "2-digit",
      });

      console.log(month)
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    // Chart data
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

    const trendChartData = Object.entries(monthlyTrend)
      .map(([month, count]) => ({
        month,
        applications: count,
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.month + " 01")
        const dateB = new Date(b.month + " 01")
        return dateA.getTime() - dateB.getTime()
      })

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
