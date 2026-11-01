-- Private reviewer applications, approved-only audio access, and private feedback.
-- Listener accounts can submit applications and read their own application status.
-- Only Mayank should manage applications/read feedback through the project dashboard.
begin;

create table if not exists public.reviewer_applications (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 100),
  reason text not null check (char_length(btrim(reason)) between 10 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'not_selected')),
  created_at timestamptz not null default now()
);

alter table public.reviewer_applications enable row level security;
revoke all on table public.reviewer_applications from public, anon, authenticated;
grant select, insert on table public.reviewer_applications to authenticated;

drop policy if exists "Listeners can read their own reviewer application" on public.reviewer_applications;
create policy "Listeners can read their own reviewer application"
  on public.reviewer_applications
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Listeners can apply for reviewer access" on public.reviewer_applications;
create policy "Listeners can apply for reviewer access"
  on public.reviewer_applications
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id and status = 'pending');

create table if not exists public.track_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  track_title text not null check (char_length(btrim(track_title)) between 1 and 120),
  feedback text not null check (char_length(btrim(feedback)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists track_feedback_track_created_at_idx
  on public.track_feedback (track_title, created_at desc);

alter table public.track_feedback enable row level security;
revoke all on table public.track_feedback from public, anon, authenticated;
grant insert on table public.track_feedback to authenticated;

drop policy if exists "Listeners can submit their own private feedback" on public.track_feedback;
drop policy if exists "Approved listeners can submit their own private feedback" on public.track_feedback;
create policy "Approved listeners can submit their own private feedback"
  on public.track_feedback
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.reviewer_applications as application
      where application.user_id = (select auth.uid())
        and application.status = 'approved'
    )
  );

insert into storage.buckets (id, name, public)
values ('audio-previews', 'audio-previews', false)
on conflict (id) do update set public = false;

drop policy if exists "Approved reviewers can read audio previews" on storage.objects;
create policy "Approved reviewers can read audio previews"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'audio-previews'
    and exists (
      select 1
      from public.reviewer_applications as application
      where application.user_id = (select auth.uid())
        and application.status = 'approved'
    )
  );

commit;
