begin;

alter table public.music_tracks
  add column if not exists release_year smallint,
  add column if not exists is_member_visible boolean not null default true,
  add column if not exists composed_by text,
  add column if not exists lyrics_by text,
  add column if not exists recording_studio text,
  add column if not exists mix_and_master text;

update public.music_tracks
set collection = 'Dhaage EP',
    release_year = 2026,
    is_member_visible = true
where slug in ('bhula-do-mujhe', 'keh-do', 'mera-ghar');

-- Preserve the Safar row and any private comments, but remove it from the member list.
update public.music_tracks
set is_member_visible = false
where slug = 'safar';

-- Planned private object paths after verified upload:
-- Bhula Do Mujhe.wav -> dhaage/2026/bhula-do-mujhe.wav
-- Keh Do.wav -> dhaage/2026/keh-do.wav
-- Mera Ghar.wav -> dhaage/2026/mera-ghar.wav
-- Keep storage_path null until the WAV exists in the private bucket.

commit;
