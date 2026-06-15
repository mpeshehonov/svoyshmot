/** Город по умолчанию для пилота */
export const DEFAULT_CITY = "Сочи";

export const CITY_COOKIE_NAME = "svoyshmot_city";

/** Популярные города в UI (можно выбрать любой другой вручную) */
export const PREDEFINED_CITIES = [
  "Сочи",
  "Адлер",
  "Сириус",
  "Краснодар",
  "Ростов-на-Дону",
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Екатеринбург",
  "Новосибирск",
  "Нижний Новгород",
  "Самара",
  "Воронеж",
  "Красноярск",
  "Пермь",
  "Волгоград",
  "Калининград",
  "Тюмень",
  "Уфа",
  "Иркутск",
  "Хабаровск",
  "Владивосток",
  "Махачкала",
  "Грозный",
  "Севастополь",
  "Симферополь",
  "Ялта",
  "Анапа",
  "Геленджик",
  "Новороссийск",
] as const;

/** Соответствие названий из geo/IP (часто латиница) → каноническое имя */
const GEO_ALIASES: Record<string, string> = {
  sochi: "Сочи",
  adler: "Адлер",
  sirius: "Сириус",
  krasnodar: "Краснодар",
  moscow: "Москва",
  "saint petersburg": "Санкт-Петербург",
  "st petersburg": "Санкт-Петербург",
  kazan: "Казань",
  yekaterinburg: "Екатеринбург",
  novosibirsk: "Новосибирск",
  rostov: "Ростов-на-Дону",
  "rostov-on-don": "Ростов-на-Дону",
  anapa: "Анапа",
  gelendzhik: "Геленджик",
  novorossiysk: "Новороссийск",
  yalta: "Ялта",
  sevastopol: "Севастополь",
  simferopol: "Симферополь",
};

function formatCityName(value: string): string {
  return value
    .split(/([\s-]+)/)
    .map((part) => {
      if (/^[\s-]+$/.test(part)) return part;
      if (!part) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

/** Нормализует ввод пользователя или geo; принимает города вне списка */
export function resolveCity(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim().replace(/\s+/g, " ");
  if (trimmed.length < 2 || trimmed.length > 64) return null;

  const lower = trimmed.toLowerCase();

  if (GEO_ALIASES[lower]) return GEO_ALIASES[lower];

  const predefined = PREDEFINED_CITIES.find((c) => c.toLowerCase() === lower);
  if (predefined) return predefined;

  for (const [alias, canonical] of Object.entries(GEO_ALIASES)) {
    if (lower.includes(alias) || alias.includes(lower)) return canonical;
  }

  if (!/^[\p{L}\s\-'.]+$/u.test(trimmed)) return null;

  return formatCityName(trimmed);
}

/** Сопоставление заголовка Vercel `x-vercel-ip-city` */
export function resolveCityFromGeoHeader(headerValue: string | null): string | null {
  if (!headerValue) return null;
  try {
    const decoded = decodeURIComponent(headerValue);
    return resolveCity(decoded);
  } catch {
    return resolveCity(headerValue);
  }
}
