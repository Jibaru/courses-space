import type { IUserRepository, ICourseRepository, ICommentRepository } from "./interfaces"
import { InMemoryUserRepository } from "./in-memory/user.repository"
import { InMemoryCourseRepository } from "./in-memory/course.repository"
import { InMemoryCommentRepository } from "./in-memory/comment.repository"
import { MongoUserRepository } from "./mongodb/user.repository"
import { MongoCourseRepository } from "./mongodb/course.repository"
import { MongoCommentRepository } from "./mongodb/comment.repository"
import clientPromise from "../mongodb"

/**
 * Repository Container
 *
 * This container manages repository instances and their dependencies.
 * It uses the singleton pattern to ensure all API routes use the same instances.
 *
 * To switch between storage implementations:
 * 1. Set USE_MONGODB environment variable to 'true' or 'false'
 * 2. No changes needed in API routes - they use the interfaces!
 */

export interface IRepositoryContainer {
  users: IUserRepository
  courses: ICourseRepository
  comments: ICommentRepository
}

/**
 * Factory function to create repository instances
 *
 * Automatically selects implementation based on USE_MONGODB environment variable
 * (in-memory, MongoDB, PostgreSQL, etc.)
 */
async function createRepositories(): Promise<IRepositoryContainer> {
  const useMongoDB = process.env.USE_MONGODB === "true"

  if (useMongoDB) {
    // MongoDB implementation
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB_NAME || "learning-platform")

    const userRepo = new MongoUserRepository(db.collection("users"))
    const courseRepo = new MongoCourseRepository(db.collection("courses"))
    const commentRepo = new MongoCommentRepository(courseRepo)

    return {
      users: userRepo,
      courses: courseRepo,
      comments: commentRepo,
    }
  } else {
    // In-Memory implementation (default)
    const userRepo = new InMemoryUserRepository()
    const courseRepo = new InMemoryCourseRepository()
    const commentRepo = new InMemoryCommentRepository(courseRepo)

    return {
      users: userRepo,
      courses: courseRepo,
      comments: commentRepo,
    }
  }
}

/**
 * Singleton instance of the repository container promise
 *
 * This ensures all API routes use the same repository instances,
 * which is important for in-memory storage to maintain state.
 */
let repositoryContainerPromise: Promise<IRepositoryContainer> | null = null

/**
 * Get the repository container instance
 *
 * This function returns the singleton repository container.
 * Use this in your API routes to access repositories.
 *
 * @example
 * ```typescript
 * import { getRepositories } from "@/lib/repositories"
 *
 * const repos = await getRepositories()
 * const users = await repos.users.findAll()
 * ```
 */
export async function getRepositories(): Promise<IRepositoryContainer> {
  if (!repositoryContainerPromise) {
    repositoryContainerPromise = createRepositories()
  }
  return await repositoryContainerPromise
}

/**
 * Reset the repository container (useful for testing)
 *
 * This function clears the singleton instance, forcing a new
 * container to be created on the next call to getRepositories().
 */
export function resetRepositories(): void {
  repositoryContainerPromise = null
}

// Export interfaces for use in API routes
export type { IUserRepository, ICourseRepository, ICommentRepository } from "./interfaces"
