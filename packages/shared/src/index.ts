export type UserRole = "client" | "atelier" | "admin";

export type OrderStatus =
  | "draft"
  | "published"
  | "accepted"
  | "in_progress"
  | "ready"
  | "delivered"
  | "cancelled";

export const APP_NAME = "СвойШмот";
export const APP_TAGLINE = "Придумай. Закажи. Носи свой шмот.";

export {
  CITY_COOKIE_NAME,
  DEFAULT_CITY,
  PREDEFINED_CITIES,
  resolveCity,
  resolveCityFromGeoHeader,
} from "./cities";
