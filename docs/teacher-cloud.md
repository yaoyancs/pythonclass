# 教师台 / 云端存储（本文件可提交；真实 PIN 与 KV id 用密钥配置）

## 本地开发

```bash
# 可选：自定义 PIN（须 ≥8 位；不设则本地默认为 24681357，仅开发用）
TEACHER_PIN=你的本地PIN npm run dev
```

页脚点「教师解锁」→ 输入 PIN。本地走 Vite mock API（内存存储，刷新进程即清空）。

## 生产 PIN（强密码）

生产 PIN **不要**用文档或仓库里出现过的默认值（如 4 位数字）。使用 **至少 8 位**、不要用工号/生日/教室号。

```bash
npx wrangler pages secret put TEACHER_PIN --project-name=qfnupy
```

Dashboard：Pages → qfnupy → Settings → Variables and Secrets，添加 `TEACHER_PIN`，类型选 **Secret**（不要用普通明文 Environment variable）。改 PIN 一般不必重新 build；若仍像旧 PIN，再触发一次 Pages 部署。

服务端若检测到 Secret 短于 8 位，解锁接口会返回 500，直到你重设。

## 失败限速

同一客户端 IP（`CF-Connecting-IP`）在 15 分钟内 PIN 错误 20 次后，冷却 15 分钟；冷却期内或刚解锁又失败则加倍，最长 60 分钟。成功登录会清零该 IP 计数。

校园网常共用一个出口 IP：学生乱试可能连教师一起 429。此时用手机流量打开同一页解锁即可。

## 生产（Cloudflare Pages + KV）

1. 创建 KV：

```bash
npx wrangler kv namespace create TEACHER_KV
npx wrangler kv namespace create TEACHER_KV --preview
```

2. 把返回的 id 写入 `wrangler.toml` 的 `id` / `preview_id`（当前生产 KV：`5f2c20381d124b4abce58e8487a34699`）。

3. 按上文设置 `TEACHER_PIN` Secret。

4. 确认 Functions 绑定：Settings → Functions → KV namespace bindings，绑定名必须为 `TEACHER_KV`。

5. 推送 `main` 触发 GitHub Actions 部署；`functions/` 会随 `wrangler pages deploy` 一起发布。

## 访问统计（D1，不写 TEACHER_KV）

打点失败会被课堂端直接丢弃，不影响翻页与运行代码。本地 `npm run dev` 用内存 mock，刷新进程即清空。

生产 D1 已创建并写入 `wrangler.toml`（绑定名 `ANALYTICS_DB`）：

- 库：`pyclass-analytics`（`bc4b11ac-fa51-4aa7-b684-2ae7f1cbda6f`）
- 预览库：`pyclass-analytics-preview`

若 Dashboard 里 Functions 尚未出现 D1，到 Pages → qfnupy → Settings → Functions → D1 bindings 确认绑定名为 `ANALYTICS_DB`。改表结构时：

```bash
npx wrangler d1 execute pyclass-analytics --file=./migrations/0002_analytics_teacher_source.sql --remote
```

看板默认排除已解锁教师台的会话；突出「课后作业打开数」（封面作业链接 `?page=homework`）。

## API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/teacher/session` | `{ "pin" }` → `{ token }`；失败过多为 429 |
| DELETE | `/api/teacher/session` | Bearer 注销 |
| GET | `/api/teacher/pack` | Bearer 读取整包 |
| PUT | `/api/teacher/pack` | Bearer 写入整包 |
| POST | `/api/analytics/hit` | 公开写入打点；过密 429 |
| GET | `/api/analytics/summary` | Bearer；默认排除教师；`includeTeacher=1` 含演示；含课后作业打开数 |
| GET | `/api/analytics/lessons` | Bearer；按讲次与幕聚合（同上） |

整包含：班级列表、名单、学期小红花、考勤档案、本堂会话。
