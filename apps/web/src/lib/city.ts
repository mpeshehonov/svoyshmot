import { cookies } from "next/headers";
import {
  CITY_COOKIE_NAME,
  DEFAULT_CITY,
  resolveCity,
} from "@svoyshmot/shared";
import { createClient } from "@/lib/supabase/server";

export { CITY_COOKIE_NAME };

export async function getCityFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CITY_COOKIE_NAME)?.value;
  if (!raw) return null;
  return resolveCity(decodeURIComponent(raw));
}

export async function getUserCity(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("city")
      .eq("id", user.id)
      .single();

    if (profile?.city) {
      const resolved = resolveCity(profile.city);
      if (resolved) return resolved;
    }
  }

  const fromCookie = await getCityFromCookie();
  if (fromCookie) return fromCookie;

  return DEFAULT_CITY;
}
