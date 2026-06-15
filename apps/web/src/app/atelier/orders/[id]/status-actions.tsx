"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@svoyshmot/shared";
import { Button } from "@/components/ui/button";

type AtelierTransitionStatus = "in_progress" | "ready" | "delivered";

const NEXT_STATUS: Partial<Record<OrderStatus, AtelierTransitionStatus>> = {
  accepted: "in_progress",
  in_progress: "ready",
  ready: "delivered",
};

export function StatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const next = NEXT_STATUS[status];

  if (!next) return null;

  async function handleUpdate() {
    if (!next) return;
    await updateOrderStatus(orderId, next);
    router.refresh();
  }

  const labels: Record<string, string> = {
    in_progress: "Взять в работу",
    ready: "Готово к выдаче",
    delivered: "Отметить доставленным",
  };

  return (
    <Button onClick={handleUpdate} className="w-full">
      {labels[next] ?? "Обновить статус"}
    </Button>
  );
}
