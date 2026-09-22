-- ============================================================
-- Habit Tracker schema
-- Run this in Supabase → SQL Editor (once, on a fresh project)
-- ============================================================

-- ---------- TABLES ----------

create table if not exists habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists daily_logs (
  id          uuid primary key default gen_random_uuid(),
  habit_id    uuid not null references habits (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  log_date    date not null default current_date,
  completed   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (habit_id, log_date) -- one log per habit per day
);

-- Helpful indexes for the queries the app actually runs
create index if not exists idx_habits_user_id on habits (user_id);
create index if not exists idx_daily_logs_habit_id on daily_logs (habit_id);
create index if not exists idx_daily_logs_user_id on daily_logs (user_id);

-- ---------- ROW LEVEL SECURITY ----------
-- With RLS OFF, the anon key in the browser could read/write every
-- user's rows. Turning it ON, plus these policies, makes the database
-- itself refuse any row that doesn't belong to auth.uid().

alter table habits enable row level security;
alter table daily_logs enable row level security;

-- habits: owner-only, one policy per operation
create policy "habits_select_own"
  on habits for select
  using (auth.uid() = user_id);

create policy "habits_insert_own"
  on habits for insert
  with check (auth.uid() = user_id);

create policy "habits_update_own"
  on habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own"
  on habits for delete
  using (auth.uid() = user_id);

-- daily_logs: owner-only, same pattern
create policy "daily_logs_select_own"
  on daily_logs for select
  using (auth.uid() = user_id);

create policy "daily_logs_insert_own"
  on daily_logs for insert
  with check (auth.uid() = user_id);

create policy "daily_logs_update_own"
  on daily_logs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "daily_logs_delete_own"
  on daily_logs for delete
  using (auth.uid() = user_id);

-- ---------- SEED DATA ----------
-- Replace 'YOUR-USER-UUID' with a real auth.users.id after you sign up
-- once through the app (Supabase → Authentication → Users → copy the id).
-- Seeding is optional; RLS will hide these from anyone but that user.

-- insert into habits (user_id, name, description) values
--   ('YOUR-USER-UUID', 'Drink water', '8 glasses a day'),
--   ('YOUR-USER-UUID', 'Read', '20 minutes before bed'),
--   ('YOUR-USER-UUID', 'Exercise', '30 minutes, any kind');
