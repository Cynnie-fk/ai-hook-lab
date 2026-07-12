import Link from 'next/link'

interface Props {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; href: string }
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <h3 className="text-lg font-medium text-text-secondary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
