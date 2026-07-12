'use client'

import type { HookResult } from '@/lib/types'
import { HookBadge } from './HookBadge'
import { ScoreBar } from './ScoreBar'
import { useState } from 'react'

interface Props {
  hook: HookResult
  isFavorite: boolean
  onToggleFavorite: (hook: HookResult) => void
  showActions?: boolean
  animate?: boolean
}

export function HookCard({
  hook,
  isFavorite,
  onToggleFavorite,
  showActions = true,
  animate = false,
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hook.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: create temp textarea (Clipboard API may be denied in insecure contexts)
      const ta = document.createElement('textarea')
      ta.value = hook.content
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Both methods failed — silently ignore
      }
      document.body.removeChild(ta)
    }
  }

  return (
    <div
      className={`
        group relative rounded-xl bg-bg-card border border-border p-5
        hover:border-accent-purple/30 hover:shadow-[0_0_24px_rgba(124,58,237,0.08)]
        transition-all duration-300 hover:-translate-y-0.5
        ${animate ? 'animate-[fadeInUp_0.4s_ease-out_both]' : ''}
      `}
    >
      {/* Accent line */}
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-accent-purple to-accent-blue opacity-60" />

      <div className="pl-3">
        {/* Header: tag + actions */}
        <div className="flex items-center justify-between mb-3">
          <HookBadge tag={hook.styleTag} />
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors"
                aria-label={copied ? '已复制' : '复制文案'}
              >
                {copied ? (
                  <svg
                    className="w-4 h-4 text-accent-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => onToggleFavorite(hook)}
                className={`p-1.5 rounded-md transition-colors ${
                  isFavorite
                    ? 'text-accent-amber hover:bg-accent-amber/10'
                    : 'text-text-muted hover:text-accent-amber hover:bg-accent-amber/10'
                }`}
                aria-label={isFavorite ? '取消收藏' : '收藏'}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-text-primary text-sm leading-relaxed mb-3">{hook.content}</p>

        {/* Score */}
        <div className="mb-2">
          <ScoreBar score={hook.score} />
        </div>

        {/* Reason */}
        <p className="text-xs text-text-muted leading-relaxed">{hook.reason}</p>
      </div>
    </div>
  )
}
