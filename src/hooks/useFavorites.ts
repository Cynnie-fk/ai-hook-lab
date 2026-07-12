'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { LS_KEYS } from '@/lib/constants'
import type { HookResult } from '@/lib/types'

export function useFavorites() {
  const [favorites, setFavorites, loaded] = useLocalStorage<HookResult[]>(LS_KEYS.favorites, [])

  const toggleFavorite = useCallback(
    (hook: HookResult) => {
      setFavorites((prev) => {
        const exists = prev.find((f) => f.id === hook.id)
        if (exists) {
          return prev.filter((f) => f.id !== hook.id)
        }
        return [...prev, { ...hook, isFavorite: true }]
      })
    },
    [setFavorites]
  )

  const isFavorite = useCallback(
    (hookId: string) => favorites.some((f) => f.id === hookId),
    [favorites]
  )

  return { favorites, loaded, toggleFavorite, isFavorite }
}
