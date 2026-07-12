import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { PLATFORM_TONE_MAP, STYLE_TAGS } from '@/lib/constants'
import { PLATFORMS, CONTENT_TYPES } from '@/lib/constants'
import type { Platform, ContentType, GenerateRequest } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60

// ---- 简易内存限流 ----
const RATE_WINDOW_MS = 60_000  // 1 分钟窗口
const MAX_REQUESTS_PER_WINDOW = 10
const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false
  entry.count++
  return true
}

// 清理过期限流记录（每 5 分钟清理一次）
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip)
  }
}, 300_000)
// ---- 限流结束 ----

function buildSystemPrompt(): string {
  const tagList = STYLE_TAGS.join('、')
  return `你是顶级社交媒体文案专家。用户给你主题、平台、内容类型，你生成 10 个不同风格的开头 hook。

每个 hook 必须：
1. 适配目标平台的语气和格式
2. 风格彼此不重复，从预设标签池中选择：${tagList}
3. 自带评分（十分制，保留一位小数）和简短推荐理由（一句话）
4. 每个 hook 的 content 控制在 50-150 字

输出格式：严格 JSON 数组，不要 markdown 包裹，直接输出：
[{"content":"文案内容","styleTag":"风格标签","score":8.5,"reason":"推荐理由一句话"}]

注意：
- 评分要真实区分高低，不要全部给 8 分以上
- 推荐理由要具体，不要说"这个开头不错"这种废话
- 每个 hook 的风格标签必须不同`
}

function buildUserPrompt(
  topic: string,
  platform: Platform,
  contentType: ContentType
): string {
  const tone = PLATFORM_TONE_MAP[platform]
  const typeMap: Record<ContentType, string> = {
    video: '视频',
    'image-text': '图文',
    'product-ad': '产品广告',
    tutorial: '教程',
    opinion: '观点帖',
  }
  return `主题：${topic}
平台风格要求：${tone}
内容类型：${typeMap[contentType]}
生成 10 个不同风格的开头 hook`
}

export async function POST(req: NextRequest) {
  // ---- 限流检查 ----
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'RATE_LIMITED', message: '请求过于频繁，请 1 分钟后再试' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      }
    )
  }

  // ---- 环境变量校验 ----
  const apiKey = process.env.AI_API_KEY
  const baseURL = process.env.AI_BASE_URL
  const model = process.env.AI_MODEL

  if (!apiKey || !baseURL || !model) {
    const missing: string[] = []
    if (!apiKey) missing.push('AI_API_KEY')
    if (!baseURL) missing.push('AI_BASE_URL')
    if (!model) missing.push('AI_MODEL')
    return new Response(
      JSON.stringify({
        error: 'MISSING_CONFIG',
        message: `请先在 .env.local 中配置：${missing.join('、')}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ---- 请求体解析 ----
  let body: GenerateRequest
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'INVALID_REQUEST', message: '请求格式无效' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // ---- 输入校验 ----
  if (!body.topic?.trim()) {
    return new Response(
      JSON.stringify({ error: 'MISSING_TOPIC', message: '请输入主题' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (body.topic.length > 500) {
    return new Response(
      JSON.stringify({ error: 'TOPIC_TOO_LONG', message: '主题不能超过 500 字' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const validPlatforms = PLATFORMS.map((p) => p.id)
  if (!validPlatforms.includes(body.platform)) {
    return new Response(
      JSON.stringify({ error: 'INVALID_PLATFORM', message: '不支持的平台' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const validContentTypes = CONTENT_TYPES.map((c) => c.id)
  if (!validContentTypes.includes(body.contentType)) {
    return new Response(
      JSON.stringify({ error: 'INVALID_CONTENT_TYPE', message: '不支持的内容类型' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const client = new OpenAI({ apiKey, baseURL })

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      let fullResponse = ''

      try {
        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: buildSystemPrompt() },
            {
              role: 'user',
              content: buildUserPrompt(body.topic, body.platform, body.contentType),
            },
          ],
          temperature: 0.9,
          max_tokens: 4096,
          stream: true,
        })

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content
          if (!delta) continue
          fullResponse += delta
        }

        // Parse the full response to extract hook objects
        let jsonStr = fullResponse.trim()
        // Remove markdown code fences if present
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
        // Find the JSON array
        const arrayMatch = jsonStr.match(/\[[\s\S]*\]/)
        if (!arrayMatch) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'PARSE_ERROR', message: 'AI 返回格式异常，请重试' })}\n\n`
            )
          )
          controller.close()
          return
        }

        const hooks = JSON.parse(arrayMatch[0]) as Array<{
          content: string
          styleTag: string
          score: number
          reason: string
        }>

        for (const hook of hooks) {
          const event = {
            id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            content: hook.content,
            styleTag: hook.styleTag,
            score: hook.score,
            reason: hook.reason,
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
          // Small delay between events for staggered animation effect
          await new Promise((r) => setTimeout(r, 200))
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err: unknown) {
        let message = '生成失败，请重试'
        if (err instanceof Error) {
          if (err.message.includes('401') || err.message.includes('403')) {
            message = 'API Key 无效或没有权限，请检查 AI_API_KEY'
          } else if (err.message.includes('429')) {
            message = 'API 调用频率过高，请稍后重试'
          } else if (err.message.includes('timeout') || err.message.includes('ETIMEDOUT')) {
            message = '请求超时，请检查网络或 AI_BASE_URL 是否正确'
          } else {
            message = `生成失败：${err.message}`
          }
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'LLM_ERROR', message })}\n\n`
          )
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
