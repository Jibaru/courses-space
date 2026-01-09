// Server-side in-memory data store for API routes
import type { User, Course, Comment } from "./store"

// In-memory store (server-side only)
let users: User[] = [
  {
    id: "1",
    email: "admin@pullrequest.com",
    password: "admin123",
    createdAt: new Date(),
  },
]

let courses: Course[] = [
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

export const dataStore = {
  getUser: (email: string, password: string) => {
    return users.find((u) => u.email === email && u.password === password)
  },

  getUserByEmail: (email: string) => {
    return users.find((u) => u.email === email)
  },

  getUserById: (id: string) => {
    return users.find((u) => u.id === id)
  },

  getAllUsers: () => [...users],

  createUser: (email: string, password: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },

  updateUser: (id: string, email: string, password: string) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      user.email = email
      user.password = password
    }
    return user
  },

  deleteUser: (id: string) => {
    users = users.filter((u) => u.id !== id)
  },

  getCourses: () => [...courses],

  getCourseById: (id: string) => {
    return courses.find((c) => c.id === id)
  },

  addComment: (courseId: string, userId: string, userName: string, content: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId,
        userName,
        content,
        createdAt: new Date(),
        replies: [],
      }
      course.comments.push(comment)
      return comment
    }
    return null
  },

  addReply: (courseId: string, commentId: string, userId: string, userName: string, content: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      const findAndReply = (comments: Comment[]): Comment | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            const reply: Comment = {
              id: Date.now().toString(),
              userId,
              userName,
              content,
              createdAt: new Date(),
              replies: [],
            }
            comment.replies.push(reply)
            return reply
          }
          const found = findAndReply(comment.replies)
          if (found) return found
        }
        return null
      }
      return findAndReply(course.comments)
    }
    return null
  },
}
