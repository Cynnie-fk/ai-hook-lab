interface Props {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ title, message, onRetry }: Props) {
  return (
    <div className="rounded-xl bg-danger/10 border border-danger/20 p-5 text-center">
      <div className="text-danger text-sm font-medium mb-1">{title}</div>
      <p className="text-text-secondary text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 rounded-lg bg-danger/20 text-danger text-sm hover:bg-danger/30 transition-colors"
        >
          重试
        </button>
      )}
    </div>
  )
}
