import { NextRequest, NextResponse } from "next/server"
import { getRepositories } from "@/lib/repositories"
import { generateToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const repos = await getRepositories()

    // Check if user already exists
    const existingUser = await repos.users.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    const newUser = await repos.users.create(email, password, "student")
    const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role })

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
