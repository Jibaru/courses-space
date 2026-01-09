"use client"

import { useState } from "react"
import { store, type Course } from "@/lib/store"
import { CourseCard } from "./course-card"
import { CourseDetail } from "./course-detail"

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>(store.getCourses())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    setCourses(store.getCourses())
  }

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={handleBackToCourses} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Courses</h2>
        <p className="text-muted-foreground mt-2">Explore our comprehensive learning materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => setSelectedCourse(store.getCourseById(course.id) || course)}
          />
        ))}
      </div>
    </div>
  )
}
