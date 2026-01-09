"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { store, type User } from "@/lib/store"
import { UserModal } from "./user-modal"
import { Trash2, Edit2, Plus } from "lucide-react"

export function UsersSection() {
  const [users, setUsers] = useState<User[]>(store.getAllUsers())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleCreateUser = (email: string, password: string) => {
    const newUser = store.createUser(email, password)
    setUsers(store.getAllUsers())
    setIsModalOpen(false)
  }

  const handleUpdateUser = (userId: string, email: string, password: string) => {
    store.updateUser(userId, email, password)
    setUsers(store.getAllUsers())
    setEditingUser(null)
    setIsModalOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      store.deleteUser(userId)
      setUsers(store.getAllUsers())
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
