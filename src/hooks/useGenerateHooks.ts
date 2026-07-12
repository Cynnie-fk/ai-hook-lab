'use client'

import { useState, useCallback, useRef } from 'react'
import type { HookResult, GenerateRequest, HookStreamEvent } from '@/lib/types'

interface GenerateState {
  loading: boolean
  hooks: HookResult[]
  error: string | null
}

export function useGenerateHooks() {
  const [state, setState] = useState<GenerateState>({
    loading: false,
    hooks: [],
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (request: GenerateRequest) => {
    // Abort any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ loading: true, hooks: [], error: null })

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: '请求失败' }))
        setState({
          loading: false,
          hooks: [],
          error: errData.message || `HTTP ${res.status}`,
        })
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setState({ loading: false, hooks: [], error: '无法读取响应流' })
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)

          if (data === '[DONE]') {
            setState((prev) => ({ ...prev, loading: false }))
            return
          }

          try {
            const parsed = JSON.parse(data) as HookStreamEvent

            // Check for error event
            if ('error' in parsed && 'message' in parsed && Object.keys(parsed).length === 2) {
              const err = parsed as unknown as { error: string; message: string }
              setState({ loading: false, hooks: [], error: err.message })
              return
            }

            const hook: HookResult = {
              ...parsed,
              isFavorite: false,
            }

            setState((prev) => ({
              ...prev,
              hooks: [...prev.hooks, hook],
            }))
          } catch {
            // Skip malformed JSON lines
          }
        }
      }

      setState((prev) => ({ ...prev, loading: false }))
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      setState({
        loading: false,
        hooks: [],
        error: err instanceof Error ? err.message : '生成失败，请重试',
      })
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState({ loading: false, hooks: [], error: null })
  }, [])

  return { ...state, generate, reset }
}
