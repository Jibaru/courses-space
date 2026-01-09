import type { Collection, Document } from "mongodb"
import { ObjectId } from "mongodb"
import type { Course } from "../../store"
import type { ICourseRepository } from "../interfaces"

/**
 * MongoDB Course Repository Implementation
 *
 * This implementation stores courses in MongoDB using _id as the primary key.
 * The _id field is mapped to the 'id' field in our Course type.
 */

type MongoCourse = Omit<Course, "id"> & { _id: ObjectId }

export class MongoCourseRepository implements ICourseRepository {
  constructor(private collection: Collection<Document>) {}

  private toCourse(doc: MongoCourse): Course {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      thumbnail: doc.thumbnail,
      videoUrl: doc.videoUrl,
      videoTitle: doc.videoTitle,
      content: doc.content,
      resources: doc.resources,
      comments: doc.comments,
    }
  }

  async findAll(): Promise<Course[]> {
    const docs = (await this.collection.find({}).toArray()) as MongoCourse[]
    return docs.map((doc) => this.toCourse(doc))
  }

  async findById(id: string): Promise<Course | null> {
    try {
      const doc = (await this.collection.findOne({ _id: new ObjectId(id) })) as MongoCourse | null
      return doc ? this.toCourse(doc) : null
    } catch (error) {
      // Invalid ObjectId format
      return null
    }
  }

  async create(course: Omit<Course, "id" | "comments">): Promise<Course> {
    const doc: Omit<MongoCourse, "_id"> = {
      ...course,
      comments: [],
    }
    const result = await this.collection.insertOne(doc)
    return {
      ...course,
      id: result.insertedId.toString(),
      comments: [],
    }
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course | null> {
    try {
      // Remove 'id' from courseData if it exists (we don't want to update _id)
      const { id: _removedId, ...updateData } = courseData as any

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" },
      )
      return result ? this.toCourse(result as MongoCourse) : null
    } catch (error) {
      // Invalid ObjectId format
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      // Invalid ObjectId format
      return false
    }
  }
}

