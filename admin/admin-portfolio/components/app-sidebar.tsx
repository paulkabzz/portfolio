"use client"

import { User, FolderOpen, Settings, Home } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Personal Info",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-secondary">
      <SidebarHeader className="border-b border-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <span className="font-semibold text-primary">Portfolio Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-secondary/50">
                    <Link href={item.url} className="text-primary">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-secondary p-4">
        <div className="text-xs text-primary/60">Portfolio Dashboard v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}
