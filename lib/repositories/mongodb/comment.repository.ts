import { ObjectId } from "mongodb"
import type { Comment } from "../../store"
import type { ICommentRepository } from "../interfaces"
import type { MongoCourseRepository } from "./course.repository"

/**
 * MongoDB Comment Repository Implementation
 *
 * This implementation stores comments within courses in MongoDB.
 * Comments are embedded documents in the course collection.
 */
export class MongoCommentRepository implements ICommentRepository {
  constructor(private courseRepository: MongoCourseRepository) {}

  async addComment(courseId: string, userId: string, userName: string, content: string): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      return null
    }

    const comment: Comment = {
      id: new ObjectId().toString(),
      userId,
      userName,
      content,
      createdAt: new Date(),
      replies: [],
    }

    // Add comment to course's comments array
    course.comments.push(comment)

    // Update course in database
    await this.courseRepository.update(courseId, { comments: course.comments })

    return comment
  }

  async addReply(
    courseId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string,
  ): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      return null
    }

    const reply: Comment = {
      id: new ObjectId().toString(),
      userId,
      userName,
      content,
      createdAt: new Date(),
      replies: [],
    }

    // Recursively find the target comment and add the reply
    const findAndReply = (comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          comment.replies.push(reply)
          return reply
        }
        const found = findAndReply(comment.replies)
        if (found) return found
      }
      return null
    }

    const addedReply = findAndReply(course.comments)
    if (!addedReply) {
      return null
    }

    // Update course in database with modified comments
    await this.courseRepository.update(courseId, { comments: course.comments })

    return reply
  }

  async findByCourseId(courseId: string): Promise<Comment[]> {
    const course = await this.courseRepository.findById(courseId)
    return course ? course.comments : []
  }

  async deleteComment(courseId: string, commentId: string): Promise<boolean> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      return false
    }

    // Recursively find and delete the comment
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

    const deleted = deleteRecursive(course.comments)
    if (deleted) {
      // Update course in database with modified comments
      await this.courseRepository.update(courseId, { comments: course.comments })
    }

    return deleted
  }

  async updateComment(courseId: string, commentId: string, content: string): Promise<Comment | null> {
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      return null
    }

    // Recursively find and update the comment
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

    const updatedComment = findAndUpdate(course.comments)
    if (updatedComment) {
      // Update course in database with modified comments
      await this.courseRepository.update(courseId, { comments: course.comments })
    }

    return updatedComment
  }
}
