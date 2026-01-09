# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **full-stack learning platform** built with Next.js 16 and React 19. It features course management, user management, and a commenting system with nested replies. Data is managed through Next.js API routes with JWT authentication, using an in-memory store on the server (data resets on server restart).

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Run linter
pnpm lint
```

**Note**: This project uses `pnpm` as the package manager.

## Technology Stack

- **Framework**: Next.js 16.0.10 with App Router (API Routes + Client Components)
- **UI**: React 19.2.0 with TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.9 with CSS variables (oklch color space)
- **Components**: Shadcn/UI with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Content**: React Markdown with syntax highlighting
- **Authentication**: JWT tokens with jsonwebtoken library
- **API Client**: Custom fetch wrapper with auto token injection

## Architecture

### API-Based Data Layer

The application uses Next.js API routes with server-side in-memory storage. Key components:

**Type Definitions** ([lib/store.ts](lib/store.ts)):
- `User`: Authentication and user management
- `Course`: Course data with video, content, and resources
- `Comment`: Recursive structure supporting nested replies

**Server-Side Data** ([lib/data-store.ts](lib/data-store.ts)):
- In-memory data arrays and CRUD operations
- Used exclusively by API routes
- Data resets on server restart

**API Routes** ([app/api/](app/api/)):
- Authentication: `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`
- Users: `/api/users`, `/api/users/[id]`
- Courses: `/api/courses`, `/api/courses/[id]`
- Comments: `/api/courses/[courseId]/comments`, `/api/courses/[courseId]/comments/[commentId]/replies`

**Authentication**:
- JWT tokens stored in localStorage
- Token automatically sent via Authorization header
- Managed by [lib/auth-context.tsx](lib/auth-context.tsx)
- Default credentials: admin@pullrequest.com / admin123

**API Client** ([lib/api.ts](lib/api.ts)):
- Fetch wrapper with automatic JWT token injection
- Error handling with custom APIError class
- Convenience methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

### Application Structure

```
app/
├── api/             - Next.js API routes
│   ├── auth/       - Authentication endpoints (login, signup, me)
│   ├── users/      - User CRUD endpoints
│   └── courses/    - Courses and comments endpoints
├── page.tsx         - Main entry: auth gate + dashboard layout
├── layout.tsx       - Root layout with AuthProvider wrapper
└── globals.css      - CSS variables and Tailwind imports

components/
├── auth/            - Authentication forms (login/signup)
├── courses/         - Course display, detail view, comments with API integration
├── dashboard/       - Dashboard content and sidebar navigation
├── users/           - User management with API integration
└── ui/              - Shadcn/UI base components (~60+ primitives)

lib/
├── store.ts         - Type definitions only (User, Course, Comment)
├── data-store.ts    - Server-side in-memory data store
├── api.ts           - API client with fetch wrapper
├── auth-context.tsx - Authentication context provider
├── auth-middleware.ts - JWT verification middleware for API routes
├── jwt.ts           - JWT token generation and verification
└── utils.ts         - Utility functions (cn for classNames)

hooks/
├── use-mobile.ts    - Mobile detection for responsive UI
└── use-toast.ts     - Toast notification system
```

### State Management Pattern

- **Authentication**: Managed by React Context ([lib/auth-context.tsx](lib/auth-context.tsx))
  - `useAuth()` hook provides `user`, `login()`, `signup()`, `logout()`
  - JWT token stored in localStorage
  - Auto-refresh on app load
- **Data Fetching**: Components fetch data via API on mount using `useEffect`
- **Local State**: Managed with `useState` at component level
- **Optimistic Updates**: Comments use optimistic UI updates, reverting on API failure

### Key Architecture Decisions

1. **API-First Architecture**: All data operations go through Next.js API routes
   - Client components use "use client" directive
   - API routes handle business logic and data management
   - JWT middleware protects authenticated endpoints

2. **Recursive Comments**: The comment system supports unlimited nesting depth
   - API endpoints: POST to add comments/replies
   - Optimistic updates in UI for better UX
   - Server recursively finds correct parent for nested replies

3. **JWT Authentication**:
   - Tokens generated on login/signup
   - Stored in localStorage
   - Sent via Authorization header (`Bearer <token>`)
   - Verified by middleware in API routes

4. **Optimistic UI Updates**: Comments and replies update UI immediately, then sync with API
   - Improves perceived performance
   - Reverts on API failure

5. **Path Aliases**: TypeScript configured with `@/*` mapping to root directory

6. **Type Safety**: Strict TypeScript mode enabled throughout

## Component Patterns

### Shadcn/UI Components

Base UI components in `components/ui/` follow the Shadcn pattern:
- Radix UI primitives wrapped with Tailwind styling
- Class name merging via `cn()` utility from [lib/utils.ts](lib/utils.ts)
- Configured in [components.json](components.json) with "new-york" style

### Form Handling

Forms use React Hook Form with Zod schemas:
- See [components/login/login-form.tsx](components/login/login-form.tsx) for reference pattern
- Client-side validation with error states
- Loading states during submission

### Content Rendering

Course content uses React Markdown:
- Markdown rendering with syntax highlighting for code blocks
- Video embedding support
- Resource downloads (PDF, ZIP files)

## Styling System

### CSS Variables (app/globals.css)

Color system uses oklch color space with CSS variables for theming:
- `--background`, `--foreground` for base colors
- `--primary`, `--secondary` for brand colors
- `--accent`, `--muted` for UI elements
- Dark mode supported via next-themes

### Tailwind Configuration

Tailwind 4.x with PostCSS plugin (@tailwindcss/postcss). No separate `tailwind.config.js` - configuration handled via CSS directives.

## Common Workflows

### Adding New Features

1. For UI components, check if Shadcn/UI provides a base in `components/ui/`
2. Feature components go in dedicated directories (`components/{feature}/`)
3. Update the store in [lib/store.ts](lib/store.ts) if new data operations are needed
4. Use existing patterns for state management and props drilling

### Working with API Routes

All data operations go through API endpoints. Use the `api` client from [lib/api.ts](lib/api.ts):

```typescript
import { api } from "@/lib/api"

// GET request (authenticated)
const users = await api.get<User[]>("/api/users", true)

// POST request (authenticated)
const newUser = await api.post("/api/users", { email, password }, true)

// PUT request (authenticated)
const updated = await api.put(`/api/users/${id}`, { email, password }, true)

// DELETE request (authenticated)
await api.delete(`/api/users/${id}`, true)
```

**API Endpoints**:
- Authentication: `/api/auth/login`, `/api/auth/signup`, `/api/auth/me`
- Users: `GET/POST /api/users`, `GET/PUT/DELETE /api/users/[id]`
- Courses: `GET /api/courses`, `GET /api/courses/[id]`
- Comments: `POST /api/courses/[courseId]/comments`
- Replies: `POST /api/courses/[courseId]/comments/[commentId]/replies`

### Creating New API Routes

1. Create route file in [app/api/](app/api/) directory
2. Import `requireAuth` from [lib/auth-middleware.ts](lib/auth-middleware.ts) for protected routes
3. Import `dataStore` from [lib/data-store.ts](lib/data-store.ts) for data operations
4. Return `NextResponse.json()` with appropriate status codes

Example:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { dataStore } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request) // Verify JWT
    const data = dataStore.getSomeData()
    return NextResponse.json(data)
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

### Modifying Comments System

Comments use recursive structure with optimistic updates:
- Top-level comments are in `course.comments[]`
- Each comment has a `replies[]` array containing nested Comment objects
- Client-side: Optimistic update → API call → Replace with real data on success
- Server-side: Recursive traversal to find parent comment (see [lib/data-store.ts](lib/data-store.ts))
- API handles creating proper IDs and timestamps

## Important Notes

- **In-Memory Storage**: Server-side data stored in memory, resets on server restart
- **JWT Secret**: Set `JWT_SECRET` in `.env.local` (defaults to insecure value if not set)
- **No Database**: Data is not persisted to a database - use `dataStore` in [lib/data-store.ts](lib/data-store.ts)
- **Image Optimization Disabled**: [next.config.mjs](next.config.mjs) disables Next.js image optimization
- **TypeScript Errors Ignored in Build**: Build process ignores TS errors (configured in next.config.mjs)
- **Default Credentials**: admin@pullrequest.com / admin123
- **Package Manager**: This project uses `pnpm`, not `npm`

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important**: Change the JWT_SECRET to a secure random string in production!
