"use client"

import type React from "react"

import { useState } from "react"
import type { Course, Comment } from "@/lib/store"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, MessageCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CourseDetailProps {
  course: Course
  onBack: () => void
}

export function CourseDetail({ course, onBack }: CourseDetailProps) {
  const [comments, setComments] = useState(course.comments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    // Optimistic update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      userId: "temp",
      userName: "You",
      content: newComment,
      createdAt: new Date(),
      replies: [],
    }

    const previousComments = comments
    setComments([...comments, optimisticComment])
    setNewComment("")

    try {
      // Call API
      const savedComment = await api.post<Comment>(
        `/api/courses/${course.id}/comments`,
        { content: newComment },
        true,
      )

      // Replace optimistic comment with real one
      setComments((current) => current.map((c) => (c.id === optimisticComment.id ? savedComment : c)))
    } catch (err: any) {
      // Revert on error
      setComments(previousComments)
      setNewComment(newComment)
      alert(err.message || "Failed to add comment")
    }
  }

  const handleAddReply = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault()
    if (!replyText.trim()) return

    // Optimistic update
    const optimisticReply: Comment = {
      id: `temp-${Date.now()}`,
      userId: "temp",
      userName: "You",
      content: replyText,
      createdAt: new Date(),
      replies: [],
    }

    const updateCommentsWithReply = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, optimisticReply],
          }
        }
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies),
        }
      })
    }

    const previousComments = comments
    setComments(updateCommentsWithReply(comments))
    const replyContent = replyText
    setReplyText("")
    setReplyingTo(null)

    try {
      // Call API
      const savedReply = await api.post<Comment>(
        `/api/courses/${course.id}/comments/${commentId}/replies`,
        { content: replyContent },
        true,
      )

      // Replace optimistic reply with real one
      const replaceOptimistic = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map((r) => (r.id === optimisticReply.id ? savedReply : r)),
            }
          }
          return {
            ...comment,
            replies: replaceOptimistic(comment.replies),
          }
        })
      }
      setComments(replaceOptimistic)
    } catch (err: any) {
      // Revert on error
      setComments(previousComments)
      setReplyText(replyContent)
      setReplyingTo(commentId)
      alert(err.message || "Failed to add reply")
    }
  }

  const MarkdownRenderer = ({ content }: { content: string }) => (
    <div className="prose prose-invert max-w-none text-sm">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" className="rounded-lg my-2" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-secondary px-2 py-1 rounded text-xs font-mono text-primary" {...props}>
                {children}
              </code>
            )
          },
          p({ children }) {
            return <p className="my-2">{children}</p>
          },
          pre({ children }) {
            return <pre className="my-2">{children}</pre>
          },
          ul({ children }) {
            return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2">
                {children}
              </blockquote>
            )
          },
          a({ href, children }) {
            return (
              <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )

  const renderComments = (comments: typeof course.comments, depth = 0) => {
    return (
      <div className={`space-y-4 ${depth > 0 ? "ml-8 border-l border-border pl-4" : ""}`}>
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="rounded-lg bg-secondary p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="text-foreground mb-3">
                <MarkdownRenderer content={comment.content} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Reply
              </Button>
            </div>

            {replyingTo === comment.id && (
              <form onSubmit={(e) => handleAddReply(e, comment.id)} className="ml-0 space-y-2">
                <div className="bg-secondary/50 p-3 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Markdown and code supported. Use triple backticks for code blocks.
                  </p>
                  <textarea
                    placeholder="Write a reply... (Markdown supported)"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Reply
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="text-primary hover:bg-primary/10">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{course.videoTitle}</h1>

        <div className="rounded-lg overflow-hidden bg-black">
          <video src={course.videoUrl} controls className="w-full aspect-video" poster={course.thumbnail} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>About this course</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p className="text-muted-foreground text-sm leading-relaxed">{course.content}</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl">Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Markdown and code supported. Use triple backticks with language name for syntax highlighting.
                    </p>
                    <textarea
                      placeholder="Share your thoughts... (Markdown supported)"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-20 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </Button>
                </form>

                {comments.length > 0 ? (
                  renderComments(comments)
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors border border-border"
                  >
                    <Download className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{resource.name}</p>
                      <p className="text-xs text-muted-foreground uppercase">{resource.type}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
