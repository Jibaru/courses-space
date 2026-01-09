"use client"

import { useState } from "react"
import { AuthPage } from "@/components/auth/auth-page"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardSection } from "@/components/dashboard/dashboard-section"
import { UsersSection } from "@/components/users/users-section"
import { CoursesSection } from "@/components/courses/courses-section"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [currentSection, setCurrentSection] = useState<"dashboard" | "users" | "courses">("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleAuthSuccess = (id: string, email: string) => {
    setUserId(id)
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserId("")
    setUserEmail("")
    setCurrentSection("dashboard")
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onLogout={handleLogout}
        userEmail={userEmail}
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
