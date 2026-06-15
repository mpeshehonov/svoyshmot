"use client";

import { useActionState } from "react";
import { SELLER_COPY, SELLER_KINDS } from "@svoyshmot/shared";
import { registerSeller } from "@/lib/actions/seller";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function SellerRegisterForm({ defaultCity }: { defaultCity: string }) {
  const [state, formAction, pending] = useActionState(registerSeller, null);

  return (
    <AuthShell
      title={SELLER_COPY.profile}
      description={SELLER_COPY.typesHint}
      footer={`После сохранения откроется ${SELLER_COPY.cabinet.toLowerCase()}`}
    >
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seller_kind">{SELLER_COPY.kindLabel}</Label>
          <select
            id="seller_kind"
            name="seller_kind"
            className={selectClassName}
            defaultValue="workshop"
          >
            {SELLER_KINDS.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {kind.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{SELLER_COPY.nameLabel}</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder={SELLER_COPY.namePlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            name="city"
            required
            defaultValue={defaultCity}
            placeholder="Сочи"
          />
          <p className="text-xs text-muted-foreground">
            Заказы видят только {SELLER_COPY.toMany} в этом городе. Город можно
            сменить в шапке сайта.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            name="description"
            required
            minLength={20}
            className="min-h-28"
            placeholder="Специализация, опыт, типы изделий, свой цех или бренд…"
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
