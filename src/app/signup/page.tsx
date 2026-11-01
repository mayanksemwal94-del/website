import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Sign up | Mayank Semwal",
  description: "Create a Mayank Semwal music account for members-only listening.",
};

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page page-wrap">
        <section className="auth-card">
          <span className="eyebrow">Members-only listening</span>
          <h1>Join the music.</h1>
          <p>Create an account to stream released songs and hear the next one 48 hours before release.</p>
          <SignupForm />
          <p className="auth-switch">Already a member? <Link href="/login">Log in</Link></p>
        </section>
      </main>
    </>
  );
}
