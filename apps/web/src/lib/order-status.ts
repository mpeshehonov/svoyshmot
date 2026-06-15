import type { OrderStatus } from "@svoyshmot/shared";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Черновик",
  published: "Ищем ателье",
  accepted: "Ателье выбрано",
  in_progress: "В работе",
  ready: "Готово",
  delivered: "Доставлено",
  cancelled: "Отменён",
};

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status] ?? status;
}
