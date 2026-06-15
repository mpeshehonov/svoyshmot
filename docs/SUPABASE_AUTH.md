# Настройка Auth в Supabase Dashboard

Проект: `fsylhnhlqmwwzaeszoue` · Production: https://svoyshmot.vercel.app

## Authentication → URL Configuration

| Поле | Значение |
|------|----------|
| **Site URL** | `https://svoyshmot.vercel.app` |
| **Redirect URLs** | `https://svoyshmot.vercel.app/**` |
| | `http://localhost:3000/**` |

## Email templates

Ссылки в письмах берутся из **Site URL**, не из preview-домена Vercel.
Если письмо ведёт на `*.vercel.app` — Site URL в Dashboard указан неверно.

## Vercel env

```
NEXT_PUBLIC_SITE_URL=https://svoyshmot.vercel.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## Локально

`apps/web/.env.local` — `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
