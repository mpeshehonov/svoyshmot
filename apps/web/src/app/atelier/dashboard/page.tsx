import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { designPrompt, relationOne } from "@/lib/supabase-relations";

export default async function AtelierDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  const { data: atelier } = await supabase
    .from("ateliers")
    .select("id, name, city, rating")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!atelier) {
    redirect("/atelier/register");
  }

  const [{ data: published }, { data: active }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, status, created_at, designs(prompt)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("orders")
      .select("id, status, created_at, designs(prompt), price, deadline")
      .eq("atelier_id", atelier.id)
      .neq("status", "published")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Кабинет ателье</p>
            <h1 className="mt-1 text-3xl font-semibold">{atelier.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {atelier.city} · рейтинг {atelier.rating}
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-medium">Новые заказы</h2>
            <Badge variant="secondary">{published?.length ?? 0}</Badge>
          </div>
          {!published?.length ? (
            <Card className="border-dashed bg-card/50">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Нет открытых заказов. Клиенты публикуют заявки после оформления.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {published.map((order) => (
                <Link key={order.id} href={`/atelier/orders/${order.id}`}>
                  <Card className="transition hover:border-primary/30">
                    <CardContent className="flex items-center justify-between py-4">
                      <p className="font-medium">
                        {designPrompt(order.designs)}
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-medium">Мои заказы</h2>
          {!active?.length ? (
            <p className="text-sm text-muted-foreground">
              Примите заказ из ленты — отправьте цену и срок.
            </p>
          ) : (
            <div className="grid gap-3">
              {active.map((order) => (
                <Link key={order.id} href={`/atelier/orders/${order.id}`}>
                  <Card className="transition hover:border-primary/30">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="font-medium">
                          {designPrompt(order.designs)}
                        </p>
                        {order.price ? (
                          <p className="text-xs text-muted-foreground">
                            {order.price} ₽
                          </p>
                        ) : null}
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
