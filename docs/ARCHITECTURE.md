# Architecture Context — СвойШмот

Документ для coding agents и разработчиков. Обновляй при смене схемы, auth или ключевых потоков.

## Product Goal

Двусторонний маркетплейс: клиент описывает одежду → оформляет заказ → ателье откликаются ставкой → клиент выбирает → чат и статусы пошива.

**Production:** https://svoyshmot.vercel.app  
**Supabase project:** `fsylhnhlqmwwzaeszoue`

## Expected Six-Month Scale (ориентир)

| Параметр | Оценка |
|----------|--------|
| Пользователи | 500–2 000 |
| Ателье | 20–50 в 1–3 городах |
| Заказы / месяц | 50–200 |
| Сообщения / заказ | 10–50 |
| AI-генераций / день | 100–500 (Stage 2) |

Не оптимизировать под больший масштаб до сигналов PMF.

## Monorepo Layout

```
svoyshmot/
├── apps/web/                 # Next.js 16 App Router (deploy root: apps/web)
│   ├── src/app/              # routes, server components
│   ├── src/components/       # UI, landing, orders
│   ├── src/lib/
│   │   ├── actions/          # Server Actions (auth, orders, atelier, messages, designs)
│   │   ├── supabase/         # browser, server, middleware clients
│   │   ├── auth.ts           # getSessionUser, getProfile (server only)
│   │   ├── auth-errors.ts    # RU validation + Supabase error translation
│   │   └── site-url.ts       # NEXT_PUBLIC_SITE_URL for auth redirects
│   └── src/middleware.ts     # session refresh + protected routes
├── packages/shared/          # OrderStatus, UserRole, APP_NAME
├── packages/ui/              # stub (shadcn lives in apps/web)
└── supabase/migrations/      # schema + RLS
```

## Core User Flows

### Клиент

1. `/register` (role=client) → email confirm → `/login`
2. `/create` → сохранение `designs.prompt` (image_url — Stage 2)
3. `/dashboard` → «Заказать пошив» → `/orders/new?designId=`
4. `/orders/[id]` → publish → ждёт `order_bids` → accept bid → чат

### Ателье

1. `/register` (role=atelier) → `/atelier/register` (профиль `ateliers`)
2. `/atelier/dashboard` → лента `published` + свои заказы
3. `/atelier/orders/[id]` → ставка → после accept: статусы + чат

### Order status machine

```
draft → published → accepted → in_progress → ready → delivered
                  ↘ cancelled (клиент)
```

Ставки: `order_bids.status` = pending | accepted | rejected.

## Architecture Principles

1. **Server-first:** данные и auth через Server Components + Server Actions; client только для форм, чата, интерактива.
2. **Не импортировать** `@/lib/supabase/server` или `@/lib/auth` из `"use client"` компонентов.
3. **RLS — источник правды:** не дублировать сложную авторизацию в actions без необходимости; actions проверяют роль для UX-сообщений.
4. **Минимальный scope:** новые фичи только по [MVP_SCOPE.md](./MVP_SCOPE.md) amendment criteria.
5. **Русский UX:** ошибки через `auth-errors.ts` и русские строки в actions.
6. **Один production URL:** `getSiteUrl()` / `getAuthCallbackUrl()` — не полагаться на `request.origin` на Vercel preview.

## Approved Dependencies

| Пакет | Назначение |
|-------|------------|
| next, react | App Router, RSC |
| @supabase/ssr, @supabase/supabase-js | Auth, DB |
| @tanstack/react-query | client cache (providers) |
| tailwind v4, shadcn/radix | UI |
| turbo, pnpm | monorepo |
| lucide-react | иконки |
| sonner | toast |

## Dependencies To Avoid (пока)

- Prisma / Drizzle (Supabase client достаточно)
- Отдельный API-сервер (BFF в Next.js)
- Redis / очереди (до нагрузки)
- Stripe (до PMF)
- Тяжёлые state-менеджеры

## Database Schema (ключевое)

| Таблица | Назначение |
|---------|------------|
| profiles | id = auth.users, role, **city** |
| ateliers | owner_id → profiles, city, rating |
| designs | prompt, image_url (nullable), is_public |
| orders | design_id, atelier_id, **city**, status, параметры пошива |
| order_bids | order_id + atelier_id unique, price, deadline |
| messages | order_id, sender_id, text |

Вложенные связи в select часто приходят как object или array — использовать `relationOne()` из `lib/supabase-relations.ts`.

## Security Requirements

- RLS на всех public-таблицах
- Service role key **только** на сервере / CI, никогда в клиенте
- `NEXT_PUBLIC_*` — только URL и publishable key
- Auth redirect: [SUPABASE_AUTH.md](./SUPABASE_AUTH.md)
- Полный чеклист: [SECURITY.md](./SECURITY.md)

## Data Handling Rules

- ПДн: email, имя, параметры тела в заказах — минимизировать экспорт
- Не логировать пароли и service role
- Сообщения чата — только участники заказа (RLS на messages)
- Публичные дизайны (`is_public`) — только после явного согласия (позже)

## Env Variables

```bash
# apps/web/.env.local и Vercel
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://svoyshmot.vercel.app   # localhost для dev
```

## Testing Expectations

| Уровень | Статус | Цель |
|---------|--------|------|
| `pnpm build` | обязателен перед deploy | TS + Next build |
| RLS | ручная проверка / SQL | нет утечки чужих заказов |
| E2E Playwright | TODO | publish → bid → accept |
| Unit | не приоритет на MVP | actions с моками — позже |

## Coding Agent Session Rules

1. Прочитать этот файл + MVP_SCOPE перед крупными изменениями.
2. Одна сессия — одна вертикаль (например «ставки», не «ставки + оплата + рейтинги»).
3. После миграции: `npx supabase db push` + обновить Decision Log ниже.
4. Client page + SiteHeader: page = Server Component, форма = отдельный `"use client"` файл.
5. Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.

## Decision Log

| Date | Decision | Reason | Tradeoff | Follow-up |
|------|----------|--------|----------|-----------|
| 2025-06-15 | Turborepo + Supabase RLS | Скорость MVP, меньше backend-кода | Сложнее сложные транзакции | accept bid в одной action |
| 2025-06-15 | Server Actions вместо REST | Меньше boilerplate | Сложнее внешние интеграции | API routes для webhooks позже |
| 2025-06-15 | order_bids отдельная таблица | Несколько ставок на заказ | Больше RLS | — |
| 2025-06-15 | AI images отложены (Stage 2) | Проверить спрос без GPU-cost | Слабее «вау» на лендинге | STAGE2_AI.md |
| 2025-06-15 | NEXT_PUBLIC_SITE_URL | Fix auth emails на preview URL | Ещё один env | Dashboard Site URL |
| 2025-06-15 | city на profiles/orders | Локальный маркетплейс, пилот Сочи | Фильтрация в app, не в RLS | Больше городов в shared/cities |
