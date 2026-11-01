# Mayank Semwal — official site

A Next.js App Router site for Mayank Semwal and the project page for Flares Of Gold (FOG). The design is based on the approved local prototype and uses responsive custom CSS plus Tailwind CSS 4.

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:3000`.

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Routes

- `/` — Homepage with a carousel, member-only Music entry point, public `Dhaage` overview, videos, the AI-filmmaking perspective, Mayank merch, collaborators, and locked Events.
- `/music` — Sign-in, one-time member profile setup, and the authenticated music library. Released tracks are available to members; upcoming tracks unlock 48 hours before their configured release time. Private comments can be sent to Mayank.
- `/review` — Legacy URL that redirects to `/music`.
- `/flares-of-gold` — FOG project page with the Spotify album and all 12 linked tracks, selected band photos, six videos from the earlier YouTube channel, social/contact links, and a separate FOG merch collection.
- `/auth/callback` — Supabase PKCE/magic-link callback; verified members continue to `/music`.
- `/api/shopify/cart` — shared Shopify Storefront cart endpoint for both merchandise collections.

## Content and assets

Release lists and sample products are in `src/lib/content.ts`. Music audio paths and upcoming release timestamps live in Supabase’s `music_tracks` table; upload files to the private `music-library` bucket. The Mayank carousel and FOG page use optimized WebP copies under `public/images/`. All FOG page photography and album art now comes from `/Users/mayanksemwal/Desktop/Website Stuff/FOG Assets`; source originals remain untouched. Video thumbnails are from FOG's earlier YouTube channel.

FOG details are based on the band's Facebook page, Spotify album listing, the supplied FOG artwork, and the earlier YouTube channel. Spotify/Facebook and the supplied cover show February 2023, while Mayank previously stated February 2022; the cover is used as supplied, but the page avoids adding a separate textual release year until confirmed. The older channel is clearly labelled, with space to replace it when the new channel is ready.

## Connect services

Copy `.env.example` to `.env.local` and fill values locally. Never commit `.env.local` or send secrets in chat. Production values belong in the hosting provider’s encrypted environment settings.

### Supabase member music

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also accepted). Enable email sign-in/magic links and allow both local and deployed `/auth/callback` URLs. Supabase’s built-in email service is for testing: it allows only 2 emails/hour per project and restricts recipients to authorized organization-team addresses. Configure custom SMTP under Supabase Authentication settings before inviting members, then adjust Authentication > Rate Limits if needed. Apply `supabase/migrations/20261101142125_member_music_library.sql` in Supabase SQL Editor. The earlier `20261101122511_private_preview_feedback.sql` reviewer/application tables are legacy and are no longer used by the Music experience; leave existing objects in place.

Every account gets a stable Supabase UUID and a case-insensitively unique username. Members sign in with their email magic link; the username is their unique Music identity, not a password. After email verification, a one-time profile form requires date of birth, at least one genre, and at least one language; favourite artists/bands are optional. Row-level security limits profile access to that member and the project owner. Birth dates are never displayed publicly.

The migration seeds released songs and the known `Dhaage` tracklist without inventing release dates or audio paths. Set each upcoming track’s exact `release_at` timestamp when confirmed; the database and UI open its private preview at `release_at - 48 hours`. Upload audio files to the private `music-library` bucket, then set the matching `music_tracks.storage_path`. Signed audio URLs expire after 10 minutes. No audio files or future release timestamps are included yet.

Members can insert comments only for tracks they can currently stream. Listener clients receive no `SELECT` permission on `music_comments`, so comments are private to Mayank (as project owner) in Supabase. To read them in SQL Editor:

```sql
select c.created_at, u.email, p.username, t.title, c.comment
from public.music_comments as c
join auth.users as u on u.id = c.user_id
left join public.member_profiles as p on p.user_id = c.user_id
join public.music_tracks as t on t.id = c.track_id
order by c.created_at desc;
```

### Shopify merch

Set `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and `SHOPIFY_API_VERSION`. Create separate collections and set `SHOPIFY_MAYANK_COLLECTION_HANDLE` and `SHOPIFY_FOG_COLLECTION_HANDLE`. The pages use one Storefront cart, keeping the project listings distinct but checkout shared. Until products are created and approved in Shopify, the site shows sample designs with disabled purchase buttons; the sample mockups are not real inventory.

### Payments

Physical merch checkout is Shopify-hosted. Paid music access is not implemented or enabled in this version. Add Stripe only when Mayank is ready to define paid access, subscription/one-time purchase terms, refunds, and entitlements.

## No CMS

There is intentionally no content editor. Update the typed release/product data and add approved assets in the repository for each release. Shopify remains the product/stock management system once connected.

## Deployment

Deploy the Next.js project to Vercel after the domain is selected and service configuration is complete. Add the production environment variables, configure Supabase redirect URLs, Shopify collection handles and Shopify callback/origin settings, then verify preview signup and a test order before publishing purchase buttons.
