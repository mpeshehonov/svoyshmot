# Product-Market Fit Dashboard — СвойШмот

Обновлять **каждые 2 недели**. Текущая стадия: **MVP**.

## Segment

Пилот: **Сочи** (и пригород: Адлер, Сириус). Масштабирование — через выбор города в продукте (`profiles.city`, `orders.city`).

## Activation Definition

Пользователь зарегистрировался **и** создал хотя бы один `designs` record.

## North Star (MVP)

**% опубликованных заказов с ≥1 ставкой в течение 7 дней**

Формула: `count(orders where status moved from published and has bid within 7d) / count(published orders)`

## Retention Benchmarks

| Metric | Target (MVP) | Current | Interpretation |
|--------|--------------|---------|----------------|
| Activation (reg → design) | >40% invited users | — | Ниже — онбординг/ценность не ясны |
| Publish rate (design → published order) | >25% activated | — | Ниже — страх заказа или лишние поля |
| Bid rate (published → ≥1 bid) | >50% | — | **Главный supply-сигнал** |
| Match rate (published → accepted) | >30% | — | Цена/срок/доверие |
| Day 7 return (any login) | >20% | — | Ранний retention |
| Day 30 return | >10% | — | Слабый сигнал на MVP, но трекать |
| Sean Ellis «очень расстроен» без продукта | >40% | — | Опрос после 3+ сессий |

## Funnel SQL (Supabase SQL Editor)

```sql
-- Опубликованные заказы без ставок (старше 7 дней) — тревога supply
select o.id, o.created_at
from orders o
where o.status = 'published'
  and o.created_at < now() - interval '7 days'
  and not exists (select 1 from order_bids b where b.order_id = o.id);

-- Match rate за всё время
select
  count(*) filter (where status in ('accepted','in_progress','ready','delivered'))::float
  / nullif(count(*) filter (where status != 'draft'), 0) as match_rate
from orders;
```

## False Positive Signals

- Регистрации друзей без намерения заказывать
- Spike после поста в соцсетях без повторных визитов
- Много дизайнов, 0 опубликованных заказов
- Ставки только от одного тестового ателье

**Правило:** отдельно считать `invited` vs `organic` (добавить поле `profiles.referral_source` позже).

## Skeptical Interpretation

Если метрики хорошие только у invited users — это **не PMF**, это любезность окружения.

Если bid rate высокий, но match rate низкий — проблема в цене/сроке/доверии, не в supply.

## Instrumentation TODO

| Инструмент | Приоритет | События |
|------------|-----------|---------|
| Vercel Analytics | P1 | page views |
| PostHog / Plausible | P1 | signup, design_created, order_published, bid_submitted, bid_accepted |
| Supabase cron + slack | P2 | weekly digest без ставок |

## Decision (заполнять на review)

- [ ] Continue — метрики движутся, supply есть
- [ ] Narrow — сменить город/категорию
- [ ] Adjust positioning — другой pitch (B2B ателье first)
- [ ] Pivot — гипотеза опровергнута
- [ ] Return to Idea — нужно больше discovery

**Последнее решение:** _не проводился review_  
**Дата следующего review:** ___________
