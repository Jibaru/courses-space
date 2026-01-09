"use client"

import type { Course } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface CourseCardProps {
  course: Course
  onClick: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card
      className="border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden bg-secondary">
        <img
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 transition-all">
          View Course
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </CardContent>
    </Card>
  )
}
