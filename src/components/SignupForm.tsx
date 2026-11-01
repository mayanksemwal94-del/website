"use client";

import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-client";

function signInErrorMessage(code?: string) {
  if (code === "over_email_send_rate_limit") {
    return "Supabase has temporarily rate-limited sign-in emails. Wait for the email limit to reset before trying again.";
  }
  if (code === "email_address_not_authorized") {
    return "Supabase’s default email service only sends to authorized project-team addresses. Configure custom SMTP to send links to members.";
  }
  if (code === "over_request_rate_limit") {
    return "Too many sign-in requests. Wait a few minutes before trying again.";
  }
  return "Couldn’t send the sign-in link right now. Please try again.";
}

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage("Music accounts are not connected yet. Please try again later.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true },
      });
      setMessage(error ? signInErrorMessage(error.code) : "Check your inbox and open the magic link in this same browser to continue to Music.");
    } catch {
      setMessage("Couldn’t send the sign-in link right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="signup-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="signup-email">Email address</label>
      <input
        id="signup-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Your email address"
      />
      <button type="submit" disabled={busy}>{busy ? "Sending…" : "Continue to Music ↗"}</button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>
  );
}
