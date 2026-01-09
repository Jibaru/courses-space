import type { IUserRepository, ICourseRepository, ICommentRepository } from "./interfaces"
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
 * All data is stored in MongoDB.
 */

export interface IRepositoryContainer {
  users: IUserRepository
  courses: ICourseRepository
  comments: ICommentRepository
}

/**
 * Factory function to create MongoDB repository instances
 */
async function createRepositories(): Promise<IRepositoryContainer> {
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
