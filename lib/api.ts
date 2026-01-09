export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("auth_token", token)
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("auth_token")
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  headers.set("Content-Type", "application/json")

  // Add Authorization header if required
  if (requireAuth) {
    const token = getAuthToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // Couldn't parse error response, use default message
    }
    throw new APIError(response.status, errorMessage)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// Convenience methods
export const api = {
  get: <T>(url: string, requireAuth = false) =>
    apiFetch<T>(url, { method: "GET", requireAuth }),

  post: <T>(url: string, data: unknown, requireAuth = false) =>
    apiFetch<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
      requireAuth,
    }),

  put: <T>(url: string, data: unknown, requireAuth = false) =>
    apiFetch<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
      requireAuth,
    }),

  delete: <T>(url: string, requireAuth = false) =>
    apiFetch<T>(url, { method: "DELETE", requireAuth }),
}
