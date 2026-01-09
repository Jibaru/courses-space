"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, setAuthToken, clearAuthToken, getAuthToken } from "./api"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in on mount
    const token = getAuthToken()
    if (token) {
      // Verify token by fetching current user
      api
        .get<User>("/api/auth/me", true)
        .then((user) => {
          setUser(user)
        })
        .catch(() => {
          // Token is invalid, clear it
          clearAuthToken()
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>("/api/auth/login", {
      email,
      password,
    })
    setAuthToken(response.token)
    setUser(response.user)
  }

  const signup = async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>("/api/auth/signup", {
      email,
      password,
    })
    setAuthToken(response.token)
    setUser(response.user)
  }

  const logout = () => {
    clearAuthToken()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
