'use client'

import { useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import { HookCard } from '@/components/HookCard'
import { EmptyState } from '@/components/EmptyState'
import { Chip } from '@/components/ui/Chip'
import type { HookResult } from '@/lib/types'

export default function FavoritesPage() {
  const { favorites, loaded, toggleFavorite, isFavorite } = useFavorites()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const handleToggleFavorite = (hook: HookResult) => {
    toggleFavorite(hook)
  }

  const filteredFavorites = activeTag
    ? favorites.filter((h) => h.styleTag === activeTag)
    : favorites

  // Get unique tags from favorites
  const usedTags = [...new Set(favorites.map((h) => h.styleTag))]

  if (!loaded) {
    return <div className="text-center py-20 text-text-muted">加载中...</div>
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        }
        title="暂无收藏"
        description="在生成结果中点击星标收藏你喜欢的 Hook"
        action={{ label: '开始生成', href: '/' }}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">我的收藏</h1>

      {/* Tag filter */}
      {usedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Chip selected={activeTag === null} onClick={() => setActiveTag(null)}>
            全部
          </Chip>
          {usedTags.map((tag) => (
            <Chip key={tag} selected={activeTag === tag} onClick={() => setActiveTag(tag)}>
              {tag}
            </Chip>
          ))}
        </div>
      )}

      {/* Favorites grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFavorites.map((hook) => (
          <HookCard
            key={hook.id}
            hook={hook}
            isFavorite={isFavorite(hook.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
