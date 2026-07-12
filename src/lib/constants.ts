import type { Platform, ContentType } from './types'

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'xiaohongshu', label: '小红书' },
  { id: 'douyin', label: '抖音' },
  { id: 'bilibili', label: 'B 站' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'x', label: 'X' },
]

export const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: 'video', label: '视频' },
  { id: 'image-text', label: '图文' },
  { id: 'product-ad', label: '产品广告' },
  { id: 'tutorial', label: '教程' },
  { id: 'opinion', label: '观点帖' },
]

export const STYLE_TAGS = [
  '悬念',
  '反常识',
  '痛点直击',
  '共鸣共情',
  '身份认同',
  '干货承诺',
  '故事钩子',
  '对比冲突',
  '数字震撼',
  '提问引导',
  '恐吓警告',
  '幽默开场',
  '热点借势',
  '权威背书',
] as const

export type StyleTag = (typeof STYLE_TAGS)[number]

export const PLATFORM_TONE_MAP: Record<Platform, string> = {
  xiaohongshu: '小红书风格：种草分享、生活化口吻、适当用 emoji、亲切姐妹感、段落短小',
  douyin: '抖音风格：快节奏、口语化、强情绪冲击、前3秒制造期待感、适合口播',
  bilibili: 'B站风格：年轻化、有梗有趣、弹幕友好、可以稍深度、标题党但不低俗',
  youtube: 'YouTube风格：标题党风格、中长句、突出专业感和价值承诺、吸引点击',
  x: 'X/Twitter风格：极简犀利、观点鲜明、140字内爆发力、适合碎片阅读',
}

export const LS_KEYS = {
  history: 'ai-hook-lab-history',
  favorites: 'ai-hook-lab-favorites',
} as const
