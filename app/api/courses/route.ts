import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { dataStore } from "@/lib/data-store"

// GET /api/courses - List all courses
export async function GET(request: NextRequest) {
  try {
    requireAuth(request)
    const courses = dataStore.getCourses()

    return NextResponse.json(courses)
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Get courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
