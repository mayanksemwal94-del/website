"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-client";
import { isTrackAvailable } from "../lib/music-access";
import MemberProfileForm from "./MemberProfileForm";
import MusicCommentForm from "./MusicCommentForm";
import SignupForm from "./SignupForm";

type MemberProfile = { user_id: string; username: string };
type MusicTrack = {
  id: string;
  slug: string;
  title: string;
  collection: string | null;
  sort_order: number;
  is_released: boolean;
  release_at: string | null;
  storage_path: string | null;
};
type AuthState = "loading" | "signed_out" | "signed_in" | "unconfigured" | "error";
type LibraryState = "loading" | "profile_required" | "ready" | "error";

function availabilityText(track: MusicTrack, available: boolean) {
  if (!track.is_released && !track.release_at) return "Release date to be announced.";
  if (!available) return "Preview opens 48 hours before release.";
  if (!track.storage_path) return "Audio is being prepared.";
  return track.is_released ? "Released · high-quality audio" : "Early preview is open";
}

export default function MusicLibrary() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [libraryState, setLibraryState] = useState<LibraryState>("loading");
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [audioMessage, setAudioMessage] = useState("");
  const [libraryMessage, setLibraryMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [clockNow, setClockNow] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setClockNow(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const supabase = getBrowserSupabase();
    if (!supabase) {
      void Promise.resolve().then(() => { if (active) setAuthState("unconfigured"); });
      return () => { active = false; };
    }

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setAuthState(error ? "error" : data.session ? "signed_in" : "signed_out");
    }).catch(() => active && setAuthState("error"));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setLibraryState("loading");
        setProfile(null);
        setTracks([]);
        setAudioUrls({});
        setSelectedTrackId(null);
        setLibraryMessage("");
        setAudioMessage("");
      }
      setAuthState(session ? "signed_in" : "signed_out");
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase || authState !== "signed_in") return;
    const client = supabase;

    let active = true;

    async function loadLibrary() {
      try {
        const { data: member, error: profileError } = await client
          .from("member_profiles")
          .select("user_id, username")
          .maybeSingle();
        if (!active) return;
        if (profileError) throw profileError;
        if (!member) {
          setProfile(null);
          setLibraryState("profile_required");
          return;
        }
        setProfile(member as MemberProfile);

        const { data, error: tracksError } = await client
          .from("music_tracks")
          .select("id, slug, title, collection, sort_order, is_released, release_at, storage_path");
        if (!active) return;
        if (tracksError) throw tracksError;
        const orderedTracks = ((data ?? []) as MusicTrack[]).sort((a, b) =>
          (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)
          || a.title.localeCompare(b.title),
        );
        setTracks(orderedTracks);
        setLibraryState("ready");
      } catch {
        if (active) {
          setLibraryMessage("Your music library couldn’t load. Please refresh and try again.");
          setLibraryState("error");
        }
      }
    }

    void loadLibrary();
    return () => { active = false; };
  }, [authState, refreshKey]);

  useEffect(() => {
    if (clockNow === null) return;
    const nextOpen = tracks
      .filter((track) => !track.is_released && track.release_at)
      .map((track) => Date.parse(track.release_at as string) - 48 * 60 * 60 * 1000)
      .filter((time) => Number.isFinite(time) && time > clockNow)
      .sort((a, b) => a - b)[0];
    if (!nextOpen) return;
    const timer = window.setTimeout(() => setClockNow(Date.now()), Math.max(0, nextOpen - clockNow + 10));
    return () => window.clearTimeout(timer);
  }, [tracks, clockNow]);

  const selectedTrack = useMemo(
    () => tracks.find((track) => track.id === selectedTrackId) ?? null,
    [tracks, selectedTrackId],
  );

  async function listenToTrack(track: MusicTrack) {
    if (!track.storage_path || !isTrackAvailable(track, clockNow ?? 0) || loadingTrackId) return;
    const client = getBrowserSupabase();
    if (!client) {
      setAudioMessage("Music audio is not connected yet.");
      return;
    }
    setSelectedTrackId(track.id);
    setAudioMessage("");
    setAudioUrls({});
    setLoadingTrackId(track.id);
    try {
      const { data, error } = await client.storage.from("music-library").createSignedUrl(track.storage_path, 600);
      if (error || !data?.signedUrl) {
        setSelectedTrackId(null);
        setAudioMessage("This audio file is temporarily unavailable.");
        return;
      }
      setAudioUrls({ [track.id]: data.signedUrl });
    } catch {
      setSelectedTrackId(null);
      setAudioMessage("This audio file is temporarily unavailable.");
    } finally {
      setLoadingTrackId(null);
    }
  }

  async function signOut() {
    const client = getBrowserSupabase();
    if (!client) return;
    try {
      const { error } = await client.auth.signOut();
      if (error) setLibraryMessage("Couldn’t sign out right now. Please refresh and try again.");
    } catch {
      setLibraryMessage("Couldn’t sign out right now. Please refresh and try again.");
    }
  }

  return (
    <main className="music-library-page">
      <section className="music-library-intro page-wrap">
        <span className="eyebrow">Members-only listening</span>
        <h1>Music.</h1>
        <p>High-quality listening for released songs. Upcoming previews open 48 hours before release.</p>
      </section>

      {authState === "loading" && <p className="music-library-status page-wrap" role="status">Checking your account…</p>}
      {authState === "unconfigured" && <p className="music-library-status page-wrap" role="status">Music accounts are not connected yet.</p>}
      {authState === "error" && <p className="music-library-status page-wrap" role="alert">Couldn’t check your sign-in. Refresh the page and try again.</p>}
      {authState === "signed_out" && (
        <section className="music-signin-card page-wrap">
          <div><span className="eyebrow">Create an account or sign in</span><h2>Your music, whenever you’re here.</h2>
            <p>Use your email to create an account or return to your library. After verifying it, set up your username and music preferences once.</p></div>
          <SignupForm />
        </section>
      )}
      {authState === "signed_in" && libraryState === "loading" && <p className="music-library-status page-wrap" role="status">Loading your music…</p>}
      {authState === "signed_in" && libraryState === "profile_required" && (
        <section className="page-wrap"><MemberProfileForm onComplete={() => { setLibraryState("loading"); setRefreshKey((key) => key + 1); }} /></section>
      )}
      {authState === "signed_in" && libraryState === "error" && <p className="music-library-status page-wrap" role="alert">{libraryMessage}</p>}
      {authState === "signed_in" && libraryState === "ready" && profile && (
        <section className="music-member-library page-wrap">
          <div className="music-member-bar">
            <div><span className="eyebrow">Signed in as</span><strong>@{profile.username}</strong></div>
            <details><summary>Member ID</summary><code>{profile.user_id}</code></details>
            <button type="button" className="music-signout" onClick={() => void signOut()}>Sign out</button>
          </div>
          {libraryMessage && <p className="music-library-status" role="alert">{libraryMessage}</p>}
          <div className="music-library-grid">
            <div className="music-track-list" aria-label="Music library">
              <h2>Your songs</h2>
              {tracks.length === 0 && <p>No tracks are listed yet.</p>}
              {tracks.map((track) => {
                const available = isTrackAvailable(track, clockNow ?? 0);
                const signedUrl = audioUrls[track.id];
                const hasAudio = available && Boolean(track.storage_path);
                return (
                  <article className={`music-track-row${selectedTrackId === track.id ? " is-selected" : ""}`} key={track.id}>
                    <div className="music-track-copy">
                      <span className="eyebrow">{track.collection || (track.is_released ? "Released music" : "Upcoming")}</span>
                      <h3>{track.title}</h3>
                      <p>{availabilityText(track, available)}</p>
                    </div>
                    {hasAudio ? (
                      <button type="button" onClick={() => void listenToTrack(track)} disabled={loadingTrackId !== null} aria-label={`Listen to ${track.title}`}>
                        {loadingTrackId === track.id ? "Loading…" : signedUrl && selectedTrackId === track.id ? "Selected ✓" : "Listen ↗"}
                      </button>
                    ) : <span className="music-track-locked" aria-label={`${track.title} ${available ? "audio pending" : "unavailable"}`}>{available ? "Audio pending" : "Locked"}</span>}
                  </article>
                );
              })}
            </div>
            <div className="music-player-column">
              {selectedTrack && loadingTrackId === selectedTrack.id ? (
                <div className="music-player-empty" role="status"><span className="eyebrow">Loading secure audio</span><p>Preparing {selectedTrack.title}…</p></div>
              ) : selectedTrack && audioUrls[selectedTrack.id] ? (
                <section className="music-player-panel" aria-label={`${selectedTrack.title} player`}>
                  <span className="eyebrow">Now listening</span>
                  <h2>{selectedTrack.title}</h2>
                  <audio controls preload="none" src={audioUrls[selectedTrack.id]} aria-label={`${selectedTrack.title} full preview`} />
                  <MusicCommentForm trackId={selectedTrack.id} trackTitle={selectedTrack.title} />
                </section>
              ) : audioMessage ? (
                <p className="music-player-empty" role="alert">{audioMessage}</p>
              ) : (
                <div className="music-player-empty"><span className="eyebrow">Choose a song</span><p>Select any available track to listen. Upcoming songs unlock 48 hours before release.</p></div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
