"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login/login-form"
import { SignupForm } from "@/components/login/signup-form"

interface AuthPageProps {
  onAuthSuccess: (userId: string, email: string) => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-block rounded-full bg-primary/10 p-4">
          <div className="text-4xl font-bold text-primary">PR</div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">PULL REQUEST</h1>
        <p className="mt-2 text-muted-foreground">Master Web Development</p>
      </div>

      {isSignup ? (
        <SignupForm onSignupSuccess={onAuthSuccess} onToggleLogin={() => setIsSignup(false)} />
      ) : (
        <LoginForm onLoginSuccess={onAuthSuccess} onToggleSignup={() => setIsSignup(true)} />
      )}
    </div>
  )
}
