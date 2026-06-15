"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  CITY_COOKIE_NAME,
  resolveCity,
} from "@svoyshmot/shared";
import { createClient } from "@/lib/supabase/server";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

async function setCityCookie(city: string) {
  const cookieStore = await cookies();
  cookieStore.set(CITY_COOKIE_NAME, encodeURIComponent(city), {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function setUserCity(
  cityInput: string,
): Promise<{ city?: string; error?: string }> {
  const city = resolveCity(cityInput);
  if (!city) {
    return { error: "Укажите корректное название города (от 2 символов)" };
  }

  await setCityCookie(city);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { error } = await supabase
      .from("profiles")
      .update({ city })
      .eq("id", user.id);

    if (error) {
      return { error: "Не удалось сохранить город в профиле" };
    }
  }

  revalidatePath("/", "layout");
  return { city };
}

export async function detectCityFromCoordinates(
  lat: number,
  lng: number,
): Promise<{ city?: string; error?: string }> {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { error: "Некорректные координаты" };
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("accept-language", "ru");
  url.searchParams.set("zoom", "10");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "SvoyShmot/1.0 (https://svoyshmot.vercel.app)" },
      next: { revalidate: 0 },
    });
  } catch {
    return { error: "Не удалось определить город. Выберите вручную." };
  }

  if (!response.ok) {
    return { error: "Сервис геолокации недоступен. Выберите город вручную." };
  }

  const data = (await response.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      state?: string;
    };
  };

  const raw =
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.municipality;

  const city = resolveCity(raw);
  if (!city) {
    return { error: "Не удалось распознать город. Выберите из списка." };
  }

  return setUserCity(city);
}
