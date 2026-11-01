// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getBrowserSupabaseMock, signInWithOtpMock } = vi.hoisted(() => ({
  getBrowserSupabaseMock: vi.fn(),
  signInWithOtpMock: vi.fn(),
}));
vi.mock("../lib/supabase-client", () => ({ getBrowserSupabase: getBrowserSupabaseMock }));

import SignupForm from "./SignupForm";

afterEach(cleanup);
beforeEach(() => {
  getBrowserSupabaseMock.mockReset();
  signInWithOtpMock.mockReset().mockResolvedValue({ error: null });
  getBrowserSupabaseMock.mockReturnValue({ auth: { signInWithOtp: signInWithOtpMock } });
});

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
