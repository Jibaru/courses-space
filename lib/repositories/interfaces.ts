import type { User, Course, Comment } from "../store"

/**
 * Repository Interfaces
 *
 * These interfaces define the contract for data access.
 * Implementations can be in-memory, MongoDB, PostgreSQL, etc.
 */

export interface IUserRepository {
  /**
   * Find a user by email and password (for authentication)
   */
  findByCredentials(email: string, password: string): Promise<User | null>

  /**
   * Find a user by email only
   */
  findByEmail(email: string): Promise<User | null>

  /**
   * Find a user by ID
   */
  findById(id: string): Promise<User | null>

  /**
   * Get all users
   */
  findAll(): Promise<User[]>

  /**
   * Create a new user
   */
  create(email: string, password: string, role?: "student" | "admin"): Promise<User>

  /**
   * Update a user
   */
  update(id: string, email: string, password: string, role?: "student" | "admin"): Promise<User | null>

  /**
   * Delete a user
   */
  delete(id: string): Promise<boolean>
}

export interface ICourseRepository {
  /**
   * Get all courses
   */
  findAll(): Promise<Course[]>

  /**
   * Find a course by ID
   */
  findById(id: string): Promise<Course | null>

  /**
   * Create a new course
   */
  create(course: Omit<Course, "id" | "comments">): Promise<Course>

  /**
   * Update a course
   */
  update(id: string, course: Partial<Course>): Promise<Course | null>

  /**
   * Delete a course
   */
  delete(id: string): Promise<boolean>
}

export interface ICommentRepository {
  /**
   * Add a comment to a course
   */
  addComment(courseId: string, userId: string, userName: string, content: string): Promise<Comment | null>

  /**
   * Add a reply to a comment (supports nested replies)
   */
  addReply(
    courseId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
  ): Promise<Comment | null>

  /**
   * Get all comments for a course
   */
  findByCourseId(courseId: string): Promise<Comment[]>

  /**
   * Delete a comment (and all its replies)
   */
  deleteComment(courseId: string, commentId: string): Promise<boolean>

  /**
   * Update a comment
   */
  updateComment(courseId: string, commentId: string, content: string): Promise<Comment | null>
}
