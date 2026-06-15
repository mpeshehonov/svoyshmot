import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@svoyshmot/shared";

const steps = [
  {
    title: "Опиши идею",
    description:
      "Текстом или референсами — ИИ сгенерирует несколько вариантов дизайна.",
  },
  {
    title: "Настрой заказ",
    description: "Размер, ткань, цвет и детали — всё в одном месте.",
  },
  {
    title: "Выбери ателье",
    description:
      "Сравни цены, сроки и отзывы. Общайся в чате прямо на платформе.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-muted transition-colors hover:text-foreground"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-accent px-4 py-2 font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Начать
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
              AI · Пошив · Маркетплейс
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {APP_TAGLINE}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Создай уникальную одежду с помощью ИИ и закажи пошив в
              проверенном ателье. Не с полки — свой.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Создать дизайн
              </Link>
              <Link
                href="/atelier"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-8 font-medium transition-colors hover:border-foreground/20"
              >
                Я ателье
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
            {steps.map((step, index) => (
              <article key={step.title} className="space-y-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {index + 1}
                </span>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="leading-relaxed text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-dashed border-border bg-card p-8 md:p-12">
            <h2 className="text-2xl font-semibold">MVP в разработке</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Сейчас поднимаем базу: авторизация, генерация дизайнов, заказы,
              кабинет ателье и чат. Без оплаты на старте — сначала проверим
              спрос.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-muted md:grid-cols-2">
              <li>✓ Supabase — auth, БД, storage, realtime</li>
              <li>✓ Next.js — фронт на Vercel</li>
              <li>✓ Монорепа — готова к росту</li>
              <li>○ AI-генерация — следующий этап</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-muted">
          <span>{APP_NAME}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
