"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { SELLER_COPY } from "@svoyshmot/shared";
import { signIn } from "@/lib/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const authError = searchParams.get("error");
  const isAtelierFlow = next === "/atelier/register";

  const [state, formAction, pending] = useActionState(signIn, null);

  const registerHref = isAtelierFlow
    ? "/register?role=atelier"
    : "/register";

  return (
    <AuthShell
      title="С возвращением"
      description={
        isAtelierFlow
          ? `Войди в существующий аккаунт — дальше создашь ${SELLER_COPY.profile.toLowerCase()}`
          : "Войди, чтобы сохранять дизайны и оформлять заказы"
      }
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href={registerHref} className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
          />
        </div>
        {authError ? (
          <p className="text-sm text-destructive">
            Не удалось подтвердить вход. Попробуйте снова.
          </p>
        ) : null}
        {state?.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        {state?.success ? (
          <p className="text-sm text-primary">{state.success}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Входим..." : "Войти"}
        </Button>
      </form>
    </AuthShell>
  );
}
