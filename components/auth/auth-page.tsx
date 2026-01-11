"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login/login-form"
import { SignupForm } from "@/components/login/signup-form"

export function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      {isSignup ? (
        <SignupForm onToggleLogin={() => setIsSignup(false)} />
      ) : (
        <LoginForm onToggleSignup={() => setIsSignup(true)} />
      )}
    </div>
  )
}
