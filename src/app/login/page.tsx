import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Log in | Mayank Semwal",
  description: "Log in to your Mayank Semwal music account.",
};

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page page-wrap">
        <section className="auth-card">
          <span className="eyebrow">Members-only listening</span>
          <h1>Welcome back.</h1>
          <p>Log in to stream released songs and hear the next one 48 hours early.</p>
          <SignupForm defaultMode="password" />
          <p className="auth-switch">New here? <Link href="/signup">Create an account</Link></p>
        </section>
      </main>
    </>
  );
}
