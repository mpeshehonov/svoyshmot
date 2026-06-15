# Security Review — СвойШмот (MVP)

Не юридическая консультация. Чеклист перед массовым онбордингом.

## Auth & Session

- [x] Supabase Auth, cookies через `@supabase/ssr`
- [x] Middleware обновляет сессию и редиректит неавторизованных с protected paths
- [x] `emailRedirectTo` на production Site URL ([SUPABASE_AUTH.md](./SUPABASE_AUTH.md))
- [ ] Supabase Dashboard: Site URL и Redirect URLs настроены вручную
- [ ] Rate limiting на auth (Supabase built-in + при необходимости CAPTCHA)

## Row Level Security

| Таблица | Политики | Проверено |
|---------|----------|-----------|
| profiles | own read/update | [ ] |
| ateliers | owner CRUD, public read | [ ] |
| designs | own CRUD, public read if is_public | [ ] |
| orders | owner, assigned atelier, published for atelier role | [ ] |
| order_bids | participants + bidder | [ ] |
| messages | order participants | [ ] |

**Ручная проверка:** два тестовых аккаунта (client A, client B, atelier C) — A не видит заказы B; C не видит чужие accepted orders.

## Server Actions

- [x] Actions проверяют `getUser()` перед мутациями
- [x] Дополнительные проверки owner/seller на критичных операциях (accept bid, status)
- [ ] Идемпотентность accept bid (повторный submit)
- [ ] Валидация входных данных (zod) — желательно, сейчас FormData + ручная валидация

## Secrets

- [x] `.env*.local` в `.gitignore`
- [x] Только publishable key в `NEXT_PUBLIC_*`
- [ ] Service role не в Vercel env для `apps/web` (если есть — убрать из frontend project)
- [ ] Ротация ключей при утечке — процедура описана

## Data & Privacy (РФ)

- [ ] Политика конфиденциальности на сайте (текст + согласие при регистрации)
- [ ] Минимизация ПДн в заказах (рост/вес — обоснование для пошива)
- [ ] Процедура удаления аккаунта (GDPR-like: export + delete)
- [ ] Хостинг: Supabase region, Vercel — зафиксировать в политике

## Chat & Content

- [ ] Нет HTML injection в сообщениях (сейчас plain text — ок)
- [ ] Лимит длины сообщения
- [ ] Модерация / report — post-MVP

## AI (Stage 2)

- [ ] Промпты не логировать в third-party без согласия
- [ ] Фильтр NSFW / запрещённого контента
- [ ] Watermark / ToS на сгенерированных изображениях

## Infrastructure

- [x] HTTPS на production (Vercel)
- [ ] Security headers (CSP, HSTS) — Next config
- [ ] Dependency audit: `pnpm audit` в CI
- [ ] Backup: Supabase point-in-time (план по тарифу)

## Incident Response (минимум)

1. Отозвать скомпрометированные ключи Supabase
2. Force logout через Supabase Admin
3. Уведомить пользователей при утечке ПДн (юрист)

## Sign-off

| Роль | Имя | Дата | Статус |
|------|-----|------|--------|
| Founder | | | Pending |
| Dev review | | | Partial (RLS coded) |

**Следующий полный проход:** перед 50+ реальными пользователями или подключением оплаты.
