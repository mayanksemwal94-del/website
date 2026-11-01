// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { verifyOtpMock, exchangeCodeForSessionMock, setSessionMock, getSessionMock, routerReplaceMock } = vi.hoisted(() => ({
  verifyOtpMock: vi.fn(),
  exchangeCodeForSessionMock: vi.fn(),
  setSessionMock: vi.fn(),
  getSessionMock: vi.fn(),
  routerReplaceMock: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: routerReplaceMock }) }));
vi.mock("../../../lib/supabase-client", () => ({
  getBrowserSupabase: () => ({ auth: {
    verifyOtp: verifyOtpMock,
    exchangeCodeForSession: exchangeCodeForSessionMock,
    setSession: setSessionMock,
    getSession: getSessionMock,
  } }),
}));

import AuthCallback from "./AuthCallback";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});
beforeEach(() => {
  verifyOtpMock.mockReset().mockResolvedValue({ error: null });
  exchangeCodeForSessionMock.mockReset().mockResolvedValue({ error: null });
  setSessionMock.mockReset().mockResolvedValue({ error: null });
  getSessionMock.mockReset().mockResolvedValue({ data: { session: null }, error: null });
  routerReplaceMock.mockReset();
  window.history.replaceState({}, "", "/auth/callback?token_hash=test-hash&type=magiclink");
});

describe("Music sign-in callback", () => {
  it("takes a verified member to the music library", async () => {
    render(<AuthCallback />);
    await waitFor(() => expect(verifyOtpMock).toHaveBeenCalledWith({ token_hash: "test-hash", type: "magiclink" }));
    await waitFor(() => expect(routerReplaceMock).toHaveBeenCalledWith("/music"));
  });

  it("exchanges a PKCE code returned by a magic-link click", async () => {
    window.history.replaceState({}, "", "/auth/callback?code=pkce-code");
    exchangeCodeForSessionMock.mockResolvedValue({ data: { session: { user: { id: "listener-1" } } }, error: null });
    render(<AuthCallback />);

    await waitFor(() => expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("pkce-code"));
    await waitFor(() => expect(routerReplaceMock).toHaveBeenCalledWith("/music"));
  });

  it("accepts legacy implicit tokens in the URL fragment", async () => {
    window.history.replaceState({}, "", "/auth/callback#access_token=access-test&refresh_token=refresh-test&type=magiclink");
    setSessionMock.mockResolvedValue({ data: { session: { user: { id: "listener-1" } } }, error: null });
    render(<AuthCallback />);

    await waitFor(() => expect(setSessionMock).toHaveBeenCalledWith({ access_token: "access-test", refresh_token: "refresh-test" }));
    await waitFor(() => expect(routerReplaceMock).toHaveBeenCalledWith("/music"));
  });
});
