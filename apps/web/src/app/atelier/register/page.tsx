"use client";

import { useActionState } from "react";
import { registerAtelier } from "@/lib/actions/atelier";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AtelierRegisterPage() {
  const [state, formAction, pending] = useActionState(registerAtelier, null);

  return (
    <AuthShell
      title="Профиль ателье"
      description="Расскажи о мастерской — клиенты увидят это в предложениях"
      footer="После сохранения откроется кабинет ателье"
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input id="name" name="name" required placeholder="Ателье «Нить»" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input id="city" name="city" required placeholder="Москва" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            name="description"
            required
            minLength={20}
            className="min-h-28"
            placeholder="Специализация, опыт, типы изделий..."
          />
          <p className="text-xs text-muted-foreground">Минимум 20 символов</p>
        </div>
        {state?.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Сохраняем..." : "Создать профиль"}
        </Button>
      </form>
    </AuthShell>
  );
}
