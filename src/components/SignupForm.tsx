"use client";

import { FormEvent, useState } from "react";
import { getBrowserSupabase } from "../lib/supabase-client";
import { AppleLogo, GoogleLogo } from "./ProviderLogos";

// ponytail: Google + Apple only. Supabase supports ~19 providers; add more by
// extending OAUTH_PROVIDERS. Apple needs a paid developer account, and App Store
// guideline 4.8 requires it once any other social login is offered.
const OAUTH_PROVIDERS = [
  { id: "google", label: "Continue with Google", Logo: GoogleLogo },
  { id: "apple", label: "Continue with Apple", Logo: AppleLogo },
] as const;

type Mode = "link" | "password";
type SignupFormProps = { defaultMode?: Mode };

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

function passwordErrorMessage(code?: string) {
  if (code === "invalid_credentials") return "That email and password don’t match. Try again, or use a sign-in link instead.";
  if (code === "user_already_exists" || code === "email_exists") return "You already have an account. Enter your password to sign in.";
  if (code === "weak_password") return "Choose a password of at least 8 characters.";
  if (code === "email_not_confirmed") return "Confirm your email first. Open the link we sent you, then sign in.";
  if (code === "over_request_rate_limit") return "Too many sign-in attempts. Wait a few minutes before trying again.";
  return "Couldn’t sign you in right now. Please try again.";
}

export default function SignupForm({ defaultMode = "link" }: SignupFormProps = {}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (mode === "link") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true },
        });
        setMessage(error ? signInErrorMessage(error.code) : "Check your inbox and open the magic link in this same browser to continue to Music.");
        return;
      }

      // Existing members sign in; anyone new is created on the fallback.
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) return; // onAuthStateChange swaps the library in.
      if (error.code !== "invalid_credentials") {
        setMessage(passwordErrorMessage(error.code));
        return;
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (signUpError) {
        setMessage(passwordErrorMessage(signUpError.code));
        return;
      }
      if (!data.session) setMessage("Check your inbox to confirm your email, then sign in with your password.");
    } catch {
      setMessage(mode === "link" ? "Couldn’t send the sign-in link right now. Please try again." : "Couldn’t sign you in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signInWithProvider(provider: (typeof OAUTH_PROVIDERS)[number]["id"]) {
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setMessage("Music accounts are not connected yet. Please try again later.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      // On success the browser leaves for the provider, so only errors land here.
      if (error) setMessage("Couldn’t open that sign-in provider. Please try again, or use your email instead.");
    } catch {
      setMessage("Couldn’t open that sign-in provider. Please try again, or use your email instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signin-options">
      <div className="oauth-buttons">
        {OAUTH_PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className="oauth-button"
            disabled={busy}
            onClick={() => void signInWithProvider(provider.id)}
          >
            <provider.Logo />
            <span>{provider.label}</span>
          </button>
        ))}
      </div>

      <p className="signin-divider"><span>or use your email</span></p>

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
        {mode === "password" && (
          <>
            <label className="sr-only" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </>
        )}
        <button type="submit" disabled={busy}>
          {busy ? "Sending…" : mode === "link" ? "Continue to Music ↗" : "Sign in ↗"}
        </button>
        {message && <p className="form-message" role="status">{message}</p>}
      </form>

      <button
        type="button"
        className="signin-mode-toggle"
        onClick={() => { setMode(mode === "link" ? "password" : "link"); setMessage(""); setPassword(""); }}
      >
        {mode === "link" ? "Use a password instead" : "Email me a sign-in link instead"}
      </button>
    </div>
  );
}
