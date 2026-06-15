# Документация СвойШмот

Навигация по артефактам проекта (MVP-стадия).

| Документ | Назначение |
|----------|------------|
| [MVP_SCOPE.md](./MVP_SCOPE.md) | Что в scope, что исключено, метрики, риски |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Контекст для coding agents: стек, потоки, RLS, правила |
| [PROBLEM_HYPOTHESIS.md](./PROBLEM_HYPOTHESIS.md) | Гипотеза проблемы и сегмент (нужно валидировать) |
| [CUSTOMER_DISCOVERY.md](./CUSTOMER_DISCOVERY.md) | План интервью с клиентами и ателье |
| [PMF_DASHBOARD.md](./PMF_DASHBOARD.md) | Метрики product-market fit, цели, false positives |
| [SECURITY.md](./SECURITY.md) | Чеклист безопасности перед онбордингом |
| [SUPABASE_AUTH.md](./SUPABASE_AUTH.md) | Site URL, redirect, письма подтверждения |
| [STAGE2_AI.md](./STAGE2_AI.md) | План AI-генерации изображений (после первых заказов) |

## Быстрые команды

```bash
# Чеклист стадии MVP (founder playbook)
node .agents/skills/ai-native-founder-playbook/scripts/stage-checklist.mjs mvp

# Сборка и миграции
pnpm build
npx supabase db push
```

## Review cadence

Каждые **2 недели**: обновить PMF Dashboard, сверить scope, решить proceed / narrow / pivot.
