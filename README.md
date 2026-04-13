# OnTime PD Care

帕金森病用药管理与照护协作 PWA。当前项目来自 Lovable 导出，前端为 React + TypeScript + Vite，后端使用 Supabase Auth、Database 和 Edge Functions。

## Local Setup

```bash
npm install
npm run dev
```

Vite 默认端口为 `8080`。如果使用 Bun，也可以运行 `bun install` 后再启动。

## Environment

`.env` 需要包含：

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

AI 功能通过 Supabase Edge Function `ai-care` 调用 Lovable AI Gateway，服务端需要 `LOVABLE_API_KEY`。这个 key 由 Lovable Cloud 注入；本地直接运行 Edge Function 时需要自行配置。

## Data Model

前端已经接入的 Supabase 数据：

- `profiles`: 个人档案
- `medications`: 药物清单
- `medication_logs`: 服药状态记录
- `symptoms`: 症状记录
- `care_contacts`: 照护团队联系人
- `clinical_visits`: 就诊摘要生成记录
- `notifications`: 漏服等应用内通知记录

数据库中还预留了 Storage buckets。当前弹窗提醒仍然是浏览器前台 Notification API，不是服务端推送。

## Current Product Notes

- 邮箱登录和访客模式可用。
- 手机验证码入口暂时禁用，等 Supabase SMS 配置完成后再开启。
- 处方识别支持粘贴处方/药盒文字并调用 `ai-care`，尚未接入真实拍照 OCR。
- 浏览器用药提醒依赖页面打开时的前台定时器；关闭页面后不会继续提醒。
- 设置按登录用户隔离保存在 localStorage；访客模式使用独立设置。
- 语言偏好保存在 localStorage，刷新后会保留。
- “AI 服务配置”页面保留在代码中作为本地连接测试工具，但主设置入口已隐藏；真实 AI 调用仍走 Lovable Edge Function。

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```
