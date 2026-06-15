import { NextResponse, type NextRequest } from "next/server";
import {
  CITY_COOKIE_NAME,
  DEFAULT_CITY,
  resolveCityFromGeoHeader,
} from "@svoyshmot/shared";
import { updateSession } from "@/lib/supabase/middleware";

const protectedPaths = [
  "/dashboard",
  "/create",
  "/orders",
  "/seller/dashboard",
  "/seller/orders",
  "/seller/register",
];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!request.cookies.get(CITY_COOKIE_NAME)?.value) {
    const geoCity = resolveCityFromGeoHeader(
      request.headers.get("x-vercel-ip-city"),
    );
    const city = geoCity ?? DEFAULT_CITY;
    response.cookies.set(CITY_COOKIE_NAME, encodeURIComponent(city), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
