'use client'

import { CONTENT_TYPES } from '@/lib/constants'
import type { ContentType } from '@/lib/types'
import { Chip } from './ui/Chip'

interface Props {
  value: ContentType
  onChange: (c: ContentType) => void
  disabled?: boolean
}

export function ContentTypeSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CONTENT_TYPES.map((ct) => (
        <Chip
          key={ct.id}
          selected={value === ct.id}
          onClick={() => onChange(ct.id)}
          disabled={disabled}
        >
          {ct.label}
        </Chip>
      ))}
    </div>
  )
}
