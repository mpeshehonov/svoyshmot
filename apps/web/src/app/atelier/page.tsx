import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { getAtelierOnboardingPath } from "@/lib/atelier-routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AtelierLandingPage() {
  const onboardingPath = await getAtelierOnboardingPath();

  if (onboardingPath) {
    redirect(onboardingPath);
  }

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
                <Link href="/register?role=atelier">Подключить ателье</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login?next=/atelier/register">
                  Уже есть аккаунт — войти
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              С аккаунтом клиента можно стать ателье — после входа откроется
              форма профиля мастерской.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
