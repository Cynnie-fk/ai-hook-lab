'use client'

import type { HookResult } from '@/lib/types'
import { HookCard } from './HookCard'

interface Props {
  hooks: HookResult[]
  isFavorite: (hookId: string) => boolean
  onToggleFavorite: (hook: HookResult) => void
}

export function HookCardGrid({ hooks, isFavorite, onToggleFavorite }: Props) {
  if (hooks.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {hooks.map((hook) => (
        <HookCard
          key={hook.id}
          hook={hook}
          isFavorite={isFavorite(hook.id)}
          onToggleFavorite={onToggleFavorite}
          animate
        />
      ))}
    </div>
  )
}
