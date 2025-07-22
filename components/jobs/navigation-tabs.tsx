"use client"

import type React from "react"

interface NavigationTabsProps {
  activeTab: any
  setActiveTab: (tab: any) => void
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "applications" as const, label: "Applications" },
    { id: "analytics" as const, label: "Analytics" },
  ]

  return (
    <div className="border-b border-secondary">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-green text-green"
                : "border-transparent text-primary/60 hover:text-primary hover:border-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
