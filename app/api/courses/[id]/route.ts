import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { getRepositories } from "@/lib/repositories"

// GET /api/courses/[id] - Get course by ID with comments
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireAuth(request)
    const { id } = await params
    const repos = getRepositories()
    const course = await repos.courses.findById(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Get course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
