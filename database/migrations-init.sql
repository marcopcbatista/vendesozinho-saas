-- extension for gen_random_uuid (pgcrypto or pgcrypto equivalent)
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  avatar_url text,
  role text default 'viewer',
  permissions jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text,
  company text,
  plan text default 'professional',
  source text default 'website',
  notes text,
  utm jsonb,
  ip_address text,
  user_agent text,
  referer text,
  user_id uuid references users(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_leads_created_at on leads(created_at);
