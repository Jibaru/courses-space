import type { Collection, Document } from "mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt"
import type { User } from "../../store"
import type { IUserRepository } from "../interfaces"

/**
 * MongoDB User Repository Implementation
 *
 * This implementation stores users in MongoDB using _id as the primary key.
 * The _id field is mapped to the 'id' field in our User type.
 */

type MongoUser = Omit<User, "id"> & { _id: ObjectId }

export class MongoUserRepository implements IUserRepository {
  constructor(private collection: Collection<Document>) {}

  private toUser(doc: MongoUser): User {
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      createdAt: doc.createdAt,
    }
  }

  async findByCredentials(email: string, password: string): Promise<User | null> {
    const doc = (await this.collection.findOne({ email })) as MongoUser | null
    if (!doc) {
      return null
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, doc.password)
    if (!isPasswordValid) {
      return null
    }

    return this.toUser(doc)
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = (await this.collection.findOne({ email })) as MongoUser | null
    return doc ? this.toUser(doc) : null
  }

  async findById(id: string): Promise<User | null> {
    try {
      const doc = (await this.collection.findOne({ _id: new ObjectId(id) })) as MongoUser | null
      return doc ? this.toUser(doc) : null
    } catch (error) {
      // Invalid ObjectId format
      return null
    }
  }

  async findAll(): Promise<User[]> {
    const docs = (await this.collection.find({}).toArray()) as MongoUser[]
    return docs.map((doc) => this.toUser(doc))
  }

  async create(email: string, password: string): Promise<User> {
    // Hash the password before storing
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const doc: Omit<MongoUser, "_id"> = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }
    const result = await this.collection.insertOne(doc)
    return {
      id: result.insertedId.toString(),
      email,
      password: hashedPassword,
      createdAt: doc.createdAt,
    }
  }

  async update(id: string, email: string, password: string): Promise<User | null> {
    try {
      // Hash the password before updating
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { email, password: hashedPassword } },
        { returnDocument: "after" },
      )
      return result ? this.toUser(result as MongoUser) : null
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
