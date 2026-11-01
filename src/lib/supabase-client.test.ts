import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({ createClientMock: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: createClientMock }));

afterEach(() => vi.unstubAllEnvs());
beforeEach(() => {
  vi.resetModules();
  createClientMock.mockReset();
});

describe("browser Supabase configuration", () => {
  it("uses the publishable key for the browser client", async () => {
    const client = { auth: {} };
    const url = "https://project.example.supabase.co";
    const publishableKey = "sb_publishable_example";
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishableKey);
    createClientMock.mockReturnValue(client);

    const { getBrowserSupabase } = await import("./supabase-client");

    expect(getBrowserSupabase()).toBe(client);
    expect(createClientMock).toHaveBeenCalledWith(url, publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: "pkce" },
    });
  });

  it("continues to accept the legacy anon key when no publishable key is set", async () => {
    const client = { auth: {} };
    const url = "https://project.example.supabase.co";
    const anonKey = "legacy-anon-example";
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey);
    createClientMock.mockReturnValue(client);

    const { getBrowserSupabase } = await import("./supabase-client");

    expect(getBrowserSupabase()).toBe(client);
    expect(createClientMock).toHaveBeenCalledWith(url, anonKey, expect.any(Object));
  });
});
