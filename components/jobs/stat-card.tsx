import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: string
  trend?: "up" | "down" | "neutral"
  description?: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change, trend, description }) => {
  return (
    <Card className="border-secondary hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-primary/60">{title}</p>
            <p className="text-2xl font-bold text-primary">{value}</p>
            {change && (
              <p className="text-xs text-primary/50 mt-1 flex items-center gap-1">
                {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                {change}
              </p>
            )}
            {description && <p className="text-xs text-primary/40 mt-1">{description}</p>}
          </div>
          <div className="p-3 rounded-full bg-secondary">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
