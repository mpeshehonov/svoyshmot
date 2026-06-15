"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  const [clientState, clientAction, clientPending] = useActionState(signUp, null);
  const [atelierState, atelierAction, atelierPending] = useActionState(signUp, null);

  return (
    <AuthShell
      title="Создай аккаунт"
      description="Клиент или ателье — выбери роль при регистрации"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <Tabs defaultValue="client">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="client">Я клиент</TabsTrigger>
          <TabsTrigger value="atelier">Я ателье</TabsTrigger>
        </TabsList>

        <TabsContent value="client">
          <form action={clientAction} className="mt-4 space-y-4">
            <input type="hidden" name="role" value="client" />
            <FieldGroup />
            {clientState?.error ? (
              <p className="text-sm text-destructive">{clientState.error}</p>
            ) : null}
            {clientState?.success ? (
              <p className="text-sm text-primary">{clientState.success}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={clientPending}>
              {clientPending ? "Создаём..." : "Зарегистрироваться"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="atelier">
          <form action={atelierAction} className="mt-4 space-y-4">
            <input type="hidden" name="role" value="atelier" />
            <FieldGroup />
            <p className="text-xs text-muted-foreground">
              После подтверждения email заполнишь профиль мастерской.
            </p>
            {atelierState?.error ? (
              <p className="text-sm text-destructive">{atelierState.error}</p>
            ) : null}
            {atelierState?.success ? (
              <p className="text-sm text-primary">{atelierState.success}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={atelierPending}>
              {atelierPending ? "Создаём..." : "Зарегистрировать ателье"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}

function FieldGroup() {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Имя</Label>
        <Input id="name" name="name" placeholder="Как к тебе обращаться" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">Минимум 6 символов</p>
      </div>
    </>
  );
}
