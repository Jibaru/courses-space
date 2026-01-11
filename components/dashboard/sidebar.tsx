"use client"

import { Button } from "@/components/ui/button"
import { Users, BookOpen, LogOut, Menu, X, LayoutDashboardIcon } from "lucide-react"

interface SidebarProps {
  currentSection: "dashboard" | "users" | "courses"
  onNavigate: (section: "dashboard" | "users" | "courses") => void
  onLogout: () => void
  userEmail: string
  userRole: "student" | "admin"
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({
  currentSection,
  onNavigate,
  onLogout,
  userEmail,
  userRole,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <div className="relative">
      <aside
        className={`flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} min-h-screen p-6`}
      >
        <div className="mb-8 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <div className="mb-3 inline-block rounded-lg bg-sidebar-primary/20 p-3">
                <div className="text-2xl font-bold text-sidebar-primary">CS</div>
              </div>
              <h1 className="text-lg font-bold">Courses Space</h1>
              <p className="text-xs text-sidebar-foreground/70 mt-1">Learning Platform</p>
            </div>
          )}
        </div>

        {isCollapsed && (
          <div className="mb-8 flex justify-center">
            <div className="rounded-lg bg-sidebar-primary/20 p-3">
              <div className="text-xl font-bold text-sidebar-primary">CS</div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-2">
          <Button
            variant={currentSection === "dashboard" ? "default" : "ghost"}
            className={`${isCollapsed ? "w-full justify-center p-2" : "w-full justify-start"} ${currentSection === "dashboard" ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
            onClick={() => onNavigate("dashboard")}
            title="Dashboard"
          >
            <LayoutDashboardIcon className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Dashboard</span>}
          </Button>

          {userRole === "admin" && (
            <Button
              variant={currentSection === "users" ? "default" : "ghost"}
              className={`${isCollapsed ? "w-full justify-center p-2" : "w-full justify-start"} ${currentSection === "users" ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              onClick={() => onNavigate("users")}
              title="Users"
            >
              <Users className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Users</span>}
            </Button>
          )}

          <Button
            variant={currentSection === "courses" ? "default" : "ghost"}
            className={`${isCollapsed ? "w-full justify-center p-2" : "w-full justify-start"} ${currentSection === "courses" ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
            onClick={() => onNavigate("courses")}
            title="Courses"
          >
            <BookOpen className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Courses</span>}
          </Button>
        </nav>

        {!isCollapsed && (
          <div className="space-y-3 border-t border-sidebar-border pt-4">
            <div className="text-xs text-sidebar-foreground/70">
              <p className="font-semibold mb-1">Logged in as:</p>
              <p className="truncate">{userEmail}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}

        {isCollapsed && (
          <Button
            variant="ghost"
            className="w-full justify-center p-2 text-destructive hover:bg-destructive/10"
            onClick={onLogout}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}

        <button
          onClick={onToggleCollapse}
          className="absolute top-4 right-0 translate-x-1/2 z-50 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-all duration-300 rounded-full p-2 shadow-lg"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </aside>
    </div>
  )
}
