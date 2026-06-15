import Link from "next/link";
import { redirect } from "next/navigation";
import { SELLER_COPY } from "@svoyshmot/shared";
import { SiteHeader } from "@/components/layout/site-header";
import { getSellerOnboardingPath } from "@/lib/seller-routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AtelierLandingPage() {
  const onboardingPath = await getSellerOnboardingPath();

  if (onboardingPath) {
    redirect(onboardingPath);
  }

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Card className="border-border/70 bg-card/70">
          <CardContent className="space-y-6 py-10 text-center">
            <h1 className="text-3xl font-semibold">{SELLER_COPY.landingTitle}</h1>
            <p className="text-muted-foreground">{SELLER_COPY.landingLead}</p>
            <p className="text-sm text-muted-foreground">{SELLER_COPY.typesHint}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/register?role=atelier">{SELLER_COPY.connectAction}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/login?next=/seller/register">
                  Уже есть аккаунт — войти
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              С аккаунтом клиента можно {SELLER_COPY.become.toLowerCase()} — после
              входа откроется форма профиля ({SELLER_COPY.typesShort}).
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
