import { MongoClient } from "mongodb"

/**
 * MongoDB Connection Utility
 *
 * This module manages the MongoDB client connection using a singleton pattern.
 * In development, it reuses the connection across hot reloads.
 * In production, it creates a fresh connection.
 */

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/learning-platform"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Extend NodeJS global to include MongoDB client promise
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve value across module reloads
  // This prevents creating new connections on every hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise
export default clientPromise
