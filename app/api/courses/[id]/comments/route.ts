import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { getRepositories } from "@/lib/repositories"

// POST /api/courses/[id]/comments - Add comment to course
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = requireAuth(request)
    const { id: courseId } = await params
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const repos = getRepositories()

    // Get user info
    const user = await repos.users.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const comment = await repos.comments.addComment(courseId, user.id, user.email, content)

    if (!comment) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Add comment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
