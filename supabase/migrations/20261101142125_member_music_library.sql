begin;

create table if not exists public.member_profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  username text not null check (username ~ '^[A-Za-z0-9_]{3,24}$'),
  date_of_birth date not null,
  favorite_genres text[] not null default '{}'::text[] check (cardinality(favorite_genres) > 0),
  favorite_languages text[] not null default '{}'::text[] check (cardinality(favorite_languages) > 0),
  favorite_artists text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);
create unique index if not exists member_profiles_username_lower_unique
  on public.member_profiles (lower(username));
alter table public.member_profiles enable row level security;
revoke all on public.member_profiles from public, anon, authenticated;
grant select, insert, update on public.member_profiles to authenticated;
drop policy if exists "Members can read own profile" on public.member_profiles;
drop policy if exists "Members can create own profile" on public.member_profiles;
drop policy if exists "Members can update own profile" on public.member_profiles;
create policy "Members can read own profile" on public.member_profiles
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Members can create own profile" on public.member_profiles
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Members can update own profile" on public.member_profiles
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  collection text,
  sort_order integer not null default 0,
  is_released boolean not null default false,
  release_at timestamptz,
  storage_path text unique,
  created_at timestamptz not null default now()
);
alter table public.music_tracks enable row level security;
revoke all on public.music_tracks from public, anon, authenticated;
grant select on public.music_tracks to authenticated;
drop policy if exists "Signed-in members can view the music catalog" on public.music_tracks;
create policy "Signed-in members can view the music catalog" on public.music_tracks
  for select to authenticated using (
    exists (
      select 1
      from public.member_profiles as member
      where member.user_id = (select auth.uid())
    )
  );

insert into public.music_tracks (slug, title, collection, sort_order, is_released, release_at, storage_path)
values
  ('safar', 'Safar', 'Singles', 1, true, null, null),
  ('puff-puff-pass', 'Puff Puff Pass', 'Singles', 2, true, null, null),
  ('woh-tu-hi-hai', 'Woh Tu Hi Hai', 'Singles', 3, true, null, null),
  ('bhula-do-mujhe', 'Bhula Do Mujhe', 'Dhaage', 4, true, null, null),
  ('keh-do', 'Keh Do', 'Dhaage', 5, true, null, null),
  ('mera-ghar', 'Mera Ghar', 'Dhaage', 6, false, null, null),
  ('pal-roshni-ka', 'Pal Roshni Ka', 'Dhaage', 7, false, null, null),
  ('mera-kasoor', 'Mera Kasoor', 'Dhaage', 8, false, null, null),
  ('woh-hai-kahan', 'Woh Hai Kahan', 'Dhaage', 9, false, null, null)
on conflict (slug) do nothing;

create table if not exists public.music_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  track_id uuid not null references public.music_tracks (id) on delete cascade,
  comment text not null check (char_length(btrim(comment)) between 1 and 2000),
  created_at timestamptz not null default now()
);
alter table public.music_comments enable row level security;
revoke all on public.music_comments from public, anon, authenticated;
grant insert on public.music_comments to authenticated;
drop policy if exists "Members can privately comment on available music" on public.music_comments;
create policy "Members can privately comment on available music" on public.music_comments
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.music_tracks as track
      where track.id = track_id
        and (
          track.is_released
          or (track.release_at is not null and now() >= track.release_at - interval '48 hours')
        )
    )
  );

insert into storage.buckets (id, name, public)
values ('music-library', 'music-library', false)
on conflict (id) do update set public = false;
drop policy if exists "Signed-in members can stream available music" on storage.objects;
create policy "Signed-in members can stream available music" on storage.objects
  for select to authenticated using (
    bucket_id = 'music-library'
    and exists (
      select 1
      from public.music_tracks as track
      where track.storage_path = name
        and (
          track.is_released
          or (track.release_at is not null and now() >= track.release_at - interval '48 hours')
        )
    )
  );

commit;
