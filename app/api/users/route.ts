import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { dataStore } from "@/lib/data-store"

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    requireAuth(request)
    const users = dataStore.getAllUsers()

    // Don't send passwords to client
    const sanitizedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    }))

    return NextResponse.json(sanitizedUsers)
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    requireAuth(request)
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = dataStore.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const newUser = dataStore.createUser(email, password)

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      { status: 201 },
    )
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
