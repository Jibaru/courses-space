"use client"

import { useState, useEffect } from "react"
import { type Course } from "@/lib/store"
import { api } from "@/lib/api"
import { CourseCard } from "./course-card"
import { CourseDetail } from "./course-detail"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.get<Course[]>("/api/courses", true)
      setCourses(data)
    } catch (err: any) {
      setError(err.message || "Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSelectCourse = async (courseId: string) => {
    try {
      const course = await api.get<Course>(`/api/courses/${courseId}`, true)
      setSelectedCourse(course)
    } catch (err: any) {
      alert(err.message || "Failed to load course")
    }
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    fetchCourses() // Refresh courses to get updated comments
  }

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={handleBackToCourses} />
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Courses</h2>
          <p className="text-muted-foreground mt-2">Explore our comprehensive learning materials</p>
        </div>
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading courses...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Courses</h2>
          <p className="text-muted-foreground mt-2">Explore our comprehensive learning materials</p>
        </div>
        <Card className="border-destructive/50">
          <CardContent className="py-8">
            <p className="text-center text-destructive">{error}</p>
            <Button className="mt-4 mx-auto block" onClick={fetchCourses}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Courses</h2>
        <p className="text-muted-foreground mt-2">Explore our comprehensive learning materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} onClick={() => handleSelectCourse(course.id)} />
        ))}
      </div>
    </div>
  )
}
