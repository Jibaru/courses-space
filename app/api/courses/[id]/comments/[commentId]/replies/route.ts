import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { getRepositories } from "@/lib/repositories"

// POST /api/courses/[id]/comments/[commentId]/replies - Add reply to comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const payload = requireAuth(request)
    const { id: courseId, commentId } = await params
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Reply content is required" }, { status: 400 })
    }

    const repos = await getRepositories()

    // Get user info
    const user = await repos.users.findById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const reply = await repos.comments.addReply(courseId, commentId, user.id, user.email, content)

    if (!reply) {
      return NextResponse.json({ error: "Course or comment not found" }, { status: 404 })
    }

    return NextResponse.json(reply, { status: 201 })
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Add reply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
