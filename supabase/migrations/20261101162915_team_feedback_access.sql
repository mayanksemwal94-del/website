-- Lets Mayank and the team read private pre-release feedback.
-- music_comments was insert-only, so feedback could only be read by hand in the
-- Supabase dashboard. Team membership is explicit: a row here, added by someone
-- with dashboard access, is what grants read access.
begin;

create table if not exists public.team_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
revoke all on public.team_members from public, anon, authenticated;
grant select on public.team_members to authenticated;

-- security definer so the check does not re-enter team_members' own RLS policy,
-- which would recurse infinitely when the roster policy queries this table.
create or replace function public.is_team_member()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.team_members where user_id = auth.uid()
  );
$$;
revoke all on function public.is_team_member() from public, anon;
grant execute on function public.is_team_member() to authenticated;

-- Team members can see who else is on the team; nobody else sees the roster.
-- No insert/update/delete policy on purpose: membership is granted out of band,
-- so a compromised member account cannot promote itself.
drop policy if exists "Team members can read the team roster" on public.team_members;
create policy "Team members can read the team roster" on public.team_members
  for select to authenticated using (public.is_team_member());

grant select on public.music_comments to authenticated;
drop policy if exists "Team members can read private feedback" on public.music_comments;
create policy "Team members can read private feedback" on public.music_comments
  for select to authenticated using (public.is_team_member());

commit;
