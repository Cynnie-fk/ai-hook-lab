'use client'

interface ChipProps {
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function Chip({
  selected,
  onClick,
  disabled,
  children,
  className = '',
}: ChipProps) {
  const base =
    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200'
  const active = selected
    ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40 shadow-[0_0_12px_rgba(124,58,237,0.15)]'
    : 'bg-bg-card text-text-secondary border border-border hover:border-border-hover hover:text-text-primary'
  const cursor = disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`${base} ${active} ${cursor} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
