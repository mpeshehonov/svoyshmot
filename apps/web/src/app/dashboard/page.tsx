import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Package, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { designPrompt } from "@/lib/supabase-relations";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: designs }, { data: orders }, { data: profile }] =
    await Promise.all([
      supabase
        .from("designs")
        .select("id, prompt, created_at, is_public")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("orders")
        .select("id, status, created_at, designs(prompt)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("profiles").select("name, role").eq("id", user.id).single(),
    ]);

  if (profile?.role === "atelier") {
    redirect("/atelier/dashboard");
  }

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Личный кабинет</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Привет, {profile?.name ?? "дизайнер"}
            </h1>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="size-4" />
              Новый дизайн
            </Link>
          </Button>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Package className="size-4 text-primary" />
            <h2 className="text-lg font-medium">Мои заказы</h2>
            <Badge variant="secondary">{orders?.length ?? 0}</Badge>
          </div>
          {!orders?.length ? (
            <Card className="border-dashed border-border/80 bg-card/50">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Заказов пока нет. Создай дизайн и оформи пошив.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <Card className="border-border/70 bg-card/70 transition hover:border-primary/30">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="font-medium">
                          {designPrompt(order.designs)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString("ru-RU")}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-lg font-medium">Мои дизайны</h2>
            <Badge variant="secondary">{designs?.length ?? 0}</Badge>
          </div>
          {!designs?.length ? (
            <Card className="border-dashed border-border/80 bg-card/50">
              <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
                <p className="max-w-md text-muted-foreground">
                  Пока пусто. Опиши первую идею — AI-генерация картинок на
                  следующем этапе.
                </p>
                <Button asChild>
                  <Link href="/create">Создать дизайн</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {designs.map((design) => (
                <Card key={design.id} className="border-border/70 bg-card/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium leading-relaxed">
                      {design.prompt}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {new Date(design.created_at).toLocaleString("ru-RU")}
                    </p>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/orders/new?designId=${design.id}`}>
                        Оформить заказ
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
