-- ============================================================
-- Avatars & profiles — run in Supabase SQL Editor
-- ============================================================

-- ---------- PROFILES TABLE ----------
-- One row per user, holds the public avatar URL.

create table if not exists profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  avatar_url  text,
  updated_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Same grant fix as habits/daily_logs — without this, RLS never even
-- gets a chance to run and every query fails with "permission denied".
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on profiles to anon, authenticated;


-- ---------- STORAGE BUCKET ----------
-- Create the bucket itself in the dashboard (Storage → New bucket →
-- name "avatars" → Public bucket: ON), NOT here — bucket creation
-- isn't reliably scriptable from the SQL editor across Supabase
-- versions. Then run the policies below.

-- ---------- STORAGE POLICIES ----------
-- Files are expected at path: {user_id}/{filename}
-- storage.foldername(name) splits the object path into an array of
-- folder segments, so [1] is the first folder — the user's own id.
-- This is what locks each user to their own folder rather than
-- opening the whole bucket.

create policy "avatar_upload_own_folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar_update_own_folder"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatar_delete_own_folder"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reading is public because the bucket is public (avatars are meant
-- to be visible to everyone, e.g. in a shared UI) — but writes are
-- still locked to the owner's folder above.
create policy "avatar_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');