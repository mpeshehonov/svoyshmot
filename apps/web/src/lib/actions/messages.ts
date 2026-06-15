"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Нужно войти" };

  const orderId = String(formData.get("order_id") ?? "");
  const text = String(formData.get("text") ?? "").trim();

  if (!orderId) return { error: "Заказ не указан" };
  if (text.length < 1) return { error: "Введите сообщение" };
  if (text.length > 2000) return { error: "Сообщение слишком длинное" };

  const { error } = await supabase.from("messages").insert({
    order_id: orderId,
    sender_id: user.id,
    text,
  });

  if (error) return { error: "Не удалось отправить сообщение" };

  revalidatePath(`/orders/${orderId}`);
  revalidatePath(`/atelier/orders/${orderId}`);
  return { success: true };
}
