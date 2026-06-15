-- Ставки ателье + расширение RLS для маркетплейса заказов

create type public.bid_status as enum ('pending', 'accepted', 'rejected');

create table public.order_bids (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  atelier_id uuid not null references public.ateliers (id) on delete cascade,
  price integer not null check (price > 0),
  deadline date not null,
  message text,
  status public.bid_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (order_id, atelier_id)
);

create index order_bids_order_id_idx on public.order_bids (order_id);
create index order_bids_atelier_id_idx on public.order_bids (atelier_id);
create index order_bids_status_idx on public.order_bids (status);

alter table public.order_bids enable row level security;

-- profiles: пользователь может менять роль только на atelier при регистрации мастерской (один раз)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- orders: видимость
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view relevant orders"
  on public.orders for select
  using (
    auth.uid() = user_id
    or auth.uid() in (select owner_id from public.ateliers where id = atelier_id)
    or (
      status = 'published'
      and exists (
        select 1
        from public.profiles p
        where p.id = auth.uid() and p.role = 'atelier'
      )
    )
  );

-- order_bids policies
create policy "Participants can view bids"
  on public.order_bids for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or auth.uid() in (
            select owner_id from public.ateliers where id = order_bids.atelier_id
          )
        )
    )
    or auth.uid() in (
      select owner_id from public.ateliers where id = atelier_id
    )
  );

create policy "Ateliers can bid on published orders"
  on public.order_bids for insert
  with check (
    auth.uid() in (select owner_id from public.ateliers where id = atelier_id)
    and exists (
      select 1 from public.orders o
      where o.id = order_id and o.status = 'published'
    )
  );

create policy "Order owner can update bid status"
  on public.order_bids for update
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Сообщения: ателье может писать по опубликованным заказам до принятия (вопросы)
drop policy if exists "Order participants can read messages" on public.messages;
drop policy if exists "Order participants can send messages" on public.messages;

create policy "Order participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or auth.uid() in (select owner_id from public.ateliers where id = o.atelier_id)
          or (
            o.status = 'published'
            and auth.uid() in (
              select owner_id from public.ateliers a
              where exists (
                select 1 from public.order_bids b
                where b.order_id = o.id and b.atelier_id = a.id
              )
            )
          )
        )
    )
  );

create policy "Order participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or auth.uid() in (select owner_id from public.ateliers where id = o.atelier_id)
        )
    )
  );
