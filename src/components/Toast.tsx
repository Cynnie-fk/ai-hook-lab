'use client'

import type { ToastItem } from '@/lib/types'

interface Props {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

const iconMap: Record<ToastItem['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

const bgMap: Record<ToastItem['type'], string> = {
  success: 'bg-accent-green/20 border-accent-green/30',
  error: 'bg-danger/20 border-danger/30',
  warning: 'bg-accent-amber/20 border-accent-amber/30',
  info: 'bg-accent-blue/20 border-accent-blue/30',
}

export function Toast({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm animate-[fadeInUp_0.3s_ease-out] ${bgMap[toast.type]}`}
        >
          <span className="text-xs font-bold">{iconMap[toast.type]}</span>
          <span className="text-text-primary flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-text-muted hover:text-text-primary text-xs"
            aria-label="关闭提示"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
