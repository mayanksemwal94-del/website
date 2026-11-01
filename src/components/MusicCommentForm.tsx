"use client";

import { type FormEvent, useId, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-client";

type MusicCommentFormProps = { trackId: string; trackTitle: string };

export default function MusicCommentForm({ trackId, trackTitle }: MusicCommentFormProps) {
  const fieldId = useId();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = comment.trim();
    if (!text || busy) return;
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage("Comments are not connected yet. Please try again later.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.from("music_comments").insert({ track_id: trackId, comment: text });
      if (error) {
        setMessage("Couldn’t send your comment right now. Please try again.");
        return;
      }
      setComment("");
      setMessage("Comment sent privately to Mayank.");
    } catch {
      setMessage("Couldn’t send your comment right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="music-comment-form" onSubmit={submit}>
      <label htmlFor={fieldId}>Your comment on {trackTitle}</label>
      <textarea
        id={fieldId}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={2000}
        placeholder="Leave a private note about this song…"
        required
      />
      <div className="music-comment-footer">
        <p>Private · Only Mayank can read this</p>
        <button type="submit" disabled={busy || !comment.trim()}>{busy ? "Sending…" : "Send comment privately"}</button>
      </div>
      {message && <p className="music-comment-status" role="status">{message}</p>}
    </form>
  );
}
