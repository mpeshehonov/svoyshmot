import Link from "next/link";
import { redirect } from "next/navigation";
import { SELLER_COPY } from "@svoyshmot/shared";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderChat } from "@/components/orders/order-chat";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { designPrompt, relationOne } from "@/lib/supabase-relations";
import { BidForm } from "./bid-form";
import { StatusActions } from "./status-actions";

export default async function AtelierOrderPage({
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

  const { data: atelier } = await supabase
    .from("ateliers")
    .select("id, name, owner_id, city")
    .eq("owner_id", user.id)
    .single();

  if (!atelier) redirect("/seller/register");

  const { data: order } = await supabase
    .from("orders")
    .select("*, designs(prompt)")
    .eq("id", id)
    .single();

  if (!order) redirect("/seller/dashboard");

  const canView =
    order.atelier_id === atelier.id ||
    (order.status === "published" && order.city === atelier.city);
  if (!canView) redirect("/seller/dashboard");

  const { data: myBid } = await supabase
    .from("order_bids")
    .select("id, price, deadline, message, status")
    .eq("order_id", id)
    .eq("atelier_id", atelier.id)
    .maybeSingle();

  const { data: messages } =
    order.atelier_id === atelier.id
      ? await supabase
          .from("messages")
          .select("id, text, created_at, sender_id")
          .eq("order_id", id)
          .order("created_at", { ascending: true })
      : { data: [] };

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">
          <Link href="/seller/dashboard" className="hover:text-foreground">
            ← {SELLER_COPY.cabinet}
          </Link>
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          {designPrompt(order.designs)}
        </h1>
        <div className="mt-3">
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/70">
            <CardHeader>
              <CardTitle className="text-base">Параметры заказа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Город: {order.city ?? "—"}</p>
              <p>Размер: {order.size}</p>
              <p>Пол: {order.gender}</p>
              <p>Цвет: {order.color}</p>
              <p>Материал: {order.material}</p>
              <p>Количество: {order.quantity}</p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {order.status === "published" && !myBid ? (
              <BidForm orderId={id} />
            ) : null}

            {myBid ? (
              <Card className="border-border/70 bg-card/70">
                <CardContent className="py-4 text-sm">
                  <p className="font-medium">Ваше предложение</p>
                  <p className="mt-2">
                    {myBid.price} ₽ · до{" "}
                    {new Date(myBid.deadline).toLocaleDateString("ru-RU")}
                  </p>
                  {myBid.message ? (
                    <p className="mt-1 text-muted-foreground">{myBid.message}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-primary">
                    Статус:{" "}
                    {myBid.status === "pending"
                      ? "Ожидает выбора клиента"
                      : myBid.status === "accepted"
                        ? "Принято"
                        : "Отклонено"}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {order.atelier_id === atelier.id ? (
              <StatusActions orderId={id} status={order.status} />
            ) : null}
          </div>
        </div>

        {order.atelier_id === atelier.id ? (
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
