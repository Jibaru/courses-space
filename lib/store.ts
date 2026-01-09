export type User = {
  id: string
  email: string
  password: string
  role: "student" | "admin"
  createdAt: Date
}

export type Comment = {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: Date
  replies: Comment[]
}

export type Course = {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  videoTitle: string
  content: string
  resources: {
    name: string
    type: "pdf" | "zip" | "code"
    url: string
  }[]
  comments: Comment[]
}
