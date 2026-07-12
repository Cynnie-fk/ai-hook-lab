'use client'

import { PLATFORMS } from '@/lib/constants'
import type { Platform } from '@/lib/types'
import { Chip } from './ui/Chip'

interface Props {
  value: Platform
  onChange: (p: Platform) => void
  disabled?: boolean
}

export function PlatformSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => (
        <Chip
          key={p.id}
          selected={value === p.id}
          onClick={() => onChange(p.id)}
          disabled={disabled}
        >
          {p.label}
        </Chip>
      ))}
    </div>
  )
}
