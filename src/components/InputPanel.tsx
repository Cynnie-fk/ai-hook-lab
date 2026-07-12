'use client'

import { useState } from 'react'
import type { Platform, ContentType, GenerateRequest } from '@/lib/types'
import { PlatformSelector } from './PlatformSelector'
import { ContentTypeSelector } from './ContentTypeSelector'
import { Button } from './ui/Button'

interface Props {
  onGenerate: (req: GenerateRequest) => void
  loading: boolean
  disabled?: boolean
}

export function InputPanel({ onGenerate, loading, disabled }: Props) {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('xiaohongshu')
  const [contentType, setContentType] = useState<ContentType>('video')

  const canSubmit = topic.trim().length > 0 && !loading && !disabled

  const handleSubmit = () => {
    if (!canSubmit) return
    onGenerate({ topic: topic.trim(), platform, contentType })
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Topic input */}
      <div>
        <label htmlFor="hook-topic" className="block text-sm text-text-secondary mb-2">输入主题</label>
        <textarea
          id="hook-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="例如：如何用AI提升工作效率、打工人副业指南、护肤成分党必看..."
          rows={3}
          disabled={loading || disabled}
          className="w-full resize-none rounded-xl bg-bg-input border border-border px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple/50 focus:ring-1 focus:ring-accent-purple/20 transition-colors disabled:opacity-50"
        />
      </div>

      {/* Selectors row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-text-secondary mb-2">选择平台</label>
          <PlatformSelector value={platform} onChange={setPlatform} disabled={loading || disabled} />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-2">内容类型</label>
          <ContentTypeSelector value={contentType} onChange={setContentType} disabled={loading || disabled} />
        </div>
      </div>

      {/* Generate button */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
          size="lg"
          className="min-w-[200px]"
        >
          {loading ? '生成中...' : '⚡ 生成 10 个 Hook'}
        </Button>
      </div>
    </div>
  )
}
