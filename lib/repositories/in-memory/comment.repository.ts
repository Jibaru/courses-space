import type { Comment } from "../../store"
import type { ICommentRepository } from "../interfaces"
import type { InMemoryCourseRepository } from "./course.repository"

/**
 * In-Memory Comment Repository Implementation
 *
 * This implementation stores comments within courses in memory.
 * Requires access to the course repository to manage course comments.
 */
export class InMemoryCommentRepository implements ICommentRepository {
  constructor(private courseRepository: InMemoryCourseRepository) {}

  async addComment(courseId: string, userId: string, userName: string, content: string): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (course) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId,
        userName,
        content,
        createdAt: new Date(),
        replies: [],
      }
      course.comments.push(comment)
      return comment
    }
    return null
  }

  async addReply(
    courseId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
  ): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (course) {
      const findAndReply = (comments: Comment[]): Comment | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            const reply: Comment = {
              id: Date.now().toString(),
              userId,
              userName,
              content,
              createdAt: new Date(),
              replies: [],
            }
            comment.replies.push(reply)
            return reply
          }
          const found = findAndReply(comment.replies)
          if (found) return found
        }
        return null
      }
      return findAndReply(course.comments)
    }
    return null
  }

  async findByCourseId(courseId: string): Promise<Comment[]> {
    const course = await this.courseRepository.findById(courseId)
    return course ? [...course.comments] : []
  }

  async deleteComment(courseId: string, commentId: string): Promise<boolean> {
    const course = await this.courseRepository.findById(courseId)
    if (course) {
      const deleteRecursive = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === commentId) {
            comments.splice(i, 1)
            return true
          }
          if (deleteRecursive(comments[i].replies)) {
            return true
          }
        }
        return false
      }
      return deleteRecursive(course.comments)
    }
    return false
  }

  async updateComment(courseId: string, commentId: string, content: string): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (course) {
      const findAndUpdate = (comments: Comment[]): Comment | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            comment.content = content
            return comment
          }
          const found = findAndUpdate(comment.replies)
          if (found) return found
        }
        return null
      }
      return findAndUpdate(course.comments)
    }
    return null
  }
}
