import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AtelierLandingPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="border-border/70 bg-card/70">
          <CardContent className="space-y-6 py-10 text-center">
            <h1 className="text-3xl font-semibold">Ателье на СвойШмот</h1>
            <p className="text-muted-foreground">
              Получайте заказы с готовым описанием и визуалом. Отправляйте цену
              и срок — клиент выберет лучшее предложение. Общайтесь в чате без
              звонков.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/register">Подключить ателье</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login">Уже есть аккаунт</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
