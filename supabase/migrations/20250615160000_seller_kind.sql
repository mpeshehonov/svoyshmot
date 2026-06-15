-- Тип продавца: ателье, мастерская, бренд и т.д.

create type public.seller_kind as enum ('atelier', 'workshop', 'brand', 'other');

alter table public.ateliers
  add column if not exists seller_kind public.seller_kind not null default 'atelier';

comment on column public.ateliers.seller_kind is 'Тип продавца в UI: ателье, мастерская, бренд';
