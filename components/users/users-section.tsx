"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type User } from "@/lib/store"
import { api } from "@/lib/api"
import { UserModal } from "./user-modal"
import { Trash2, Edit2, Plus } from "lucide-react"

export function UsersSection() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.get<User[]>("/api/users", true)
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (email: string, password: string) => {
    try {
      await api.post("/api/users", { email, password }, true)
      await fetchUsers()
      setIsModalOpen(false)
    } catch (err: any) {
      throw new Error(err.message || "Failed to create user")
    }
  }

  const handleUpdateUser = async (userId: string, email: string, password: string) => {
    try {
      await api.put(`/api/users/${userId}`, { email, password }, true)
      await fetchUsers()
      setEditingUser(null)
      setIsModalOpen(false)
    } catch (err: any) {
      throw new Error(err.message || "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/api/users/${userId}`, true)
        await fetchUsers()
      } catch (err: any) {
        alert(err.message || "Failed to delete user")
      }
    }
  }

  const handleOpenModal = (user?: User) => {
    setEditingUser(user || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
            <p className="text-muted-foreground mt-2">Create, edit, and manage platform users</p>
          </div>
        </div>
        <Card className="border-border">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
            <p className="text-muted-foreground mt-2">Create, edit, and manage platform users</p>
          </div>
        </div>
        <Card className="border-border border-destructive/50">
          <CardContent className="py-8">
            <p className="text-center text-destructive">{error}</p>
            <Button className="mt-4 mx-auto block" onClick={fetchUsers}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Users Management</h2>
          <p className="text-muted-foreground mt-2">Create, edit, and manage platform users</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          New User
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-3 px-4 text-foreground">{user.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingUser ? (e, p) => handleUpdateUser(editingUser.id, e, p) : handleCreateUser}
        editingUser={editingUser}
      />
    </div>
  )
}
