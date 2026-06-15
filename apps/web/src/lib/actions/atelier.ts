"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveCity } from "@svoyshmot/shared";
import type { SellerKind } from "@svoyshmot/shared";
import { SELLER_KINDS } from "@svoyshmot/shared";
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
  const cityRaw = String(formData.get("city") ?? "").trim();
  const city = resolveCity(cityRaw);
  const sellerKindRaw = String(formData.get("seller_kind") ?? "atelier");
  const sellerKind = SELLER_KINDS.some((k) => k.value === sellerKindRaw)
    ? (sellerKindRaw as SellerKind)
    : "atelier";
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 2) return { error: "Название — минимум 2 символа" };
  if (!city) return { error: "Укажите корректный город" };
  if (description.length < 20) {
    return { error: "Описание — минимум 20 символов" };
  }

  const { data: existing } = await supabase
    .from("ateliers")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "У вас уже есть профиль продавца" };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "atelier", city })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Не удалось обновить профиль" };
  }

  const { error } = await supabase.from("ateliers").insert({
    owner_id: user.id,
    name,
    city,
    seller_kind: sellerKind,
    description,
  });

  if (error) return { error: "Не удалось создать профиль продавца" };

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
    .select("id, city")
    .eq("owner_id", user.id)
    .single();

  if (!atelier) return { error: "Сначала зарегистрируйте профиль продавца" };

  const { data: order } = await supabase
    .from("orders")
    .select("status, city")
    .eq("id", orderId)
    .single();

  if (!order || order.status !== "published") {
    return { error: "Заказ недоступен для предложения" };
  }

  if (order.city && atelier.city && order.city !== atelier.city) {
    return {
      error: `Этот заказ из города «${order.city}». Ваш профиль в «${atelier.city}».`,
    };
  }

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
