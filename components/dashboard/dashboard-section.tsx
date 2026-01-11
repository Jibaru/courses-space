"use client"

export function DashboardSection() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">Courses Space</h2>
          <p className="text-muted-foreground">Learning platform.</p>
        </div>

        <div className="flex gap-6 justify-center text-sm">
          <a
            href="https://github.com/jibaru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.youtube.com/@pull-request"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            YouTube
          </a>
          <a
            href="https://linkedin.com/in/ignacior97"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
