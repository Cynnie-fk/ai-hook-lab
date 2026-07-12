'use client'

import { useEffect, useState, useCallback } from 'react'
import { InputPanel } from '@/components/InputPanel'
import { HookCardGrid } from '@/components/HookCardGrid'
import { ErrorBanner } from '@/components/ErrorBanner'
import { Toast } from '@/components/Toast'
import { useGenerateHooks } from '@/hooks/useGenerateHooks'
import { useHistory } from '@/hooks/useHistory'
import { useFavorites } from '@/hooks/useFavorites'
import { useToast } from '@/hooks/useToast'
import type { HookResult, GenerateRequest } from '@/lib/types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function HomePage() {
  const { hooks, loading, error, generate, reset } = useGenerateHooks()
  const { addTask } = useHistory()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toasts, addToast, removeToast } = useToast()
  const [lastRequest, setLastRequest] = useState<GenerateRequest | null>(null)

  const handleGenerate = useCallback(
    (req: GenerateRequest) => {
      setLastRequest(req)
      generate(req)
    },
    [generate]
  )

  const handleToggleFavorite = useCallback(
    (hook: HookResult) => {
      toggleFavorite(hook)
      if (isFavorite(hook.id)) {
        addToast('info', '已取消收藏')
      } else {
        addToast('success', '已添加到收藏')
      }
    },
    [toggleFavorite, isFavorite, addToast]
  )

  // Save to history when generation completes
  useEffect(() => {
    if (!loading && hooks.length === 10 && lastRequest) {
      addTask({
        id: generateId(),
        topic: lastRequest.topic,
        platform: lastRequest.platform,
        contentType: lastRequest.contentType,
        hooks: hooks.map((h) => ({ ...h, isFavorite: isFavorite(h.id) })),
        createdAt: Date.now(),
      })
      addToast('success', '已保存到历史记录')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hooks.length])

  return (
    <div className="space-y-8">
      {/* Missing config banner */}
      {error && (error.includes('AI_API_KEY') || error.includes('AI_BASE_URL') || error.includes('AI_MODEL')) && (
        <div className="max-w-2xl mx-auto">
          <ErrorBanner
            title="未配置 API Key"
            message="请先在项目根目录的 .env.local 文件中配置 AI_API_KEY、AI_BASE_URL、AI_MODEL 三个环境变量，然后重启 dev server"
          />
        </div>
      )}

      {/* Hero / input area */}
      {hooks.length === 0 && (
        <div className="pt-8 sm:pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
              AI Hook Lab
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              输入主题，AI 为你生成 10 个不同风格的爆款开头
            </p>
          </div>
          <InputPanel onGenerate={handleGenerate} loading={loading} />
        </div>
      )}

      {/* Input when results exist */}
      {hooks.length > 0 && (
        <InputPanel onGenerate={handleGenerate} loading={loading} />
      )}

      {/* Generating status */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-text-secondary text-sm">
            已生成 {hooks.length}/10 个 Hook
            <span className="inline-block ml-1 animate-pulse">✨</span>
          </p>
        </div>
      )}

      {/* Error */}
      {error && !error.includes('AI_API_KEY') && !error.includes('AI_BASE_URL') && !error.includes('AI_MODEL') && (
        <ErrorBanner title="生成失败" message={error} onRetry={reset} />
      )}

      {/* Results */}
      {hooks.length > 0 && (
        <div>
          {hooks.length >= 10 && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">生成结果</h2>
              <button
                onClick={reset}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                清空重新生成
              </button>
            </div>
          )}
          <HookCardGrid hooks={hooks} isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} />
        </div>
      )}

      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
