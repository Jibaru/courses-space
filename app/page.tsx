"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { UsersSection } from "@/components/users/users-section"
import { CoursesSection } from "@/components/courses/courses-section"

export default function Home() {
  const { user, isLoading, logout } = useAuth()
  const [currentSection, setCurrentSection] = useState<"dashboard" | "users" | "courses">("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    setCurrentSection("dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onLogout={handleLogout}
        userEmail={user.email}
        userRole={user.role}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {currentSection === "dashboard" && <DashboardSection />}
          {currentSection === "users" && <UsersSection />}
          {currentSection === "courses" && <CoursesSection />}
        </div>
      </main>
    </div>
  )
}
