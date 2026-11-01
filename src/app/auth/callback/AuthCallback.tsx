"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getBrowserSupabase } from "../../../lib/supabase-client";

export default function AuthCallback() {
  const router = useRouter();
  const started = useRef(false);
  const [message, setMessage] = useState("Confirming your sign-in…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const supabase = getBrowserSupabase();
    if (!supabase) {
      void Promise.resolve().then(() => setMessage("Music sign-in is not configured yet. Please try again later."));
      return;
    }
    const client = supabase;

    const params = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;
    const accessToken = fragment.get("access_token");
    const refreshToken = fragment.get("refresh_token");
    const hasRedirectError = Boolean(params.get("error") || params.get("error_description") || fragment.get("error_description"));

    async function completeSignIn() {
      await Promise.resolve();
      if (hasRedirectError) {
        setMessage("This link could not be verified. Request a fresh Music sign-in link.");
        return;
      }

      let authError: Error | null = null;
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        authError = error;
      } else if (tokenHash && type) {
        const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type });
        authError = error;
      } else if (accessToken && refreshToken) {
        const { error } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        authError = error;
      } else {
        const { data, error } = await client.auth.getSession();
        authError = error;
        if (!error && !data.session) {
          setMessage("This sign-in link is missing or expired. Request a new Music link in the same browser.");
          return;
        }
      }

      if (authError) {
        setMessage("This sign-in link expired or was opened in another browser. Request a fresh link in the same browser you used to sign in.");
        return;
      }
      setMessage("You’re signed in. Opening Music…");
      router.replace("/music");
    }

    void completeSignIn().catch(() => {
      setMessage("We couldn’t confirm this sign-in link. Please request a new one.");
    });
  }, [router]);

  return <main className="callback-page"><span className="eyebrow">Mayank Semwal · Music sign-in</span><h1>{message}</h1></main>;
}
