# MongoDB Setup Guide

This guide explains how to switch from in-memory storage to MongoDB in the learning platform.

## Quick Start

### Option 1: Use In-Memory Storage (Default)

No setup required! The application uses in-memory storage by default.

```bash
# In .env.local
USE_MONGODB=false
# or simply omit USE_MONGODB
```

**Note**: Data is lost when the server restarts.

### Option 2: Use MongoDB

#### Step 1: Set up MongoDB

**Option A: Local MongoDB**
1. Download and install MongoDB Community Server from [mongodb.com/download](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Click "Connect" and get your connection string
5. Whitelist your IP address or use 0.0.0.0/0 for development

#### Step 2: Update Environment Variables

Edit `.env.local`:

```bash
# Enable MongoDB
USE_MONGODB=true

# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017

# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Database name
MONGODB_DB_NAME=learning-platform
```

#### Step 3: Restart the Development Server

```bash
pnpm dev
```

That's it! Your application now uses MongoDB for persistent storage.

## Database Schema

### Collections

The application uses the following MongoDB collections:

#### `users`
```javascript
{
  _id: ObjectId,        // MongoDB's native _id (mapped to 'id' in application)
  email: String,
  password: String,     // Note: Plain text (for demo only - use bcrypt in production!)
  createdAt: Date
}
```

**Note**: The repository layer automatically converts MongoDB's `_id` (ObjectId) to a string `id` when returning data to the application, and converts string `id` back to ObjectId `_id` when querying.

#### `courses`
```javascript
{
  _id: ObjectId,        // MongoDB's native _id (mapped to 'id' in application)
  title: String,
  description: String,
  thumbnail: String,
  videoUrl: String,
  videoTitle: String,
  content: String,
  resources: [
    {
      name: String,
      type: String,      // 'pdf' | 'zip' | 'code'
      url: String
    }
  ],
  comments: [           // Embedded documents
    {
      id: String,       // Note: Comment IDs are strings (ObjectId.toString())
      userId: String,
      userName: String,
      content: String,
      createdAt: Date,
      replies: [...]    // Recursive structure
    }
  ]
}
```

**Note**: Comments and replies use string IDs (generated from ObjectId) rather than ObjectId since they are embedded documents.

## Seeding Initial Data

### Option 1: Create Data Through the UI

1. Start the application with MongoDB enabled
2. Log in with default credentials (if admin user doesn't exist, sign up)
3. Create courses and users through the UI

### Option 2: Manual Seed Script

Create a file `scripts/seed-mongodb.ts`:

```typescript
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = process.env.MONGODB_DB_NAME || "learning-platform"

async function seed() {
  const client = await MongoClient.connect(uri)
  const db = client.db(dbName)

  // Clear existing data (optional)
  await db.collection("users").deleteMany({})
  await db.collection("courses").deleteMany({})

  // Seed admin user (MongoDB will auto-generate _id)
  await db.collection("users").insertOne({
    email: "admin@pullrequest.com",
    password: "admin123",
    createdAt: new Date(),
  })

  // Seed courses
  await db.collection("courses").insertMany([
    {
      title: "React Fundamentals",
      description: "Learn the basics of React including components, hooks, and state management.",
      thumbnail: "/react-course-thumbnail.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "React Fundamentals Tutorial",
      content: "This comprehensive course covers React fundamentals including functional components, hooks, state management, and more.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf",
          url: "/pdf-document.png",
        },
        {
          name: "starter-code.zip",
          type: "zip",
          url: "/zip-file.png",
        },
      ],
      comments: [],
    },
    {
      title: "TypeScript Advanced",
      description: "Master advanced TypeScript concepts and patterns for production applications.",
      thumbnail: "/typescript-course.jpg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "TypeScript Advanced Patterns",
      content: "Deep dive into advanced TypeScript features including generics, decorators, advanced types, and design patterns.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf",
          url: "/pdf-slides.jpg",
        },
      ],
      comments: [],
    },
    {
      title: "Next.js Full Stack",
      description: "Build full-stack applications with Next.js, API routes, and databases.",
      thumbnail: "/nextjs-course.png",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      videoTitle: "Next.js Full Stack Development",
      content: "Learn how to build complete full-stack applications using Next.js with server-side rendering, API routes, authentication, and database integration.",
      resources: [
        {
          name: "slides.pdf",
          type: "pdf",
          url: "/pdf-document.png",
        },
        {
          name: "project-files.zip",
          type: "zip",
          url: "/zip.jpg",
        },
      ],
      comments: [],
    },
  ])

  console.log("Database seeded successfully!")
  await client.close()
}

seed().catch(console.error)
```

Run with:
```bash
npx tsx scripts/seed-mongodb.ts
```

**Note**: MongoDB will automatically generate `_id` fields as ObjectId for each document. The repository layer converts these to string IDs when reading data.

## Switching Between Storage Types

You can easily switch between in-memory and MongoDB storage by changing one environment variable:

```bash
# Use in-memory storage
USE_MONGODB=false

# Use MongoDB storage
USE_MONGODB=true
```

No code changes needed! The repository pattern handles everything automatically.

## Verification

To verify MongoDB is working:

1. Create a user or course in the UI
2. Restart the dev server
3. The data should still be there (unlike in-memory storage)

You can also connect to MongoDB using:
- MongoDB Compass (GUI)
- MongoDB Shell (`mongosh`)
- VS Code extension

## Troubleshooting

### Connection Refused
- Ensure MongoDB service is running
- Check the connection URI in `.env.local`

### Authentication Failed
- For MongoDB Atlas, ensure IP whitelist is configured
- Verify username/password in connection string

### Data Not Persisting
- Check `USE_MONGODB=true` in `.env.local`
- Verify MongoDB connection in server logs
- Check for error messages on startup

## Production Considerations

⚠️ **Important for Production**:

1. **Password Hashing**: The current implementation stores passwords in plain text. Use `bcrypt` or `argon2` in production.

2. **Connection Pooling**: The MongoDB client handles connection pooling automatically.

3. **Indexes**: Add indexes for better performance:
   ```javascript
   db.users.createIndex({ email: 1 }, { unique: true })
   db.users.createIndex({ id: 1 }, { unique: true })
   db.courses.createIndex({ id: 1 }, { unique: true })
   ```

4. **Environment Variables**: Never commit `.env.local` to version control. Use environment variable management in your hosting platform.

5. **Connection String**: For production, use MongoDB Atlas or a managed MongoDB service with proper authentication and SSL.
