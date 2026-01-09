"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/store"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string, password: string) => void
  editingUser: User | null
}

export function UserModal({ isOpen, onClose, onSubmit, editingUser }: UserModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingUser) {
      setEmail(editingUser.email)
      setPassword(editingUser.password)
    } else {
      setEmail("")
      setPassword("")
    }
    setError("")
  }, [editingUser, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!editingUser && password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    onSubmit(email, password)
    setEmail("")
    setPassword("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle>{editingUser ? "Edit User" : "Create New User"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="modal-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="modal-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="modal-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="modal-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                {editingUser ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
