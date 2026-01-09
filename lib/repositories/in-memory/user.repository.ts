import type { User } from "../../store"
import type { IUserRepository } from "../interfaces"

/**
 * In-Memory User Repository Implementation
 *
 * This implementation stores users in memory (server-side only).
 * Data will be lost when the server restarts.
 */
export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [
    {
      id: "1",
      email: "admin@pullrequest.com",
      password: "admin123",
      createdAt: new Date(),
    },
  ]

  async findByCredentials(email: string, password: string): Promise<User | null> {
    return this.users.find((u) => u.email === email && u.password === password) || null
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null
  }

  async findAll(): Promise<User[]> {
    return [...this.users]
  }

  async create(email: string, password: string): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      createdAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }

  async update(id: string, email: string, password: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id)
    if (user) {
      user.email = email
      user.password = password
      return user
    }
    return null
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length
    this.users = this.users.filter((u) => u.id !== id)
    return this.users.length < initialLength
  }
}
