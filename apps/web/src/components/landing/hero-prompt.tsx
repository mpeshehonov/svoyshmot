"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2 } from "lucide-react";
import { APP_TAGLINE } from "@svoyshmot/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const examples = [
  "Чёрная oversized футболка в стиле cyberpunk с неоновыми вставками",
  "Льняное платье-миди с асимметричным вырезом и мягкими складками",
  "Укороченная куртка из денима с вышивкой дракона на спине",
];

export function HeroPrompt() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(examples[0]);

  function handleCreate() {
    const params = new URLSearchParams({ prompt });
    router.push(`/create?${params.toString()}`);
  }

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute -right-24 top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 size-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge
            variant="secondary"
            className="mb-5 border border-primary/20 bg-primary/10 text-primary"
          >
            <Sparkles className="size-3.5" />
            AI · Пошив · Маркетплейс
          </Badge>

          <h1 className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">{APP_TAGLINE}</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Опиши свой шмот — ИИ накидает варианты, ателье сшьёт. Не с полки,
            а твой.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="rounded-full border border-border bg-card/60 px-3 py-1">
              4 варианта за раз
            </span>
            <span className="rounded-full border border-border bg-card/60 px-3 py-1">
              Чат с ателье
            </span>
            <span className="rounded-full border border-border bg-card/60 px-3 py-1">
              Лента идей
            </span>
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-3xl p-1 shadow-2xl shadow-primary/10">
          <div className="thread-line absolute inset-x-8 top-0" />
          <div className="rounded-[1.25rem] bg-card/90 p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Wand2 className="size-4 text-primary" />
                Конструктор
              </div>
              <span className="text-xs text-muted-foreground">
                {prompt.length} симв.
              </span>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-32 resize-none border-border/60 bg-background/60 text-base leading-relaxed"
              placeholder="Опиши, что хочешь сшить..."
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setPrompt(example)}
                  className="rounded-full border border-border/80 bg-secondary/50 px-3 py-1.5 text-left text-xs text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
                >
                  {example.slice(0, 42)}…
                </button>
              ))}
            </div>

            <Button className="mt-5 w-full" size="lg" onClick={handleCreate}>
              <Sparkles className="size-4" />
              Сгенерировать дизайн
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
