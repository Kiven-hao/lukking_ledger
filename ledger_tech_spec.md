# 记账应用技术方案文档 v1.0

> Next.js · Supabase · Vercel · 微信小程序
>
> 本文档为 AI 辅助编码设计，每个模块均包含足够上下文，可直接作为 AI Prompt 的系统说明部分。

---

# 1. 项目概述

本项目是一款支持多人协作的记账工具，目标用户为家庭、情侣或小团队。

## 1.1 核心功能

- 多账本管理：用户可创建多个账本，支持通过邀请链接添加成员

- 成员权限控制：owner / editor / viewer 三级角色

- 多级分类：自引用树结构，支持自定义图标、颜色

- 记账记录：支持支出、收入、转账，含标签和备注

- 数据分析：按时间、分类、成员多维度统计

## 1.2 非功能目标

- 零服务器运维：Vercel Serverless + Supabase 全托管

- 鉴权与数据隔离：基于 Supabase RLS，账本数据严格隔离

- 双端支持：Web（Next.js）+ 微信小程序（Taro），共享 API 层

# 2. 技术栈选型

|            |                      |          |                                        |
|------------|----------------------|----------|----------------------------------------|
| **层级**   | **选型**             | **版本** | **说明**                               |
| 前端 + API | Next.js (App Router) | 15.x     | 页面 + Serverless API Routes，一个仓库 |
| 小程序     | Taro                 | 4.x      | 复用 React 组件逻辑，调用相同 API      |
| 数据库     | Supabase PostgreSQL  | 托管     | 免费 500MB，内置连接池                 |
| 鉴权       | Supabase Auth        | 托管     | 邮箱/密码、微信 OAuth                  |
| 权限控制   | Supabase RLS         | DB 层    | 行级安全策略，无需 API 层写权限判断    |
| 部署       | Vercel               | 托管     | GitHub push 自动部署                   |
| 语言       | TypeScript           | 5.x      | 全栈统一类型                           |
| 样式       | Tailwind CSS         | 4.x      | Web 端使用                             |

> *AI 编码提示：生成代码时默认使用 TypeScript strict 模式，Supabase 客户端从 @supabase/ssr 初始化，区分服务端（cookies）和客户端（browser）两种 client。*

# 3. 项目目录结构

```
my-ledger/

├── app/ # Next.js App Router

│ ├── (auth)/ # 登录 / 注册页

│ │ ├── login/page.tsx

│ │ └── register/page.tsx

│ ├── (dashboard)/ # 登录后主界面（Layout 带侧边栏）

│ │ ├── layout.tsx

│ │ ├── page.tsx # 账本列表

│ │ └── ledger/

│ │ └── [id]/

│ │ ├── page.tsx # 账本详情 + 记录列表

│ │ ├── analytics/ # 数据分析页

│ │ └── settings/ # 账本设置 / 成员管理

│ └── api/ # Serverless API（小程序也调用此处）

│ ├── auth/ # 微信登录回调

│ ├── ledgers/

│ │ ├── route.ts # GET list / POST create

│ │ └── [id]/

│ │ ├── route.ts # GET / PATCH / DELETE

│ │ ├── members/route.ts

│ │ └── invite/route.ts

│ ├── transactions/

│ │ ├── route.ts

│ │ └── [id]/route.ts

│ ├── categories/

│ │ └── route.ts

│ └── analytics/

│ └── route.ts

├── components/ # UI 组件

│ ├── ui/ # 基础组件（shadcn/ui 风格）

│ └── ledger/ # 账本相关组件

├── lib/

│ ├── supabase/

│ │ ├── server.ts # 服务端 client（用于 API Routes）

│ │ ├── client.ts # 浏览器端 client（用于客户端组件）

│ │ └── types.ts # 从 Supabase 生成的 Database 类型

│ ├── validations/ # Zod schema（前后端共用）

│ └── utils/

├── supabase/

│ ├── migrations/ # SQL 迁移文件（版本化）

│ │ └── 001_init.sql

│ └── seed.sql # 初始化默认分类数据

└── taro-app/ # 微信小程序（独立子目录）

├── src/pages/

└── src/api/ # 调用 /api/\* 的封装
```

# 4. 数据库设计

数据库使用 Supabase 托管的 PostgreSQL。所有表启用 RLS，通过策略函数控制访问权限。

## 4.1 实体关系概述

|                |                                       |
|----------------|---------------------------------------|
| **实体**       | **说明**                              |
| profiles       | auth.users 的业务扩展，存储昵称、头像 |
| ledgers        | 账本主表，owner_id 标记创建者         |
| ledger_members | 账本成员多对多关系表，含角色字段      |
| ledger_invites | 邀请链接，含 token、有效期、使用状态  |
| categories     | 分类树，parent_id 自引用实现多级      |
| transactions   | 记账记录，关联账本和分类              |

## 4.2 建表 SQL

### 4.2.1 扩展与用户表

> -- 启用 UUID 扩展
>
> CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
>
> -- ============================================================
>
> -- 用户扩展表（补充 Supabase auth.users 的业务字段）
>
> -- ============================================================
>
> CREATE TABLE public.profiles (
>
> id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
>
> nickname TEXT NOT NULL DEFAULT '',
>
> avatar_url TEXT,
>
> created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
>
> updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>
> );
>
> -- 新用户注册后自动创建 profile
>
> CREATE OR REPLACE FUNCTION public.handle_new_user()
>
> RETURNS TRIGGER AS \$\$
>
> BEGIN
>
> INSERT INTO public.profiles (id, nickname)
>
> VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data-\>\>'nickname', ''));
>
> RETURN NEW;
>
> END;
>
> \$\$ LANGUAGE plpgsql SECURITY DEFINER;
>
> CREATE TRIGGER on_auth_user_created
>
> AFTER INSERT ON auth.users
>
> FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

### 4.2.2 账本与成员

> -- ============================================================
>
> -- 账本
>
> -- ============================================================
>
> CREATE TABLE public.ledgers (
>
> id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
>
> name TEXT NOT NULL,
>
> description TEXT,
>
> icon TEXT DEFAULT 'book',
>
> currency TEXT NOT NULL DEFAULT 'CNY',
>
> owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
>
> created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
>
> updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>
> );
>
> -- ============================================================
>
> -- 账本成员（多人共享核心表）
>
> -- ============================================================
>
> CREATE TYPE ledger_role AS ENUM ('owner', 'editor', 'viewer');
>
> CREATE TABLE public.ledger_members (
>
> id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
>
> ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
>
> user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
>
> role ledger_role NOT NULL DEFAULT 'editor',
>
> joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
>
> UNIQUE (ledger_id, user_id)
>
> );
>
> -- ============================================================
>
> -- 邀请链接
>
> -- ============================================================
>
> CREATE TYPE invite_status AS ENUM ('active', 'used', 'expired');
>
> CREATE TABLE public.ledger_invites (
>
> id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
>
> ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
>
> token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
>
> role ledger_role NOT NULL DEFAULT 'editor',
>
> created_by UUID NOT NULL REFERENCES auth.users(id),
>
> status invite_status NOT NULL DEFAULT 'active',
>
> expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
>
> used_by UUID REFERENCES auth.users(id),
>
> used_at TIMESTAMPTZ,
>
> created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>
> );

### 4.2.3 分类

> -- ============================================================
>
> -- 分类（自引用树，支持无限层级）
>
> -- ============================================================
>
> CREATE TYPE category_type AS ENUM ('expense', 'income', 'transfer');
>
> CREATE TABLE public.categories (
>
> id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
>
> ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
>
> parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
>
> name TEXT NOT NULL,
>
> icon TEXT,
>
> color TEXT,
>
> type category_type NOT NULL DEFAULT 'expense',
>
> sort_order INTEGER NOT NULL DEFAULT 0,
>
> is_system BOOLEAN NOT NULL DEFAULT FALSE,
>
> created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>
> );
>
> CREATE INDEX idx_categories_ledger ON public.categories(ledger_id);
>
> CREATE INDEX idx_categories_parent ON public.categories(parent_id);

### 4.2.4 记账记录

> -- ============================================================
>
> -- 记账记录
>
> -- ============================================================
>
> CREATE TABLE public.transactions (
>
> id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
>
> ledger_id UUID NOT NULL REFERENCES public.ledgers(id) ON DELETE CASCADE,
>
> category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
>
> created_by UUID NOT NULL REFERENCES auth.users(id),
>
> amount NUMERIC(15, 2) NOT NULL,
>
> type category_type NOT NULL,
>
> note TEXT,
>
> occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
>
> tags TEXT\[\] DEFAULT '{}',
>
> created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
>
> updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
>
> );
>
> CREATE INDEX idx_transactions_ledger ON public.transactions(ledger_id);
>
> CREATE INDEX idx_transactions_occurred ON public.transactions(occurred_at DESC);
>
> CREATE INDEX idx_transactions_category ON public.transactions(category_id);
>
> CREATE INDEX idx_transactions_created_by ON public.transactions(created_by);

### 4.2.5 行级安全策略（RLS）

> *RLS 是账本数据隔离的核心机制。所有查询经过策略过滤，无需在 API 层写权限判断。is_ledger_member / is_ledger_editor 是可复用的工具函数。*
>
> -- ============================================================
>
> -- 启用 RLS
>
> -- ============================================================
>
> ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
>
> ALTER TABLE public.ledgers ENABLE ROW LEVEL SECURITY;
>
> ALTER TABLE public.ledger_members ENABLE ROW LEVEL SECURITY;
>
> ALTER TABLE public.ledger_invites ENABLE ROW LEVEL SECURITY;
>
> ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
>
> ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
>
> -- ── profiles ──────────────────────────────────────────────
>
> CREATE POLICY "用户只能读写自己的 profile"
>
> ON public.profiles FOR ALL
>
> USING (id = auth.uid())
>
> WITH CHECK (id = auth.uid());
>
> -- ── 工具函数：判断当前用户是否为账本成员 ─────────────────
>
> CREATE OR REPLACE FUNCTION public.is_ledger_member(p_ledger_id UUID)
>
> RETURNS BOOLEAN AS \$\$
>
> SELECT EXISTS (
>
> SELECT 1 FROM public.ledger_members
>
> WHERE ledger_id = p_ledger_id AND user_id = auth.uid()
>
> );
>
> \$\$ LANGUAGE sql SECURITY DEFINER STABLE;
>
> CREATE OR REPLACE FUNCTION public.is_ledger_editor(p_ledger_id UUID)
>
> RETURNS BOOLEAN AS \$\$
>
> SELECT EXISTS (
>
> SELECT 1 FROM public.ledger_members
>
> WHERE ledger_id = p_ledger_id
>
> AND user_id = auth.uid()
>
> AND role IN ('owner', 'editor')
>
> );
>
> \$\$ LANGUAGE sql SECURITY DEFINER STABLE;
>
> -- ── ledgers ───────────────────────────────────────────────
>
> CREATE POLICY "成员可读账本"
>
> ON public.ledgers FOR SELECT
>
> USING (public.is_ledger_member(id));
>
> CREATE POLICY "owner 可更新账本"
>
> ON public.ledgers FOR UPDATE
>
> USING (owner_id = auth.uid());
>
> CREATE POLICY "登录用户可创建账本"
>
> ON public.ledgers FOR INSERT
>
> WITH CHECK (owner_id = auth.uid());
>
> CREATE POLICY "owner 可删除账本"
>
> ON public.ledgers FOR DELETE
>
> USING (owner_id = auth.uid());
>
> -- ── ledger_members ────────────────────────────────────────
>
> CREATE POLICY "成员可查看同账本的成员列表"
>
> ON public.ledger_members FOR SELECT
>
> USING (public.is_ledger_member(ledger_id));
>
> CREATE POLICY "owner 管理成员"
>
> ON public.ledger_members FOR ALL
>
> USING (
>
> EXISTS (
>
> SELECT 1 FROM public.ledgers
>
> WHERE id = ledger_id AND owner_id = auth.uid()
>
> )
>
> );
>
> -- ── categories ────────────────────────────────────────────
>
> CREATE POLICY "成员可读分类"
>
> ON public.categories FOR SELECT
>
> USING (public.is_ledger_member(ledger_id));
>
> CREATE POLICY "editor 以上可写分类"
>
> ON public.categories FOR INSERT
>
> WITH CHECK (public.is_ledger_editor(ledger_id));
>
> CREATE POLICY "editor 以上可更新分类"
>
> ON public.categories FOR UPDATE
>
> USING (public.is_ledger_editor(ledger_id));
>
> -- ── transactions ──────────────────────────────────────────
>
> CREATE POLICY "成员可读记录"
>
> ON public.transactions FOR SELECT
>
> USING (public.is_ledger_member(ledger_id));
>
> CREATE POLICY "editor 以上可新增记录"
>
> ON public.transactions FOR INSERT
>
> WITH CHECK (public.is_ledger_editor(ledger_id));
>
> CREATE POLICY "创建者或 editor 可更新记录"
>
> ON public.transactions FOR UPDATE
>
> USING (
>
> created_by = auth.uid() OR public.is_ledger_editor(ledger_id)
>
> );
>
> CREATE POLICY "创建者或 owner 可删除记录"
>
> ON public.transactions FOR DELETE
>
> USING (
>
> created_by = auth.uid() OR
>
> EXISTS (
>
> SELECT 1 FROM public.ledgers
>
> WHERE id = ledger_id AND owner_id = auth.uid()
>
> )
>
> );

### 4.2.6 分析视图

> -- ============================================================
>
> -- 分析视图：按月 + 分类汇总（供分析服务调用）
>
> -- ============================================================
>
> CREATE VIEW public.monthly_summary AS
>
> SELECT
>
> t.ledger_id,
>
> DATE_TRUNC('month', t.occurred_at) AS month,
>
> t.type,
>
> c.id AS category_id,
>
> c.name AS category_name,
>
> c.parent_id,
>
> COUNT(\*) AS tx_count,
>
> SUM(t.amount) AS total_amount
>
> FROM public.transactions t
>
> LEFT JOIN public.categories c ON t.category_id = c.id
>
> GROUP BY t.ledger_id, month, t.type, c.id, c.name, c.parent_id;

# 5. API 设计

所有 API 均为 Next.js Route Handlers（Serverless 函数），统一路径前缀 /api。使用 Supabase 服务端 client 验证 JWT 并操作数据库。

## 5.1 通用约定

- 认证：请求头携带 Authorization: Bearer \<supabase_access_token\>

- 响应格式：{ data, error } 统一结构

- 错误码：遵循 HTTP 语义（401/403/404/422/500）

- 分页：cursor-based（cursor + limit），避免 OFFSET 性能问题

## 5.2 接口列表

|          |                               |                        |               |
|----------|-------------------------------|------------------------|---------------|
| **方法** | **路径**                      | **说明**               | **权限**      |
| GET      | /api/ledgers                  | 获取当前用户的账本列表 | 登录用户      |
| POST     | /api/ledgers                  | 创建新账本             | 登录用户      |
| GET      | /api/ledgers/:id              | 获取账本详情           | 成员          |
| PATCH    | /api/ledgers/:id              | 更新账本信息           | owner         |
| DELETE   | /api/ledgers/:id              | 删除账本               | owner         |
| GET      | /api/ledgers/:id/members      | 获取成员列表           | 成员          |
| DELETE   | /api/ledgers/:id/members/:uid | 移除成员               | owner         |
| POST     | /api/ledgers/:id/invite       | 生成邀请链接           | owner/editor  |
| POST     | /api/invite/accept            | 通过 token 加入账本    | 登录用户      |
| GET      | /api/transactions             | 查询记录（含筛选分页） | 成员          |
| POST     | /api/transactions             | 新增记录               | editor+       |
| PATCH    | /api/transactions/:id         | 更新记录               | 创建者/editor |
| DELETE   | /api/transactions/:id         | 删除记录               | 创建者/owner  |
| GET      | /api/categories               | 获取分类树             | 成员          |
| POST     | /api/categories               | 新增分类               | editor+       |
| GET      | /api/analytics/summary        | 月度收支汇总           | 成员          |
| GET      | /api/analytics/category-pie   | 分类占比               | 成员          |
| GET      | /api/analytics/trend          | 时间趋势（日/周/月）   | 成员          |

# 6. 鉴权方案

## 6.1 Web 端（邮箱登录）

- 前端调用 supabase.auth.signInWithPassword()

- Supabase 返回 access_token（JWT），存入 httpOnly Cookie（@supabase/ssr 自动处理）

- Next.js Middleware 检查 Cookie，未登录重定向到 /login

- API Routes 通过 createServerClient 从 Cookie 读取会话

## 6.2 微信小程序端

- 小程序调用 wx.login() 获取 code

- code 发送到 /api/auth/wechat，后端换取 openid

- 用 openid 查找或创建 auth.users 记录（通过 Supabase Admin Client）

- 返回 Supabase access_token，小程序存入 storage

- 后续请求在 Header 带 Authorization: Bearer \<token\>

## 6.3 邀请机制流程

- owner/editor 调用 POST /api/ledgers/:id/invite，生成 token（16字节随机 hex）

- token 存入 ledger_invites 表，含有效期（默认7天）

- 分享链接格式：https://yourdomain.com/join?token=xxx

- 被邀请人点击链接，登录后 POST /api/invite/accept { token }

- 服务端验证 token 有效性，写入 ledger_members，更新 invite status 为 used

# 7. 关键代码模式

## 7.1 Supabase 客户端初始化

> *服务端和客户端必须用不同的初始化方式，否则会有 Cookie 访问问题。*

**lib/supabase/server.ts（API Routes 使用）：**

> import { createServerClient } from '@supabase/ssr';
>
> import { cookies } from 'next/headers';
>
> import type { Database } from './types';
>
> export function createSupabaseServer() {
>
> const cookieStore = cookies();
>
> return createServerClient\<Database\>(
>
> process.env.NEXT_PUBLIC_SUPABASE_URL!,
>
> process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
>
> { cookies: {
>
> get: (name) =\> cookieStore.get(name)?.value,
>
> set: (name, value, opts) =\> cookieStore.set(name, value, opts),
>
> remove: (name, opts) =\> cookieStore.delete(name),
>
> }}
>
> );
>
> }

## 7.2 API Route 统一结构模板

> // app/api/transactions/route.ts
>
> import { NextRequest, NextResponse } from 'next/server';
>
> import { createSupabaseServer } from '@/lib/supabase/server';
>
> export async function GET(req: NextRequest) {
>
> const supabase = createSupabaseServer();
>
> const { data: { user }, error: authError } = await supabase.auth.getUser();
>
> if (authError \|\| !user) {
>
> return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
>
> }
>
> const ledgerId = req.nextUrl.searchParams.get('ledger_id');
>
> const { data, error } = await supabase
>
> .from('transactions')
>
> .select('\*, category:categories(\*), creator:profiles(\*)')
>
> .eq('ledger_id', ledgerId)
>
> .order('occurred_at', { ascending: false })
>
> .limit(50);
>
> if (error) return NextResponse.json({ error: error.message }, { status: 500 });
>
> return NextResponse.json({ data });
>
> }

## 7.3 分析查询示例

> // 按月统计收支（在 API Route 中调用）
>
> const { data } = await supabase
>
> .from('monthly_summary')
>
> .select('\*')
>
> .eq('ledger_id', ledgerId)
>
> .gte('month', startDate)
>
> .lte('month', endDate);
>
> // 分类树查询（递归 CTE，在 Supabase SQL Editor 中执行）
>
> WITH RECURSIVE category_tree AS (
>
> SELECT \*, 0 AS depth FROM categories WHERE parent_id IS NULL
>
> UNION ALL
>
> SELECT c.\*, ct.depth + 1 FROM categories c
>
> JOIN category_tree ct ON c.parent_id = ct.id
>
> )
>
> SELECT \* FROM category_tree WHERE ledger_id = \$1 ORDER BY depth, sort_order;

# 8. 部署与环境配置

## 8.1 必需环境变量

|                               |                                                            |
|-------------------------------|------------------------------------------------------------|
| **变量名**                    | **说明**                                                   |
| NEXT_PUBLIC_SUPABASE_URL      | Supabase 项目 URL（Settings \> API）                       |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon 公钥                                         |
| SUPABASE_SERVICE_ROLE_KEY     | 服务端 secret key，仅用于 Admin 操作（如微信登录创建用户） |
| WECHAT_APP_ID                 | 微信小程序 AppID                                           |
| WECHAT_APP_SECRET             | 微信小程序 AppSecret                                       |

## 8.2 部署步骤

- 在 Supabase 创建项目，执行 supabase/migrations/001_init.sql

- 执行 seed.sql 初始化默认分类

- GitHub 新建仓库，推送代码

- Vercel 导入该仓库，填入上述环境变量

- Vercel 自动构建并部署，之后 push 代码自动触发重新部署

- 小程序在微信开发者工具中配置 request 合法域名为 Vercel 域名

## 8.3 数据库迁移管理

- 使用 Supabase CLI：supabase db diff 生成迁移文件

- 迁移文件提交到 Git，实现数据库版本化管理

- supabase db push 推送变更到远端

# 9. AI 编码上下文指南

以下内容可直接复制作为 AI 编码工具（Claude、Cursor 等）的系统提示或项目 README。

## 9.1 项目背景说明（粘贴给 AI 的上下文模板）

> *每次开始新功能时，将以下内容附加在 Prompt 开头，帮助 AI 理解项目约定。*
>
> 你正在开发一个记账应用，技术栈如下：
>
> \- 框架：Next.js 15 App Router + TypeScript strict
>
> \- 数据库：Supabase PostgreSQL，所有表已启用 RLS
>
> \- 鉴权：Supabase Auth，API Routes 使用 createSupabaseServer() 获取 user
>
> \- ORM：直接使用 Supabase JS Client（无 Prisma）
>
> \- 样式：Tailwind CSS v4
>
> \- 路径别名：@ 指向项目根目录
>
> 重要约定：
>
> 1\. API Routes 第一步必须验证 user，未登录返回 401
>
> 2\. 不要在 API 层写权限判断，RLS 已在数据库层处理权限
>
> 3\. 所有数据库操作使用服务端 client（lib/supabase/server.ts）
>
> 4\. 数据类型从 lib/supabase/types.ts 导入（由 supabase gen types 生成）
>
> 5\. 组件默认为 Server Component，需要交互才加 "use client"
>
> 6\. 错误响应格式：NextResponse.json({ error: message }, { status: xxx })
>
> 7\. 成功响应格式：NextResponse.json({ data: result })

## 9.2 各模块开发提示词参考

|           |                                                                                                       |
|-----------|-------------------------------------------------------------------------------------------------------|
| **模块**  | **AI Prompt 要点**                                                                                    |
| 账本 CRUD | 创建时同步写入 ledger_members（role=owner）；列表从 ledger_members 关联查询而非 ledgers 直查          |
| 邀请功能  | token 用 gen_random_bytes(16) 生成；accept 接口需检查 expires_at 和 status；已是成员要幂等处理        |
| 分类树    | 前端用递归函数把平铺数组转成树形结构；新增时验证 parent_id 归属同一账本                               |
| 记录列表  | 使用 cursor-based 分页（last_occurred_at + last_id）；join categories 和 profiles 一次查询            |
| 数据分析  | 优先查 monthly_summary 视图；趋势图按 granularity 参数动态 DATE_TRUNC；注意时区用 AT TIME ZONE        |
| 微信登录  | 需要 SUPABASE_SERVICE_ROLE_KEY 创建用户；用 supabase.auth.admin.createUser；openid 存在 user_metadata |

# 10. 开发阶段规划

|                    |                                                                          |              |
|--------------------|--------------------------------------------------------------------------|--------------|
| **阶段**           | **内容**                                                                 | **预计周期** |
| Phase 1 · 核心跑通 | 数据库建表 + RLS、邮箱登录、账本 CRUD、分类管理、添加记录、Web 端基础 UI | 2 周         |
| Phase 2 · 协作功能 | 邀请链接、成员管理、权限角色控制、记录归属展示                           | 1-2 周       |
| Phase 3 · 数据分析 | 月度汇总、分类饼图、趋势折线图（Recharts）                               | 1 周         |
| Phase 4 · 小程序   | Taro 接入、微信 OAuth、适配小程序 UI                                     | 2 周         |
| Phase 5 · 迭代优化 | 预算功能、数据导出（CSV）、深色模式、离线缓存                            | 持续         |

*— 文档结束 —*
