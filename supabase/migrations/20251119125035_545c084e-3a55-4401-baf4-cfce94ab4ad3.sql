-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  country text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- AI Partner customization
create type public.partner_gender as enum ('female', 'male', 'non_binary');
create type public.partner_personality as enum ('romantic_soft', 'flirty_playful', 'supportive_caring', 'bold_passionate', 'chaos_fun');

create table public.ai_partners (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  name text not null,
  gender partner_gender not null,
  personality partner_personality not null,
  created_at timestamptz default now()
);

-- Conversations
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  partner_id uuid references public.ai_partners(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages
create type public.message_role as enum ('user', 'assistant');
create type public.emotional_mode as enum ('romantic', 'flirty', 'soft', 'deep_emotional', 'playful');

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role message_role not null,
  content text not null,
  emotional_mode emotional_mode,
  created_at timestamptz default now()
);

-- Subscription tiers
create table public.subscription_tiers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  duration_days integer not null,
  price_usd numeric(10,2) not null,
  stripe_price_id text,
  features jsonb default '{}',
  created_at timestamptz default now()
);

-- User subscriptions
create table public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier_id uuid references public.subscription_tiers(id) not null,
  status text not null default 'active',
  started_at timestamptz default now(),
  expires_at timestamptz not null,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Message credits for free trial
create table public.message_credits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  free_messages_remaining integer default 3,
  total_messages_sent integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.ai_partners enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.subscription_tiers enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.message_credits enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for ai_partners
create policy "Users can view own partner"
  on public.ai_partners for select
  using (auth.uid() = user_id);

create policy "Users can create own partner"
  on public.ai_partners for insert
  with check (auth.uid() = user_id);

create policy "Users can update own partner"
  on public.ai_partners for update
  using (auth.uid() = user_id);

-- RLS Policies for conversations
create policy "Users can view own conversations"
  on public.conversations for select
  using (auth.uid() = user_id);

create policy "Users can create own conversations"
  on public.conversations for insert
  with check (auth.uid() = user_id);

-- RLS Policies for messages
create policy "Users can view own messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

create policy "Users can create messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for subscription_tiers (public read)
create policy "Anyone can view subscription tiers"
  on public.subscription_tiers for select
  to authenticated, anon
  using (true);

-- RLS Policies for user_subscriptions
create policy "Users can view own subscriptions"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can create own subscriptions"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

-- RLS Policies for message_credits
create policy "Users can view own credits"
  on public.message_credits for select
  using (auth.uid() = user_id);

create policy "Users can update own credits"
  on public.message_credits for update
  using (auth.uid() = user_id);

create policy "Users can create own credits"
  on public.message_credits for insert
  with check (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  
  insert into public.message_credits (user_id, free_messages_remaining)
  values (new.id, 3);
  
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Insert default subscription tiers
insert into public.subscription_tiers (name, duration_days, price_usd, features)
values 
  ('Weekly Plan', 7, 9.99, '{"unlimited_messages": true, "unlimited_voice": true, "all_modes": true, "priority_support": false}'),
  ('Monthly Plan', 30, 29.99, '{"unlimited_messages": true, "unlimited_voice": true, "all_modes": true, "priority_support": true, "exclusive_features": true}');

-- Function to check if user has active subscription
create or replace function public.has_active_subscription(user_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_subscriptions
    where user_id = user_uuid
    and status = 'active'
    and expires_at > now()
  );
$$;

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;