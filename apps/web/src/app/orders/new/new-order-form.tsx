"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NewOrderForm() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId") ?? "";
  const [state, formAction, pending] = useActionState(createOrder, null);

  if (!designId) {
    return (
      <p className="text-muted-foreground">
        Не выбран дизайн.{" "}
        <Link href="/dashboard" className="text-primary hover:underline">
          Вернуться в кабинет
        </Link>
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="design_id" value={designId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Размер" name="size" placeholder="M / 48 / 170-92-102" required />
        <Field label="Пол" name="gender" placeholder="Женский / Мужской" required />
        <Field label="Цвет" name="color" placeholder="Чёрный" required />
        <Field label="Материал" name="material" placeholder="Хлопок, лён..." required />
        <Field label="Рост (см)" name="height_cm" type="number" placeholder="175" />
        <Field label="Вес (кг)" name="weight_kg" type="number" placeholder="70" />
        <Field label="Количество" name="quantity" type="number" defaultValue="1" required />
      </div>
      {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Создаём..." : "Создать заказ"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        min={type === "number" ? 1 : undefined}
      />
    </div>
  );
}
