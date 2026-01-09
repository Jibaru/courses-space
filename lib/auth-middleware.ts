import { NextRequest } from "next/server"
import { verifyToken, type JWTPayload } from "./jwt"

export function requireAuth(request: NextRequest): JWTPayload {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided")
  }

  const token = authHeader.substring(7) // Remove "Bearer " prefix

  try {
    const payload = verifyToken(token)
    return payload
  } catch (error) {
    throw new Error("Unauthorized: Invalid token")
  }
}
