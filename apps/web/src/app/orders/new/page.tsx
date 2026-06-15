import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewOrderForm } from "./new-order-form";

export default function NewOrderPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Новый заказ</h1>
        <p className="mt-2 text-muted-foreground">
          Укажи параметры пошива — после этого опубликуешь заказ для ателье.
        </p>
        <Card className="mt-8 border-border/70 bg-card/70">
          <CardHeader>
            <CardTitle className="text-base">Параметры</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p>Загрузка...</p>}>
              <NewOrderForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
