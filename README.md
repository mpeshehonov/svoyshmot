# СвойШмот

Маркетплейс индивидуальной одежды с AI-конструктором.

**Стек:** Next.js · Supabase · Vercel · Turborepo

## Быстрый старт

```bash
pnpm install
cp .env.example apps/web/.env.local
# заполни NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Структура

```
svoyshmot/
├── apps/web/           # Next.js фронтенд → Vercel
├── packages/
│   ├── shared/         # общие типы и константы
│   └── ui/             # UI-компоненты (shadcn — дальше)
└── supabase/
    ├── config.toml
    └── migrations/     # схема БД
```

## Supabase

1. Создай проект на [supabase.com](https://supabase.com)
2. Скопируй URL и publishable key в `apps/web/.env.local`
3. Примени миграции:

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```

Локально (нужен Docker):

```bash
npx supabase start
npx supabase db reset
```

## Деплой на Vercel

1. Импортируй репозиторий в Vercel
2. Root Directory: `apps/web`
3. Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`

## Документация

Полный индекс: [docs/README.md](./docs/README.md) — architecture, MVP scope, PMF metrics, security, customer discovery.

## MVP-этапы

1. Авторизация и личный кабинет
2. AI-генерация дизайнов
3. Создание заказов
4. Кабинет ателье
5. Чат и статусы
6. Платежи (позже)
