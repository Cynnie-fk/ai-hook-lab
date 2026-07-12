import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0a0a0f', card: '#14141f', input: '#1a1a2e' },
        text: { primary: '#e8e8f0', secondary: '#8888a0', muted: '#555570' },
        accent: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          amber: '#f59e0b',
        },
        danger: '#ef4444',
        border: 'rgba(255,255,255,0.06)',
        'border-hover': 'rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
export default config
