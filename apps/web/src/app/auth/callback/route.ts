import { NextResponse } from "next/server";
import { CITY_COOKIE_NAME, resolveCity } from "@svoyshmot/shared";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const siteUrl = getSiteUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const cookieStore = await cookies();
      const rawCity = cookieStore.get(CITY_COOKIE_NAME)?.value;
      const city = rawCity ? resolveCity(decodeURIComponent(rawCity)) : null;

      if (city) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ city })
            .eq("id", user.id)
            .is("city", null);
        }
      }

      const safeNext = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${siteUrl}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${siteUrl}/login?error=auth`);
}
