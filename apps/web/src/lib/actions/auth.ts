"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  translateAuthError,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth-errors";
import { getAuthCallbackUrl } from "@/lib/site-url";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signUp(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "client");

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  const nameError = validateName(name);
  if (nameError) return { error: nameError };

  const supabase = await createClient();
  const nextPath = role === "atelier" ? "/seller/register" : "/dashboard";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0],
        intended_role: role,
      },
      emailRedirectTo: getAuthCallbackUrl(nextPath),
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  if (data.user && !data.session) {
    return {
      success: `Мы отправили письмо на ${email}. Перейди по ссылке, чтобы подтвердить аккаунт.`,
    };
  }

  if (role === "atelier") {
    redirect("/seller/register");
  }

  redirect("/dashboard");
}

export async function signIn(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  if (!password) return { error: "Укажите пароль" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  const next = String(formData.get("next") ?? "").trim();
  redirect(next && next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resendConfirmationEmail(
  _prev: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl("/dashboard"),
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  return { success: "Письмо отправлено повторно. Проверьте почту." };
}
