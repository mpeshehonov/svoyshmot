const PRODUCTION_SITE_URL = "https://svoyshmot.vercel.app";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) {
    return `https://${vercelProduction.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_SITE_URL
    : "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/dashboard") {
  const base = getSiteUrl();
  const path = `/auth/callback?next=${encodeURIComponent(next)}`;
  return `${base}${path}`;
}
