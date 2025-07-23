"use client"

import { User, FolderOpen, Settings, Home, Briefcase, Mail } from "lucide-react"
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
import { useAuth } from "@/app/context/auth-context"
import { Button } from "./ui/button"
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"

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
    title: "Jobs",
    url: "/dashboard/jobs",
    icon: Briefcase
  },
  {
    title: "Messages",
    url: "/dashboard/messages",
    icon: Mail
  },
  {
    title: "Experience",
    url: "/dashboard/experiences",
    icon: Briefcase
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar() {

  const { user, logout } = useAuth();

  const router = useRouter();
  const handleLogout = async () => {
    try {
        await logout();
        toast({title: "Logged out successfully"});
        router.push('/');
    } catch (error) {
        toast({
          title: "Failed to logout",
          variant: "destructive"
        })
    }
  }
  return (
    <Sidebar className="border-r border-secondary">
      <SidebarHeader className="border-b border-secondary p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary p-4">
            <span className="text-sm font-bold text-white">{user?.name.charAt(0).toUpperCase() ?? ""}.{user?.name.split(" ")[1].charAt(0).toUpperCase() ?? ""}</span>
          </div>
          <span className="font-semibold text-primary">{user?.name}</span>
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
              <Button onClick={handleLogout}>
                  Log Out
              </Button>
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
