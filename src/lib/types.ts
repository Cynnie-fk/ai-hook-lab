// Platform identifiers
export type Platform = 'xiaohongshu' | 'douyin' | 'bilibili' | 'youtube' | 'x'

// Content type identifiers
export type ContentType = 'video' | 'image-text' | 'product-ad' | 'tutorial' | 'opinion'

// Single hook result from AI
export interface HookResult {
  id: string
  content: string
  styleTag: string
  score: number // 0-10, one decimal
  reason: string
  isFavorite: boolean
}

// A generation task (one user request → 10 hooks)
export interface GenerationTask {
  id: string
  topic: string
  platform: Platform
  contentType: ContentType
  hooks: HookResult[]
  createdAt: number
}

// POST /api/generate request body
export interface GenerateRequest {
  topic: string
  platform: Platform
  contentType: ContentType
}

// SSE stream event data (success)
export interface HookStreamEvent {
  id: string
  content: string
  styleTag: string
  score: number
  reason: string
}

// SSE stream event data (error)
export interface ErrorStreamEvent {
  error: string
  message: string
}

// Toast notification
export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}
