import type { OrderStatus } from "@svoyshmot/shared";
import { SELLER_COPY } from "@svoyshmot/shared";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Черновик",
  published: SELLER_COPY.statusPublished,
  accepted: SELLER_COPY.statusAccepted,
  in_progress: "В работе",
  ready: "Готово",
  delivered: "Доставлено",
  cancelled: "Отменён",
};

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status] ?? status;
}
