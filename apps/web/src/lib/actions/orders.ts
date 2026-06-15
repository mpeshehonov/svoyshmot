"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserCity } from "@/lib/city";
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

export async function createOrder(
  _prev: { error?: string; id?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Нужно войти в аккаунт" };

  const designId = String(formData.get("design_id") ?? "");
  const size = String(formData.get("size") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const material = String(formData.get("material") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const heightCm = Number(formData.get("height_cm") ?? 0) || null;
  const weightKg = Number(formData.get("weight_kg") ?? 0) || null;

  if (!designId) return { error: "Не выбран дизайн" };
  if (!size) return { error: "Укажите размер" };
  if (!gender) return { error: "Укажите пол" };
  if (!color) return { error: "Укажите цвет" };
  if (!material) return { error: "Укажите материал" };
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { error: "Количество должно быть не меньше 1" };
  }

  const { data: design } = await supabase
    .from("designs")
    .select("id")
    .eq("id", designId)
    .eq("user_id", user.id)
    .single();

  if (!design) return { error: "Дизайн не найден" };

  const city = await getUserCity();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      design_id: designId,
      city,
      size,
      gender,
      color,
      material,
      quantity,
      height_cm: heightCm,
      weight_kg: weightKg,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: "Не удалось создать заказ" };

  revalidatePath("/dashboard");
  redirect(`/orders/${data.id}`);
}

export async function publishOrder(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Нужно войти" };

  const city = await getUserCity();

  const { error } = await supabase
    .from("orders")
    .update({ status: "published", city })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "draft");

  if (error) return { error: "Не удалось опубликовать заказ" };

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/seller/dashboard");
  return { success: true };
}

export async function acceptBid(bidId: string, orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Нужно войти" };

  const { data: bid } = await supabase
    .from("order_bids")
    .select("id, atelier_id, price, deadline, order_id")
    .eq("id", bidId)
    .single();

  if (!bid) return { error: "Предложение не найдено" };

  const { data: order } = await supabase
    .from("orders")
    .select("user_id, status")
    .eq("id", orderId)
    .single();

  if (!order || order.user_id !== user.id) {
    return { error: "Нет доступа к заказу" };
  }
  if (order.status !== "published") {
    return { error: "Заказ уже принят или закрыт" };
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: "accepted",
      atelier_id: bid.atelier_id,
      price: bid.price,
      deadline: bid.deadline,
    })
    .eq("id", orderId);

  if (orderError) return { error: "Не удалось принять предложение" };

  await supabase
    .from("order_bids")
    .update({ status: "accepted" })
    .eq("id", bidId);

  await supabase
    .from("order_bids")
    .update({ status: "rejected" })
    .eq("order_id", orderId)
    .neq("id", bidId);

  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/seller/dashboard");
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: "in_progress" | "ready" | "delivered" | "cancelled",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Нужно войти" };

  const { data: order } = await supabase
    .from("orders")
    .select("user_id, atelier_id, status")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Заказ не найден" };

  const isOwner = order.user_id === user.id;
  const isAtelier =
    order.atelier_id &&
    (
      await supabase
        .from("ateliers")
        .select("owner_id")
        .eq("id", order.atelier_id)
        .single()
    ).data?.owner_id === user.id;

  if (!isOwner && !isAtelier) return { error: "Нет доступа" };

  const allowedForAtelier = ["in_progress", "ready", "delivered"];
  const allowedForClient = ["cancelled"];

  if (isAtelier && !allowedForAtelier.includes(status)) {
    return { error: "Недопустимый статус" };
  }
  if (isOwner && !isAtelier && !allowedForClient.includes(status)) {
    return { error: "Клиент может только отменить заказ" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { error: "Не удалось обновить статус" };

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/seller/orders/${orderId}`);
  return { success: true };
}
