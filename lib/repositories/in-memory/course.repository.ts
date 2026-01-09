import type { Course } from "../../store"
import type { ICourseRepository } from "../interfaces"

/**
 * In-Memory Course Repository Implementation
 *
 * This implementation stores courses in memory (server-side only).
 * Data will be lost when the server restarts.
 */
export class InMemoryCourseRepository implements ICourseRepository {
  private courses: Course[] = [
    {
      id: "1",
      title: "React Fundamentals",
      description: "Learn the basics of React including components, hooks, and state management.",
      thumbnail: "/react-course-thumbnail.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "React Fundamentals Tutorial",
      content:
        "This comprehensive course covers React fundamentals including functional components, hooks, state management, and more. Perfect for beginners looking to master React development.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf" as const,
          url: "/pdf-document.png",
        },
        {
          name: "starter-code.zip",
          type: "zip" as const,
          url: "/zip-file.png",
        },
      ],
      comments: [],
    },
    {
      id: "2",
      title: "TypeScript Advanced",
      description: "Master advanced TypeScript concepts and patterns for production applications.",
      thumbnail: "/typescript-course.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "TypeScript Advanced Patterns",
      content:
        "Deep dive into advanced TypeScript features including generics, decorators, advanced types, and design patterns. Ideal for experienced developers.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf" as const,
          url: "/pdf-slides.jpg",
        },
      ],
      comments: [],
    },
    {
      id: "3",
      title: "Next.js Full Stack",
      description: "Build full-stack applications with Next.js, API routes, and databases.",
      thumbnail: "/nextjs-course.png",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "Next.js Full Stack Development",
      content:
        "Learn how to build complete full-stack applications using Next.js with server-side rendering, API routes, authentication, and database integration.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf" as const,
          url: "/pdf-document.png",
        },
        {
          name: "project-files.zip",
          type: "zip" as const,
          url: "/zip.jpg",
        },
      ],
      comments: [],
    },
  ]

  async findAll(): Promise<Course[]> {
    return [...this.courses]
  }

  async findById(id: string): Promise<Course | null> {
    return this.courses.find((c) => c.id === id) || null
  }

  async create(course: Omit<Course, "id" | "comments">): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      comments: [],
    }
    this.courses.push(newCourse)
    return newCourse
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    const course = this.courses.find((c) => c.id === id)
    if (course) {
      Object.assign(course, courseData)
      return course
    }
    return null
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.courses.length
    this.courses = this.courses.filter((c) => c.id !== id)
    return this.courses.length < initialLength
  }
}
