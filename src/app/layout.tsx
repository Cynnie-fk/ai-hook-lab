import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '@/app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-hook-lab.vercel.app'),
  title: 'AI Hook Lab — AI爆款Hook生成器',
  description:
    'AI 爆款开头 Hook 生成器 — 输入主题，一键生成 10 个不同风格的爆款文案开头，覆盖小红书、抖音、B站、YouTube、X',
  keywords: ['AI', 'Hook', '文案生成', '社交媒体', '小红书', '抖音', 'B站'],
  openGraph: {
    title: 'AI Hook Lab — AI爆款Hook生成器',
    description: '输入主题，一键生成 10 个不同风格的爆款文案开头',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary',
    title: 'AI Hook Lab',
    description: 'AI 爆款开头 Hook 生成器',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-bg-primary text-text-primary">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </body>
    </html>
  )
}
