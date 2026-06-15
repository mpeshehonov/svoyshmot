import Link from "next/link";
import { APP_NAME } from "@svoyshmot/shared";
import { Scissors } from "lucide-react";
import { getProfile } from "@/lib/auth";
import { getUserCity } from "@/lib/city";
import { CitySelector } from "@/components/location/city-selector";
import { SiteHeaderUser } from "./site-header-user";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const [profile, city] = await Promise.all([getProfile(), getUserCity()]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25 transition group-hover:bg-primary/25">
            <Scissors className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#how" className="transition hover:text-foreground">
            Как работает
          </Link>
          <Link href="/#feed" className="transition hover:text-foreground">
            Лента
          </Link>
          <Link href="/atelier" className="transition hover:text-foreground">
            Для ателье
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <CitySelector currentCity={city} />
          {profile ? (
            <SiteHeaderUser
              name={profile.name ?? "Пользователь"}
              role={profile.role}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Начать</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
