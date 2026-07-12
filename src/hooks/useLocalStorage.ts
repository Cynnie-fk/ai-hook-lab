'use client'

import { useState, useEffect, useCallback } from 'react'
import { getItem, setItem } from '@/lib/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setValue(getItem(key, initialValue))
    setLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = newValue instanceof Function ? newValue(prev) : newValue
        setItem(key, resolved)
        return resolved
      })
    },
    [key]
  )

  return [value, update, loaded] as const
}
