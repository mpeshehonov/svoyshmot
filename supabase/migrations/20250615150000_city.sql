-- Город клиента и привязка заказов к локации

alter table public.profiles
  add column if not exists city text;

alter table public.orders
  add column if not exists city text;

create index if not exists profiles_city_idx on public.profiles (city);
create index if not exists orders_city_idx on public.orders (city);
create index if not exists orders_city_status_idx on public.orders (city, status);

comment on column public.profiles.city is 'Город пользователя для подбора ателье';
comment on column public.orders.city is 'Город пошива (должен совпадать с городом ателье)';
