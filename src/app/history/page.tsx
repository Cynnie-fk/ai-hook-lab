'use client'

import { useState, useMemo } from 'react'
import { useHistory } from '@/hooks/useHistory'
import { useFavorites } from '@/hooks/useFavorites'
import { HookCard } from '@/components/HookCard'
import { EmptyState } from '@/components/EmptyState'
import { PLATFORMS, CONTENT_TYPES } from '@/lib/constants'
import type { HookResult, GenerationTask } from '@/lib/types'

export default function HistoryPage() {
  const { tasks, loaded, removeTask } = useHistory()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleFavorite = (hook: HookResult) => {
    toggleFavorite(hook)
  }

  // 搜索过滤逻辑
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks

    const query = searchQuery.trim().toLowerCase()

    return tasks.filter((task: GenerationTask) => {
      // 匹配话题关键词
      if (task.topic.toLowerCase().includes(query)) return true

      // 匹配平台名称
      const platformLabel = PLATFORMS.find((p) => p.id === task.platform)?.label || ''
      if (platformLabel.toLowerCase().includes(query)) return true

      // 匹配内容类型
      const typeLabel = CONTENT_TYPES.find((c) => c.id === task.contentType)?.label || ''
      if (typeLabel.toLowerCase().includes(query)) return true

      // 匹配 Hook 内容或风格标签
      return task.hooks.some(
        (hook) =>
          hook.content.toLowerCase().includes(query) ||
          hook.styleTag.toLowerCase().includes(query)
      )
    })
  }, [tasks, searchQuery])

  if (!loaded) {
    return <div className="text-center py-20 text-text-muted">加载中...</div>
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="暂无历史记录"
        description="去首页生成你的第一组 Hook 吧"
        action={{ label: '开始生成', href: '/' }}
      />
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">历史记录</h1>
        <span className="text-sm text-text-muted">{filteredTasks.length} 条记录</span>
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索话题、平台、风格标签..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-bg-card border border-border text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果为空 */}
      {searchQuery.trim() && filteredTasks.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          title="未找到匹配记录"
          description={`没有找到与"${searchQuery}"相关的结果，试试其他关键词`}
        />
      ) : (
        filteredTasks.map((task) => {
          const isExpanded = expandedTaskId === task.id
          const platformLabel = PLATFORMS.find((p) => p.id === task.platform)?.label || task.platform
          const typeLabel = CONTENT_TYPES.find((c) => c.id === task.contentType)?.label || task.contentType

          return (
            <div key={task.id} className="rounded-xl bg-bg-card border border-border overflow-hidden">
              {/* Task header */}
              <button
                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{task.topic}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {platformLabel} · {typeLabel} · {task.hooks.length} 个 Hook ·{' '}
                    {new Date(task.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('确定删除这条记录？')) removeTask(task.id)
                    }}
                    className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    title="删除"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <svg
                    className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded hooks */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border space-y-3 pt-4">
                  {task.hooks.map((hook) => (
                    <HookCard
                      key={hook.id}
                      hook={hook}
                      isFavorite={isFavorite(hook.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
