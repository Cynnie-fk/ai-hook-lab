# AI Hook Lab

> AI驱动的新媒体Hook生成器 — 输入话题，自动生成10条高质量社交媒体开篇文案

## 功能

- **多平台适配**：小红书、抖音、B站、YouTube、X（Twitter），每种平台独立调优文案风格
- **14种风格标签**：悬念、痛点直击、共鸣共情、反常识、数字震撼等
- **智能评分**：每条Hook附带0-10分AI评分 + 评审理由
- **SSE流式响应**：Hook逐条实时展示，非一次性加载
- **收藏系统**：一键收藏，支持按风格标签筛选
- **历史记录**：自动保存每次生成，全局搜索（按话题/平台/风格标签/内容类型）
- **全局搜索**：实时模糊匹配历史记录中的任意维度

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript 5.5 (strict) |
| 样式 | Tailwind CSS 3.4 (dark theme) |
| AI | OpenAI API + SSE 流式响应 |
| 数据 | localStorage (无需后端) |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入API配置：

```bash
cp .env.local.example .env.local
```

| 变量 | 说明 | 必填 |
|------|------|------|
| `AI_API_KEY` | OpenAI兼容API的密钥 | ✅ |
| `AI_BASE_URL` | API基础URL（支持任意OpenAI兼容服务） | ✅ |
| `AI_MODEL` | 模型名称（如 gpt-4o、your-model-name） | ✅ |

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局 + 元数据
│   ├── page.tsx            # 首页 — Hook生成
│   ├── history/page.tsx    # 历史记录 + 全局搜索
│   ├── favorites/page.tsx  # 收藏列表 + 标签筛选
│   └── api/generate/route.ts  # POST /api/generate (SSE)
├── components/
│   ├── InputPanel.tsx      # 输入面板
│   ├── HookCard.tsx        # 单条Hook卡片
│   ├── HookCardGrid.tsx    # Hook网格布局
│   ├── Navbar.tsx          # 导航栏
│   ├── Toast.tsx           # 消息提示
│   └── ui/
│       ├── Button.tsx      # 通用按钮
│       └── Chip.tsx        # 通用标签
├── hooks/
│   ├── useGenerateHooks.ts # SSE流式生成
│   ├── useHistory.ts       # 历史记录
│   ├── useFavorites.ts     # 收藏管理
│   ├── useLocalStorage.ts  # localStorage封装
│   └── useToast.ts         # 消息提示管理
└── lib/
    ├── types.ts            # TypeScript类型定义
    ├── constants.ts        # 平台/风格/配置常量
    └── storage.ts          # localStorage底层操作
```

## 部署

项目为纯前端 + API Route架构，可直接部署到 Vercel：

```bash
npm run build
```

记得在Vercel控制台中配置 `AI_API_KEY`、`AI_BASE_URL`、`AI_MODEL` 三个环境变量。

## 许可证

MIT
