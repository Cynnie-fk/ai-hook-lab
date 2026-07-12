'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-danger/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-text-primary">页面出现错误</h2>
            <p className="text-sm text-text-muted">
              抱歉，当前页面发生了意外错误。请尝试刷新页面，或返回首页重新操作。
            </p>
            {this.state.error && (
              <details className="text-left mt-2">
                <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary">
                  查看错误详情
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-bg-primary text-xs text-danger overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm hover:bg-accent-primary/90 transition-colors"
              >
                刷新页面
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-white/[0.02] transition-colors"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
