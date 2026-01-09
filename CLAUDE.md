# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **client-side only learning platform** built with Next.js 16 and React 19. It features course management, user management, and a commenting system with nested replies. All data is stored in-memory with no backend or database - data resets on page refresh.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Run linter
npm run lint
```

## Technology Stack

- **Framework**: Next.js 16.0.10 with App Router (Client Components)
- **UI**: React 19.2.0 with TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.9 with CSS variables (oklch color space)
- **Components**: Shadcn/UI with Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Content**: React Markdown with syntax highlighting

## Architecture

### Core Data Layer (lib/store.ts)

The entire application uses an in-memory store with no persistence. Key types:

- `User`: Authentication and user management
- `Course`: Course data with video, content, and resources
- `Comment`: Recursive structure supporting nested replies

**Important**: The store exports a singleton object with methods like `getUser()`, `createUser()`, `getCourses()`, `addComment()`, `addReply()`. All data operations go through [lib/store.ts](lib/store.ts).

**Default credentials**: admin@pullrequest.com / admin123

### Application Structure

```
app/
├── page.tsx          - Main entry: auth gate + dashboard layout
├── layout.tsx        - Root layout with metadata and analytics
└── globals.css       - CSS variables and Tailwind imports

components/
├── auth/            - Authentication forms (login/signup)
├── courses/         - Course display, detail view, comments
├── dashboard/       - Dashboard content and sidebar navigation
├── users/           - User management CRUD operations
└── ui/              - Shadcn/UI base components (~60+ primitives)

lib/
├── store.ts         - In-memory data store and business logic
└── utils.ts         - Utility functions (cn for classNames)

hooks/
├── use-mobile.ts    - Mobile detection for responsive UI
└── use-toast.ts     - Toast notification system
```

### State Management Pattern

- Local state managed with `useState` at component level
- Props drilling for data passing between components
- No global state management library (Redux, Zustand, etc.)
- Authentication state lives in [app/page.tsx:11-13](app/page.tsx#L11-L13)

### Key Architecture Decisions

1. **Client-Side Only**: All rendering happens on the client. The "use client" directive is used throughout.

2. **Recursive Comments**: The comment system supports unlimited nesting depth. Helper function `findAndReply()` in [lib/store.ts:171-189](lib/store.ts#L171-L189) recursively traverses comment trees.

3. **Path Aliases**: TypeScript configured with `@/*` mapping to root directory. Always use `@/` imports (e.g., `@/components/ui/button`).

4. **Responsive Design**: Uses custom `use-mobile` hook for breakpoint detection. Sidebar collapses on mobile.

5. **Type Safety**: Strict TypeScript mode enabled. All components and store methods are fully typed.

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

### Working with the Store

The store object in [lib/store.ts:110-194](lib/store.ts#L110-L194) is the single source of truth. Never mutate data directly - always use provided methods:
- User operations: `getUser`, `createUser`, `updateUser`, `deleteUser`
- Course operations: `getCourses`, `getCourseById`
- Comment operations: `addComment`, `addReply`

### Modifying Comments System

Comments use recursive structure. When working with replies:
- Top-level comments are in `course.comments[]`
- Each comment has a `replies[]` array containing nested Comment objects
- Use recursive traversal to find/update nested comments (see [lib/store.ts:171](lib/store.ts#L171))

## Important Notes

- **No Persistence**: All data resets on refresh. This is by design for demo purposes.
- **No API Routes**: Despite using Next.js, there are no `/app/api` routes. Everything is client-side.
- **Image Optimization Disabled**: [next.config.mjs](next.config.mjs) disables Next.js image optimization.
- **TypeScript Errors Ignored in Build**: Build process ignores TS errors (configured in next.config.mjs). Fix type errors when developing.
- **No Backend**: Do not attempt to add API endpoints or database connections without major architectural changes.
