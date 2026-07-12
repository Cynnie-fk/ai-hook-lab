'use client'

import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { LS_KEYS } from '@/lib/constants'
import type { GenerationTask } from '@/lib/types'

export function useHistory() {
  const [tasks, setTasks, loaded] = useLocalStorage<GenerationTask[]>(LS_KEYS.history, [])

  const addTask = useCallback(
    (task: GenerationTask) => {
      setTasks((prev) => [task, ...prev])
    },
    [setTasks]
  )

  const removeTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    },
    [setTasks]
  )

  return { tasks, loaded, addTask, removeTask }
}
