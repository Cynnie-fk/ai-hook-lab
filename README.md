# AI Hook Lab

> AI驱动的新媒体Hook生成器 — 输入话题，自动生成10条高质量社交媒体开篇文案

**[在线体验](https://6a534a66a1293800081f742c--tranquil-mooncake-abdbbc.netlify.app/)** | **[GitHub](https://github.com/Cynnie-fk/ai-hook-lab)**

## 功能

- **多平台适配**：小红书、抖音、B站、YouTube、X（Twitter），每种平台独立调优文案风格
- **14种风格标签**：悬念、痛点直击、共鸣共情、反常识、数字震撼等
- **智能评分**：每条Hook附带0-10分AI评分 + 评审理由
- **SSE流式响应**：Hook逐条实时展示，非一次性加载
- **收藏系统**：一键收藏，支持按风格标签筛选
- **历史记录**：自动保存每次生成，支持展开/折叠/删除
- **全局搜索**：实时模糊匹配历史记录中的话题、平台、内容类型、风格标签

## 企业级特性

- **Error Boundary**：组件级错误隔离，单点故障不导致全局白屏
- **API限流**：IP级频率限制（10次/分钟），防止API额度被恶意消耗
- **无障碍**：全组件ARIA支持（aria-label、aria-current、aria-pressed、role），键盘可操作
- **SEO**：OG标签、Twitter Card、结构化元数据
- **输入校验**：话题长度限制、平台/内容类型运行时枚举验证
- **降级设计**：动画尊重系统 `prefers-reduced-motion` 偏好

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript 5.5 (strict) |
| 样式 | Tailwind CSS 3.4 (dark theme) |
| AI | OpenAI兼容API + SSE 流式响应 |
| 数据 | localStorage（无需后端） |
| 部署 | Netlify（GitHub Push自动构建） |

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

支持的API服务商：OpenAI、DeepSeek、通义千问、智谱等所有OpenAI兼容接口。

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── app/
│   ├── layout.tsx          # 根布局 + 元数据 + Error Boundary
│   ├── page.tsx            # 首页 — Hook生成
│   ├── history/page.tsx    # 历史记录 + 全局搜索
│   ├── favorites/page.tsx  # 收藏列表 + 标签筛选
│   └── api/generate/route.ts  # POST /api/generate (SSE + 限流 + 校验)
├── components/
│   ├── ErrorBoundary.tsx   # 全局错误边界
│   ├── InputPanel.tsx      # 输入面板
│   ├── HookCard.tsx        # 单条Hook卡片（含无障碍）
│   ├── HookCardGrid.tsx    # Hook网格布局
│   ├── Navbar.tsx          # 导航栏（含aria-current）
│   ├── Toast.tsx           # 消息提示
│   └── ui/
│       ├── Button.tsx      # 通用按钮
│       └── Chip.tsx        # 通用标签（含aria-pressed）
├── hooks/
│   ├── useGenerateHooks.ts # SSE流式生成 + AbortController
│   ├── useHistory.ts       # 历史记录CRUD
│   ├── useFavorites.ts     # 收藏管理
│   ├── useLocalStorage.ts  # localStorage封装（SSR安全 + 配额处理）
│   └── useToast.ts         # 消息提示管理
└── lib/
    ├── types.ts            # TypeScript类型定义
    ├── constants.ts        # 平台/风格/配置常量
    └── storage.ts          # localStorage底层操作
```

## 部署

项目已部署至 **Netlify**，国内可直接访问：

- 在线地址：https://6a534a66a1293800081f742c--tranquil-mooncake-abdbbc.netlify.app/
- GitHub Push 自动触发部署
- 环境变量在 Netlify 控制台配置

也支持部署至 Vercel 或其他支持 Next.js 的平台。

## 许可证

MIT
