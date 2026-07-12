'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: '生成' },
  { href: '/history', label: '历史' },
  { href: '/favorites', label: '收藏' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/80 backdrop-blur-xl" aria-label="主导航">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent"
          aria-label="AI Hook Lab 首页"
        >
          AI Hook Lab
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                pathname === item.href
                  ? 'bg-accent-purple/20 text-accent-purple'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
