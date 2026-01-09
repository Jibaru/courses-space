"use client"

export function DashboardSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome to PULL REQUEST</h2>
        <p className="text-muted-foreground mt-2">Your learning platform for mastering web development</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-2xl mb-2">📚</div>
          <h3 className="font-semibold text-card-foreground mb-1">Courses</h3>
          <p className="text-sm text-muted-foreground">Access comprehensive learning materials and video content</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold text-card-foreground mb-1">Users</h3>
          <p className="text-sm text-muted-foreground">Manage platform users and their access</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-2xl mb-2">💬</div>
          <h3 className="font-semibold text-card-foreground mb-1">Community</h3>
          <p className="text-sm text-muted-foreground">Discuss courses and share knowledge with others</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-card-foreground mb-4">About PULL REQUEST</h3>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            PULL REQUEST is a comprehensive learning platform designed to help developers master modern web development
            technologies and practices.
          </p>
          <div className="mt-4 flex gap-4 text-xs">
            <a
              href="https://github.com/jibaru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.youtube.com/@pull-request"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              YouTube
            </a>
            <a
              href="https://linkedin.com/in/ignacior97"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
