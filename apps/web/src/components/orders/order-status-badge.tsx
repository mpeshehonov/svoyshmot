import type { OrderStatus } from "@svoyshmot/shared";
import { Badge } from "@/components/ui/badge";
import { getOrderStatusLabel } from "@/lib/order-status";

const VARIANTS: Partial<
  Record<OrderStatus, "default" | "secondary" | "outline" | "destructive">
> = {
  draft: "outline",
  published: "secondary",
  accepted: "default",
  in_progress: "default",
  ready: "default",
  delivered: "secondary",
  cancelled: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={VARIANTS[status] ?? "outline"}>
      {getOrderStatusLabel(status)}
    </Badge>
  );
}
