# Stage 2 — AI-генерация изображений

**Gate:** минимум 1 matched заказ (accepted) **без** AI-картинок ИЛИ 3+ интервью, где респонденты говорят «без визуализации не закажу».

## Scope

- 4 варианта изображения по `designs.prompt`
- Сохранение в Supabase Storage → `designs.image_url`
- Выбор варианта пользователем перед заказом
- Лендинг: реальные превью вместо заглушек

## Out of Scope (Stage 2)

- Виртуальная примерка на фото тела
- Видео / 3D
- Fine-tuning моделей
- Генерация выкроек

## Provider Options

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| OpenAI gpt-image / DALL·E | Качество, API | Оплата, 152-ФЗ / трансграничная передача |
| Replicate (SDXL, Flux) | Гибкость | Latency, модерация |
| YandexART / GigaChat (если доступно) | Локальность РФ | Качество fashion, API limits |
| Vercel AI Gateway | Единый роутинг | Нужен бюджет |

**Решение:** выбрать после gate; начать с одного провайдера, 4 parallel requests.

## Architecture Sketch

```
/create (client) → Server Action generateDesignImages(designId)
  → rate limit per user
  → call AI API (server-only key)
  → upload 4 images to Storage bucket `designs/{userId}/{designId}/`
  → update designs.image_url (primary) + table design_variants (optional)
```

## Env (server-only)

```bash
AI_IMAGE_PROVIDER=openai
AI_IMAGE_API_KEY=...
```

Не добавлять в `NEXT_PUBLIC_*`.

## Security

- Модерация промптов (блоклист, OpenAI moderation API)
- Лимиты: N генераций / день / user
- Стоимость: hard cap в провайдере

## Metrics

- % пользователей, запустивших генерацию
- % генераций → опубликованный заказ (сравнить с веткой без картинок)
- Cost per matched order

## Tasks (когда gate пройден)

1. Migration: `design_variants` или jsonb на designs
2. Supabase Storage bucket + RLS
3. `lib/actions/generate-images.ts`
4. UI: grid 4 previews, loading states, RU errors
5. Обновить ARCHITECTURE.md Decision Log
