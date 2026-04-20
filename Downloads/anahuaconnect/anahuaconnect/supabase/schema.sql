-- ─────────────────────────────────────────────────────────────
-- AnáhuaConnect — Supabase Schema
-- Ejecuta este SQL en: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique not null,
  full_name       text not null,
  career          text not null,
  semester        int not null default 1,
  avatar_url      text,
  bio             text,
  skills          text[] default '{}',
  rating          numeric(3,2) default 0,
  review_count    int default 0,
  delivery_count  int default 0,
  is_available    boolean default true,
  created_at      timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- ─── SERVICES ────────────────────────────────────────────────
create type service_category as enum (
  'code', 'design', 'tutoring', 'languages', 'excel', 'video', 'writing', 'other'
);

create table services (
  id             uuid primary key default uuid_generate_v4(),
  provider_id    uuid references profiles(id) on delete cascade not null,
  title          text not null,
  description    text not null,
  category       service_category not null,
  price          numeric(10,2) not null check (price > 0),
  delivery_days  int not null default 3,
  tags           text[] default '{}',
  is_active      boolean default true,
  created_at     timestamptz default now()
);

alter table services enable row level security;

create policy "Services are viewable by everyone"
  on services for select using (is_active = true);

create policy "Providers can insert own services"
  on services for insert with check (auth.uid() = provider_id);

create policy "Providers can update own services"
  on services for update using (auth.uid() = provider_id);

create policy "Providers can delete own services"
  on services for delete using (auth.uid() = provider_id);

-- ─── ORDERS ──────────────────────────────────────────────────
create type order_status as enum (
  'pending', 'in_progress', 'delivered', 'completed', 'cancelled'
);

create table orders (
  id           uuid primary key default uuid_generate_v4(),
  service_id   uuid references services(id) on delete set null,
  client_id    uuid references profiles(id) on delete cascade not null,
  provider_id  uuid references profiles(id) on delete cascade not null,
  status       order_status default 'pending',
  price        numeric(10,2) not null,
  note         text,
  progress     int default 0 check (progress between 0 and 100),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = client_id or auth.uid() = provider_id);

create policy "Clients can create orders"
  on orders for insert with check (auth.uid() = client_id);

create policy "Parties can update orders"
  on orders for update
  using (auth.uid() = client_id or auth.uid() = provider_id);

-- ─── REVIEWS ─────────────────────────────────────────────────
create table reviews (
  id           uuid primary key default uuid_generate_v4(),
  order_id     uuid references orders(id) on delete cascade not null unique,
  service_id   uuid references services(id) on delete cascade not null,
  reviewer_id  uuid references profiles(id) on delete cascade not null,
  provider_id  uuid references profiles(id) on delete cascade not null,
  rating       int not null check (rating between 1 and 5),
  comment      text,
  created_at   timestamptz default now()
);

alter table reviews enable row level security;

create policy "Reviews are public"
  on reviews for select using (true);

create policy "Clients can write reviews"
  on reviews for insert with check (auth.uid() = reviewer_id);

-- Auto-update provider rating after new review
create or replace function update_provider_rating()
returns trigger as $$
begin
  update profiles set
    rating = (select avg(rating) from reviews where provider_id = new.provider_id),
    review_count = (select count(*) from reviews where provider_id = new.provider_id)
  where id = new.provider_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger after_review_insert
  after insert on reviews
  for each row execute function update_provider_rating();

-- ─── CONVERSATIONS ───────────────────────────────────────────
create table conversations (
  id              uuid primary key default uuid_generate_v4(),
  service_id      uuid references services(id) on delete set null,
  client_id       uuid references profiles(id) on delete cascade not null,
  provider_id     uuid references profiles(id) on delete cascade not null,
  last_message    text,
  last_message_at timestamptz,
  created_at      timestamptz default now(),
  unique (client_id, provider_id, service_id)
);

alter table conversations enable row level security;

create policy "Participants can view conversations"
  on conversations for select
  using (auth.uid() = client_id or auth.uid() = provider_id);

create policy "Clients can create conversations"
  on conversations for insert with check (auth.uid() = client_id);

create policy "Participants can update conversations"
  on conversations for update
  using (auth.uid() = client_id or auth.uid() = provider_id);

-- ─── MESSAGES ────────────────────────────────────────────────
create table messages (
  id               uuid primary key default uuid_generate_v4(),
  conversation_id  uuid references conversations(id) on delete cascade not null,
  sender_id        uuid references profiles(id) on delete cascade not null,
  content          text not null,
  created_at       timestamptz default now()
);

alter table messages enable row level security;

create policy "Participants can view messages"
  on messages for select
  using (
    auth.uid() in (
      select client_id from conversations where id = conversation_id
      union
      select provider_id from conversations where id = conversation_id
    )
  );

create policy "Participants can send messages"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    auth.uid() in (
      select client_id from conversations where id = conversation_id
      union
      select provider_id from conversations where id = conversation_id
    )
  );

-- ─── Enable Realtime for messages ────────────────────────────
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
