-- ============================================================================
-- Vortex Racing — initial schema
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent-ish:
-- safe to re-run on an empty project.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────────────────
do $$ begin
  create type public.user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.article_category as enum
    ('news', 'race-report', 'feature', 'video', 'partner', 'team');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.driver_role as enum ('race', 'reserve', 'academy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.race_status as enum ('upcoming', 'live', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.partner_tier as enum ('title', 'principal', 'official', 'supplier');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscriber_status as enum ('subscribed', 'unsubscribed');
exception when duplicate_object then null; end $$;

-- ─── Helpers ────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ─── Profiles & roles ───────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.user_role not null default 'viewer',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Role helpers used by RLS policies. SECURITY DEFINER + stable so they can be
-- evaluated inside policies without recursion issues.
create or replace function public.current_role_name()
returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() = 'admin', false)
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role_name() in ('admin', 'editor'), false)
$$;

-- ─── Content tables ─────────────────────────────────────────────────────────
create table if not exists public.articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  excerpt          text not null default '',
  body             text not null default '',
  category         public.article_category not null default 'news',
  cover_image_url  text,
  video_url        text,
  author_name      text not null default 'Vortex Racing',
  tags             text[] not null default '{}',
  is_featured      boolean not null default false,
  status           public.content_status not null default 'draft',
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists articles_published_idx on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category);

create table if not exists public.drivers (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  first_name        text not null,
  last_name         text not null,
  number            int,
  nationality       text not null default '',
  country_code      text not null default '',
  role              public.driver_role not null default 'race',
  tagline           text not null default '',
  bio               text not null default '',
  date_of_birth     date,
  place_of_birth    text,
  image_url         text,
  hero_image_url    text,
  helmet_image_url  text,
  instagram_url     text,
  x_url             text,
  career_starts     int not null default 0,
  career_wins       int not null default 0,
  career_podiums    int not null default 0,
  career_poles      int not null default 0,
  career_points     numeric(8,1) not null default 0,
  championships     int not null default 0,
  is_active         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role_title  text not null,
  bio         text not null default '',
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.races (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  season             int not null,
  round              int not null,
  name               text not null,
  official_name      text,
  country            text not null,
  country_code       text not null default '',
  city               text,
  circuit_name       text not null,
  circuit_image_url  text,
  hero_image_url     text,
  circuit_length_km  numeric(6,3),
  laps               int,
  lap_record         text,
  timezone           text not null default 'UTC',
  sessions           jsonb not null default '[]'::jsonb, -- [{ name, starts_at }]
  race_start         timestamptz not null,
  status             public.race_status not null default 'upcoming',
  summary            text not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (season, round)
);
create index if not exists races_season_idx on public.races (season, race_start);

create table if not exists public.race_results (
  id           uuid primary key default gen_random_uuid(),
  race_id      uuid not null references public.races(id) on delete cascade,
  driver_id    uuid references public.drivers(id) on delete set null,
  driver_name  text not null,
  team_name    text not null,
  position     int,
  grid         int,
  points       numeric(5,1) not null default 0,
  status       text not null default 'Finished',
  fastest_lap  boolean not null default false,
  time_text    text,
  created_at   timestamptz not null default now()
);
create index if not exists race_results_race_idx on public.race_results (race_id, position);

create table if not exists public.driver_standings (
  id           uuid primary key default gen_random_uuid(),
  season       int not null,
  position     int not null,
  driver_name  text not null,
  team_name    text not null,
  country_code text not null default '',
  points       numeric(6,1) not null default 0,
  wins         int not null default 0,
  podiums      int not null default 0,
  driver_id    uuid references public.drivers(id) on delete set null,
  is_team      boolean not null default false,
  updated_at   timestamptz not null default now(),
  unique (season, position)
);

create table if not exists public.constructor_standings (
  id         uuid primary key default gen_random_uuid(),
  season     int not null,
  position   int not null,
  team_name  text not null,
  points     numeric(6,1) not null default 0,
  wins       int not null default 0,
  is_team    boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (season, position)
);

create table if not exists public.cars (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  season          int not null,
  chassis         text,
  power_unit      text,
  tagline         text not null default '',
  description     text not null default '',
  image_url       text,
  hero_image_url  text,
  specs           jsonb not null default '[]'::jsonb, -- [{ group, label, value }]
  achievements    jsonb not null default '[]'::jsonb, -- [{ label, value }]
  is_current      boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.partners (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  tier         public.partner_tier not null default 'official',
  logo_url     text,
  website_url  text,
  description  text not null default '',
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  status        public.subscriber_status not null default 'subscribed',
  source        text not null default 'website',
  created_at    timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'media',
  path        text not null unique,
  url         text not null,
  alt         text not null default '',
  mime_type   text,
  size_bytes  bigint,
  width       int,
  height      int,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ─── updated_at triggers ───────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['profiles','articles','drivers','team_members','races',
                           'driver_standings','constructor_standings','cars','partners','site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute procedure public.set_updated_at()', t);
  end loop;
end $$;

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.profiles               enable row level security;
alter table public.articles               enable row level security;
alter table public.drivers                enable row level security;
alter table public.team_members           enable row level security;
alter table public.races                  enable row level security;
alter table public.race_results           enable row level security;
alter table public.driver_standings       enable row level security;
alter table public.constructor_standings  enable row level security;
alter table public.cars                   enable row level security;
alter table public.partners               enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.media                  enable row level security;
alter table public.site_settings          enable row level security;

-- profiles: users read their own row, admins read/update all roles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- Public read of published / active content
drop policy if exists "articles public read" on public.articles;
create policy "articles public read" on public.articles for select
  using (status = 'published' or public.is_staff());

drop policy if exists "drivers public read" on public.drivers;
create policy "drivers public read" on public.drivers for select using (true);
drop policy if exists "team_members public read" on public.team_members;
create policy "team_members public read" on public.team_members for select using (true);
drop policy if exists "races public read" on public.races;
create policy "races public read" on public.races for select using (true);
drop policy if exists "race_results public read" on public.race_results;
create policy "race_results public read" on public.race_results for select using (true);
drop policy if exists "driver_standings public read" on public.driver_standings;
create policy "driver_standings public read" on public.driver_standings for select using (true);
drop policy if exists "constructor_standings public read" on public.constructor_standings;
create policy "constructor_standings public read" on public.constructor_standings for select using (true);
drop policy if exists "cars public read" on public.cars;
create policy "cars public read" on public.cars for select using (true);
drop policy if exists "partners public read" on public.partners;
create policy "partners public read" on public.partners for select using (true);
drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media for select using (true);
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings for select using (true);

-- Staff (admin + editor) full write access to content tables
do $$
declare t text;
begin
  foreach t in array array['articles','drivers','team_members','races','race_results',
                           'driver_standings','constructor_standings','cars','partners','media','site_settings']
  loop
    execute format('drop policy if exists "%s staff write" on public.%I', t, t);
    execute format('create policy "%s staff write" on public.%I for all
                    using (public.is_staff()) with check (public.is_staff())', t, t);
  end loop;
end $$;

-- Newsletter: no anonymous access at all. Inserts happen server-side with the
-- service role; staff can read/update/delete.
drop policy if exists "subscribers staff read" on public.newsletter_subscribers;
create policy "subscribers staff read" on public.newsletter_subscribers for select using (public.is_staff());
drop policy if exists "subscribers staff write" on public.newsletter_subscribers;
create policy "subscribers staff write" on public.newsletter_subscribers for all
  using (public.is_staff()) with check (public.is_staff());

-- ─── Storage ────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','video/mp4'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media bucket public read" on storage.objects;
create policy "media bucket public read" on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media bucket staff insert" on storage.objects;
create policy "media bucket staff insert" on storage.objects for insert
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists "media bucket staff update" on storage.objects;
create policy "media bucket staff update" on storage.objects for update
  using (bucket_id = 'media' and public.is_staff());

drop policy if exists "media bucket staff delete" on storage.objects;
create policy "media bucket staff delete" on storage.objects for delete
  using (bucket_id = 'media' and public.is_staff());

-- ─── Grants (PostgREST roles) ───────────────────────────────────────────────
grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
alter default privileges in schema public grant select on tables to anon, authenticated;
alter default privileges in schema public grant insert, update, delete on tables to authenticated;
