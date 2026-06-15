"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registerAtelier(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Нужно войти в аккаунт" };

  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 2) return { error: "Название ателье — минимум 2 символа" };
  if (!city) return { error: "Укажите город" };
  if (description.length < 20) {
    return { error: "Описание — минимум 20 символов" };
  }

  const { data: existing } = await supabase
    .from("ateliers")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "У вас уже есть профиль ателье" };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "atelier" })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Не удалось обновить профиль" };
  }

  const { error } = await supabase.from("ateliers").insert({
    owner_id: user.id,
    name,
    city,
    description,
  });

  if (error) return { error: "Не удалось создать профиль ателье" };

  revalidatePath("/", "layout");
  redirect("/atelier/dashboard");
}

export async function submitBid(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Нужно войти" };

  const orderId = String(formData.get("order_id") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const deadline = String(formData.get("deadline") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!orderId) return { error: "Заказ не указан" };
  if (!Number.isFinite(price) || price < 500) {
    return { error: "Минимальная цена — 500 ₽" };
  }
  if (!deadline) return { error: "Укажите срок готовности" };

  const { data: atelier } = await supabase
    .from("ateliers")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!atelier) return { error: "Сначала зарегистрируйте ателье" };

  const { error } = await supabase.from("order_bids").insert({
    order_id: orderId,
    atelier_id: atelier.id,
    price,
    deadline,
    message: message || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Вы уже отправили предложение по этому заказу" };
    }
    return { error: "Не удалось отправить предложение" };
  }

  revalidatePath(`/atelier/orders/${orderId}`);
  revalidatePath("/atelier/dashboard");
  return { success: true };
}
