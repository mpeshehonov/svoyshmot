import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderChat } from "@/components/orders/order-chat";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { acceptBid, publishOrder, updateOrderStatus } from "@/lib/actions/orders";
import { SELLER_COPY } from "@svoyshmot/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { designPrompt, relationOne } from "@/lib/supabase-relations";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, designs(prompt), ateliers(name, city, rating)",
    )
    .eq("id", id)
    .single();

  if (!order || order.user_id !== user.id) redirect("/dashboard");

  const { data: bids } = await supabase
    .from("order_bids")
    .select("id, price, deadline, message, status, created_at, ateliers(name, city, rating)")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const { data: messages } = await supabase
    .from("messages")
    .select("id, text, created_at, sender_id")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  async function publishAction() {
    "use server";
    await publishOrder(id);
  }

  async function acceptBidAction(formData: FormData) {
    "use server";
    const bidId = String(formData.get("bid_id"));
    await acceptBid(bidId, id);
  }

  async function cancelAction() {
    "use server";
    await updateOrderStatus(id, "cancelled");
  }

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                ← Кабинет
              </Link>
            </p>
            <h1 className="mt-2 text-2xl font-semibold">
              {designPrompt(order.designs)}
            </h1>
            <div className="mt-3">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Детали заказа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Город" value={order.city ?? "—"} />
              <Row label="Размер" value={order.size} />
              <Row label="Пол" value={order.gender} />
              <Row label="Цвет" value={order.color} />
              <Row label="Материал" value={order.material} />
              <Row label="Количество" value={String(order.quantity)} />
              {order.price ? <Row label="Цена" value={`${order.price} ₽`} /> : null}
              {order.deadline ? (
                <Row
                  label="Срок"
                  value={new Date(order.deadline).toLocaleDateString("ru-RU")}
                />
              ) : null}
              {order.ateliers ? (
                <Row
                  label={SELLER_COPY.orderLabel}
                  value={relationOne<{ name: string }>(order.ateliers)?.name ?? "—"}
                />
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {order.status === "draft" ? (
              <form action={publishAction}>
                <p className="mb-3 text-sm text-muted-foreground">
                  {SELLER_COPY.orderPublishHint(order.city ?? "—")}
                </p>
                <Button type="submit" className="w-full">
                  {SELLER_COPY.publishButton}
                </Button>
              </form>
            ) : null}

            {order.status === "published" && (
              <Card className="border-border/70 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-base">{SELLER_COPY.bidsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!bids?.length ? (
                    <p className="text-sm text-muted-foreground">
                      {SELLER_COPY.bidsEmpty}
                    </p>
                  ) : (
                    bids.map((bid) => {
                      const atelier = relationOne<{
                        name: string;
                        city: string;
                        rating: number;
                      }>(bid.ateliers);

                      return (
                      <div
                        key={bid.id}
                        className="rounded-xl border border-border/70 p-3"
                      >
                        <p className="font-medium">{atelier?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {atelier?.city} · рейтинг {atelier?.rating}
                        </p>
                        <p className="mt-2 text-sm">
                          {bid.price} ₽ · до{" "}
                          {new Date(bid.deadline).toLocaleDateString("ru-RU")}
                        </p>
                        {bid.message ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {bid.message}
                          </p>
                        ) : null}
                        {bid.status === "pending" ? (
                          <form action={acceptBidAction} className="mt-3">
                            <input type="hidden" name="bid_id" value={bid.id} />
                            <Button type="submit" size="sm">
                              {SELLER_COPY.selectBid}
                            </Button>
                          </form>
                        ) : (
                          <p className="mt-2 text-xs text-primary">
                            {bid.status === "accepted" ? "Выбрано" : "Отклонено"}
                          </p>
                        )}
                      </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            )}

            {["accepted", "in_progress", "ready"].includes(order.status) ? (
              <form action={cancelAction}>
                <Button type="submit" variant="outline" className="w-full">
                  Отменить заказ
                </Button>
              </form>
            ) : null}
          </div>
        </div>

        {order.atelier_id ? (
          <div className="mt-8">
            <OrderChat
              orderId={id}
              initialMessages={messages ?? []}
              currentUserId={user.id}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
