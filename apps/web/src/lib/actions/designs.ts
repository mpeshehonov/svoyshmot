"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createDesign(prompt: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Нужно войти в аккаунт" };
  }

  const trimmed = prompt.trim();
  if (trimmed.length < 10) {
    return { error: "Опиши идею чуть подробнее — минимум 10 символов" };
  }

  const { data, error } = await supabase
    .from("designs")
    .insert({ user_id: user.id, prompt: trimmed })
    .select("id")
    .single();

  if (error) {
    return { error: "Не удалось сохранить дизайн. Попробуйте позже." };
  }

  revalidatePath("/dashboard");
  return { id: data.id };
}
