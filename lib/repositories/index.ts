import type { IUserRepository, ICourseRepository, ICommentRepository } from "./interfaces"
import { InMemoryUserRepository } from "./in-memory/user.repository"
import { InMemoryCourseRepository } from "./in-memory/course.repository"
import { InMemoryCommentRepository } from "./in-memory/comment.repository"

/**
 * Repository Container
 *
 * This container manages repository instances and their dependencies.
 * It uses the singleton pattern to ensure all API routes use the same instances.
 *
 * To switch from in-memory to MongoDB (or any other storage):
 * 1. Create MongoDB repository implementations (e.g., MongoUserRepository)
 * 2. Update the createRepositories() function to instantiate MongoDB repositories
 * 3. No changes needed in API routes - they use the interfaces!
 */

export interface IRepositoryContainer {
  users: IUserRepository
  courses: ICourseRepository
  comments: ICommentRepository
}

/**
 * Factory function to create repository instances
 *
 * Modify this function to switch between different implementations
 * (in-memory, MongoDB, PostgreSQL, etc.)
 */
function createRepositories(): IRepositoryContainer {
  // In-Memory implementation
  const userRepo = new InMemoryUserRepository()
  const courseRepo = new InMemoryCourseRepository()
  const commentRepo = new InMemoryCommentRepository(courseRepo)

  return {
    users: userRepo,
    courses: courseRepo,
    comments: commentRepo,
  }

  // To switch to MongoDB, uncomment and modify:
  // const userRepo = new MongoUserRepository(mongoClient)
  // const courseRepo = new MongoCourseRepository(mongoClient)
  // const commentRepo = new MongoCommentRepository(mongoClient, courseRepo)
  //
  // return {
  //   users: userRepo,
  //   courses: courseRepo,
  //   comments: commentRepo,
  // }
}

/**
 * Singleton instance of the repository container
 *
 * This ensures all API routes use the same repository instances,
 * which is important for in-memory storage to maintain state.
 */
let repositoryContainer: IRepositoryContainer | null = null

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
 * const repos = getRepositories()
 * const users = await repos.users.findAll()
 * ```
 */
export function getRepositories(): IRepositoryContainer {
  if (!repositoryContainer) {
    repositoryContainer = createRepositories()
  }
  return repositoryContainer
}

/**
 * Reset the repository container (useful for testing)
 *
 * This function clears the singleton instance, forcing a new
 * container to be created on the next call to getRepositories().
 */
export function resetRepositories(): void {
  repositoryContainer = null
}

// Export interfaces for use in API routes
export type { IUserRepository, ICourseRepository, ICommentRepository } from "./interfaces"
