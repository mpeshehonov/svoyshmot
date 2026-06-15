-- СвойШмот MVP schema

create type public.user_role as enum ('client', 'atelier', 'admin');
create type public.order_status as enum (
  'draft',
  'published',
  'accepted',
  'in_progress',
  'ready',
  'delivered',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ateliers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  city text,
  rating numeric(3, 2) not null default 0 check (rating >= 0 and rating <= 5),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  prompt text not null,
  image_url text,
  description text,
  is_public boolean not null default false,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  design_id uuid not null references public.designs (id) on delete restrict,
  atelier_id uuid references public.ateliers (id) on delete set null,
  status public.order_status not null default 'draft',
  price integer,
  deadline date,
  size text,
  gender text,
  height_cm integer,
  weight_kg integer,
  color text,
  material text,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index ateliers_owner_id_idx on public.ateliers (owner_id);
create index ateliers_city_idx on public.ateliers (city);
create index designs_user_id_idx on public.designs (user_id);
create index designs_is_public_idx on public.designs (is_public) where is_public = true;
create index orders_user_id_idx on public.orders (user_id);
create index orders_atelier_id_idx on public.orders (atelier_id);
create index orders_status_idx on public.orders (status);
create index messages_order_id_idx on public.messages (order_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger ateliers_updated_at
  before update on public.ateliers
  for each row execute function public.handle_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ateliers enable row level security;
alter table public.designs enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Ateliers are viewable by everyone"
  on public.ateliers for select
  using (true);

create policy "Owners can manage their atelier"
  on public.ateliers for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Public designs are viewable by everyone"
  on public.designs for select
  using (is_public = true or auth.uid() = user_id);

create policy "Users can manage own designs"
  on public.designs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can view own orders"
  on public.orders for select
  using (
    auth.uid() = user_id
    or auth.uid() in (select owner_id from public.ateliers where id = atelier_id)
  );

create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users and ateliers can update relevant orders"
  on public.orders for update
  using (
    auth.uid() = user_id
    or auth.uid() in (select owner_id from public.ateliers where id = atelier_id)
  );

create policy "Order participants can read messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or auth.uid() in (select owner_id from public.ateliers where id = o.atelier_id)
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
