"use client";

import { type FormEvent, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-client";

const GENRES = ["Indie pop", "Bollywood", "Hip-hop / Rap", "R&B / Soul", "Rock / Alternative", "Electronic", "Folk", "Classical", "Other"];
const LANGUAGES = ["Hindi", "English", "Punjabi", "Urdu", "Bengali", "Tamil", "Telugu", "Marathi", "Malayalam", "Kannada", "Other"];

type MemberProfileFormProps = { onComplete: () => void };

export default function MemberProfileForm({ onComplete }: MemberProfileFormProps) {
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [favoriteLanguages, setFavoriteLanguages] = useState<string[]>([]);
  const [favoriteArtists, setFavoriteArtists] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function toggleValue(values: string[], value: string, setter: (next: string[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername || !dateOfBirth || !favoriteGenres.length || !favoriteLanguages.length || busy) return;
    if (new Date(`${dateOfBirth}T00:00:00`).getTime() > Date.now()) {
      setMessage("Enter a valid date of birth.");
      return;
    }

    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage("Music accounts are not connected yet. Please try again later.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.from("member_profiles").insert({
        username: normalizedUsername,
        date_of_birth: dateOfBirth,
        favorite_genres: favoriteGenres,
        favorite_languages: favoriteLanguages,
        favorite_artists: favoriteArtists.split(",").map((artist) => artist.trim()).filter(Boolean),
      });
      if (error) {
        setMessage(error.code === "23505" ? "That username is taken. Choose another." : "Couldn’t save your profile. Please try again.");
        return;
      }
      setMessage("Profile saved.");
      onComplete();
    } catch {
      setMessage("Couldn’t save your profile. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="member-profile-form" onSubmit={submit}>
      <div className="member-profile-intro">
        <span className="eyebrow">One-time setup</span>
        <h2>Set up your music profile.</h2>
        <p>Your username and preferences help identify your account. Your birth date stays private.</p>
      </div>
      <label htmlFor="member-username">Username</label>
      <input id="member-username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} maxLength={24} pattern="[A-Za-z0-9_]{3,24}" autoComplete="username" placeholder="3–24 letters, numbers, or underscores" required />
      <label htmlFor="member-birth-date">Date of birth</label>
      <input id="member-birth-date" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} autoComplete="bday" required />
      <fieldset>
        <legend>Favourite genres <span>Choose at least one</span></legend>
        <div className="member-choice-grid">{GENRES.map((genre) => (
          <label className="member-choice" key={genre}><input type="checkbox" checked={favoriteGenres.includes(genre)} onChange={() => toggleValue(favoriteGenres, genre, setFavoriteGenres)} />{genre}</label>
        ))}</div>
      </fieldset>
      <fieldset>
        <legend>Favourite languages <span>Choose at least one</span></legend>
        <div className="member-choice-grid">{LANGUAGES.map((language) => (
          <label className="member-choice" key={language}><input type="checkbox" checked={favoriteLanguages.includes(language)} onChange={() => toggleValue(favoriteLanguages, language, setFavoriteLanguages)} />{language}</label>
        ))}</div>
      </fieldset>
      <label htmlFor="member-favorite-artists">Favourite artists or bands <span>Optional</span></label>
      <input id="member-favorite-artists" value={favoriteArtists} onChange={(event) => setFavoriteArtists(event.target.value)} maxLength={500} placeholder="Separate names with commas" />
      <div className="member-profile-footer">
        <p>Every account receives a unique member ID. Sign in again with your email link.</p>
        <button type="submit" disabled={busy || !username.trim() || !dateOfBirth || !favoriteGenres.length || !favoriteLanguages.length}>{busy ? "Saving…" : "Create music profile"}</button>
      </div>
      {message && <p role="status" className="member-profile-status">{message}</p>}
    </form>
  );
}
