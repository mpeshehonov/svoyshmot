/**
 * Единая терминология для стороны продавца.
 * В коде и БД по-прежнему `role: atelier` и таблица `ateliers`, маршруты `/seller/*`.
 * Продавец = ателье, мастерская, бренд или другое производство одежды.
 */

export const SELLER_KINDS = [
  { value: "atelier", label: "Ателье" },
  { value: "workshop", label: "Мастерская" },
  { value: "brand", label: "Бренд" },
  { value: "other", label: "Другое производство" },
] as const;

export type SellerKind = (typeof SELLER_KINDS)[number]["value"];

export function getSellerKindLabel(kind: SellerKind | string | null | undefined) {
  return SELLER_KINDS.find((k) => k.value === kind)?.label ?? "Продавец";
}

export const SELLER_COPY = {
  /** Именительный, ед. */
  one: "Продавец",
  /** Именительный, мн. */
  many: "Продавцы",
  /** Родительный: выбор продавца */
  ofOne: "продавца",
  /** Дательный: для продавцов */
  toMany: "продавцам",
  /** Предложный: в кабинете продавца */
  inCabinet: "продавца",

  nav: "Для продавцов",
  become: "Стать продавцом",
  connect: "Подключиться",
  connectAction: "Подключиться как продавец",
  cabinet: "Кабинет продавца",
  profile: "Профиль продавца",

  /** Пояснение типов в одну строку */
  typesHint:
    "Ателье, мастерская, бренд — любой, кто сам шьёт или производит одежду под заказ",
  typesShort: "ателье, мастерская или бренд",

  landingTitle: "Продавцам на СвойШмот",
  landingLead:
    "Получайте заказы с готовым описанием и визуалом. Отправляйте цену и срок — клиент выберет лучшее предложение. Общайтесь в чате без звонков.",

  nameLabel: "Название",
  namePlaceholder: "Ателье «Нить», мастерская Loom, бренд NOVA…",
  kindLabel: "Тип",

  orderPublishHint: (city: string) =>
    `Заказ увидят ${SELLER_COPY.toMany} в городе ${city}.`,
  publishButton: "Опубликовать для продавцов",
  bidsTitle: "Предложения продавцов",
  bidsEmpty: "Пока нет предложений. Продавцы увидят заказ в своём кабинете.",
  selectBid: "Выбрать этого продавца",
  orderLabel: "Продавец",
  /** Творительный: чат с … */
  withOne: "продавцом",

  statusPublished: "Ищем продавца",
  statusAccepted: "Продавец выбран",
} as const;
