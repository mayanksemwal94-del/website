// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  getBrowserSupabaseMock,
  signInWithOtpMock,
  signInWithPasswordMock,
  signUpMock,
  signInWithOAuthMock,
} = vi.hoisted(() => ({
  getBrowserSupabaseMock: vi.fn(),
  signInWithOtpMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  signUpMock: vi.fn(),
  signInWithOAuthMock: vi.fn(),
}));
vi.mock("../lib/supabase-client", () => ({ getBrowserSupabase: getBrowserSupabaseMock }));

import SignupForm from "./SignupForm";

afterEach(cleanup);
beforeEach(() => {
  getBrowserSupabaseMock.mockReset();
  signInWithOtpMock.mockReset().mockResolvedValue({ error: null });
  signInWithPasswordMock.mockReset().mockResolvedValue({ error: null });
  signUpMock.mockReset().mockResolvedValue({ data: { session: null }, error: null });
  signInWithOAuthMock.mockReset().mockResolvedValue({ error: null });
  getBrowserSupabaseMock.mockReturnValue({
    auth: {
      signInWithOtp: signInWithOtpMock,
      signInWithPassword: signInWithPasswordMock,
      signUp: signUpMock,
      signInWithOAuth: signInWithOAuthMock,
    },
  });
});

function switchToPassword() {
  fireEvent.click(screen.getByRole("button", { name: "Use a password instead" }));
}

describe("music sign-in form", () => {
  it("sends the email link to the callback and tells listeners to use this browser", async () => {
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue to Music ↗" }));

    await waitFor(() => expect(signInWithOtpMock).toHaveBeenCalledWith({
      email: "listener@example.com",
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true },
    }));
    expect(await screen.findByRole("status")).toHaveTextContent(/continue to Music/i);
  });

  it("explains when Supabase has rate-limited email links", async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: { code: "over_email_send_rate_limit" } });
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue to Music ↗" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/temporarily rate-limited sign-in emails/i);
    expect(screen.getByRole("status")).toHaveTextContent(/wait for the email limit to reset/i);
  });

  it("explains when the default mailer cannot send to a member address", async () => {
    signInWithOtpMock.mockResolvedValueOnce({ error: { code: "email_address_not_authorized" } });
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue to Music ↗" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/configure custom SMTP to send links to members/i);
  });

  it("reports a network failure and lets the member retry", async () => {
    signInWithOtpMock.mockRejectedValueOnce(new Error("offline"));
    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue to Music ↗" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Couldn’t send the sign-in link right now.");
    expect(screen.getByRole("button", { name: "Continue to Music ↗" })).toBeEnabled();
  });
});

describe("password sign-in", () => {
  it("signs an existing member in with their password", async () => {
    render(<SignupForm />);
    switchToPassword();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "correct-horse" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in ↗" }));

    await waitFor(() => expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "listener@example.com",
      password: "correct-horse",
    }));
    expect(signUpMock).not.toHaveBeenCalled();
    expect(signInWithOtpMock).not.toHaveBeenCalled();
  });

  it("creates an account when the email has no password yet", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: { code: "invalid_credentials" } });
    render(<SignupForm />);
    switchToPassword();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "brand-new-pass" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in ↗" }));

    await waitFor(() => expect(signUpMock).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "brand-new-pass",
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    }));
    expect(await screen.findByRole("status")).toHaveTextContent(/confirm your email/i);
  });

  it("does not fall back to sign-up when the password is simply wrong", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: { code: "email_not_confirmed" } });
    render(<SignupForm />);
    switchToPassword();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "whatever-pass" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in ↗" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/confirm your email first/i);
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it("rejects a weak password with the reason", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ error: { code: "invalid_credentials" } });
    signUpMock.mockResolvedValueOnce({ data: { session: null }, error: { code: "weak_password" } });
    render(<SignupForm />);
    switchToPassword();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "shortpwd" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in ↗" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/at least 8 characters/i);
  });
});

describe("social sign-in", () => {
  it("sends members to Google with the callback redirect", async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    await waitFor(() => expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    }));
  });

  it("sends members to Apple with the callback redirect", async () => {
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Apple" }));

    await waitFor(() => expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    }));
  });

  it("explains when a provider cannot be opened", async () => {
    signInWithOAuthMock.mockResolvedValueOnce({ error: { message: "provider disabled" } });
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/couldn’t open that sign-in provider/i);
  });

  it("shows a brand logo inside each provider button", () => {
    const { container } = render(<SignupForm />);
    for (const name of ["Continue with Google", "Continue with Apple"]) {
      const button = screen.getByRole("button", { name });
      expect(button.querySelector("svg.provider-logo")).toBeInTheDocument();
    }
    // Google's mark must keep its official colours.
    expect(container.querySelector('svg.provider-logo path[fill="#4285F4"]')).toBeInTheDocument();
  });

  it("starts in password mode when the login page asks for it", () => {
    render(<SignupForm defaultMode="password" />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in ↗" })).toBeInTheDocument();
  });

  it("tells members when music accounts are not connected", async () => {
    getBrowserSupabaseMock.mockReturnValue(null);
    render(<SignupForm />);
    fireEvent.click(screen.getByRole("button", { name: "Continue with Apple" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/not connected yet/i);
    expect(signInWithOAuthMock).not.toHaveBeenCalled();
  });
});
