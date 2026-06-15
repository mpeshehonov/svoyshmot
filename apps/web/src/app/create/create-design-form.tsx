"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createDesign } from "@/lib/actions/designs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function CreateDesignForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generating, setGenerating] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; id?: string } | null, formData: FormData) => {
      const value = String(formData.get("prompt") ?? "");
      return (await createDesign(value)) ?? null;
    },
    null,
  );

  useEffect(() => {
    if (state?.id) {
      toast.success("Идея сохранена — AI-генерация подключится на след. этапе");
      router.push("/dashboard");
    }
  }, [state?.id, router]);

  async function handleGeneratePreview() {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGenerating(false);
    toast.message("AI-генерация скоро", {
      description: "Сейчас сохраняем промпт. Картинки подключим на этапе 2.",
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
          Этап 1 · MVP
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Новый дизайн</h1>
        <p className="mt-2 text-muted-foreground">
          Опиши вещь максимально конкретно — фасон, цвет, детали, настроение.
        </p>

        <form action={formAction} className="mt-8 space-y-6">
          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Промпт</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                name="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-40 resize-none text-base leading-relaxed"
                placeholder="Например: oversize худи из плотного хлопка, графитовый цвет, принт дракона на спине..."
                required
                minLength={10}
              />
              {state?.error ? (
                <p className="text-sm text-destructive">{state.error}</p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGeneratePreview}
                  disabled={generating || prompt.length < 10}
                >
                  {generating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Превью AI
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Сохраняем..." : "Сохранить идею"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((slot) => (
            <div
              key={slot}
              className="aspect-square rounded-2xl border border-dashed border-border/80 bg-gradient-to-br from-primary/10 via-card to-accent/10"
            />
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Здесь появятся 4 варианта после подключения генерации
        </p>
    </main>
  );
}
