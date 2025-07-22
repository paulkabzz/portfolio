"use client"

import { useState } from "react"
import { useJob } from "@/app/context/job-context"
import { OverviewTab } from "./overview-tab"
import { ApplicationsTab } from "./applications-tab"
import { AnalyticsTab } from "./analytics-tab"
import { DashboardHeader } from "./dashboard-header"
import { NavigationTabs } from "./navigation-tabs"
import { LoadingState } from "./loading-state"
import { ErrorState } from "./error-state"

export type TabType = "overview" | "applications" | "analytics"

const JobManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const { isLoading, error } = useJob()

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "applications" && <ApplicationsTab />}
      {activeTab === "analytics" && <AnalyticsTab />}
    </div>
  )
}

export default JobManagementDashboard
