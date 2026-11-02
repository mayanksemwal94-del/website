// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getBrowserSupabaseMock } = vi.hoisted(() => ({ getBrowserSupabaseMock: vi.fn() }));
vi.mock("../lib/supabase-client", () => ({ getBrowserSupabase: getBrowserSupabaseMock }));

import MusicLibrary from "./MusicLibrary";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
beforeEach(() => getBrowserSupabaseMock.mockReset());

function connectMember({ profile = { user_id: "member-1", username: "mayankfan" }, tracks = [] }: { profile?: Record<string, unknown> | null; tracks?: Record<string, unknown>[] } = {}) {
  const createSignedUrl = vi.fn(async (path: string) => ({ data: { signedUrl: `https://audio.example/${path}` }, error: null }));
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const from = vi.fn((table: string) => {
    if (table === "member_profiles") {
      return { select: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data: profile, error: null }) })) };
    }
    return { select: vi.fn().mockResolvedValue({ data: tracks, error: null }) };
  });
  const unsubscribe = vi.fn();
  getBrowserSupabaseMock.mockReturnValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: "member-1" } } }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe } } })),
      signOut,
    },
    from,
    storage: { from: vi.fn(() => ({ createSignedUrl })) },
  });
  return { from, createSignedUrl, signOut };
}

function connectSignedOut() {
  getBrowserSupabaseMock.mockReturnValue({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
    },
  });
}

const memberProfile = {
  user_id: "member-1",
  username: "mayankfan",
  date_of_birth: "1990-01-02",
  favorite_genres: ["Indie pop"],
  favorite_languages: ["Hindi"],
  favorite_artists: ["Radiohead"],
};

describe("members-only music library", () => {
  it("does not expose songs before sign-in", async () => {
    connectSignedOut();
    render(<MusicLibrary />);

    expect(await screen.findByRole("button", { name: "Continue to Music ↗" })).toBeInTheDocument();
    expect(screen.queryByText("Safar")).not.toBeInTheDocument();
  });

  it("requires a private member profile after email sign-in", async () => {
    connectMember({ profile: null });
    render(<MusicLibrary />);

    expect(await screen.findByRole("heading", { name: "Set up your music profile." })).toBeInTheDocument();
    expect(screen.queryByText("Safar")).not.toBeInTheDocument();
  });

  it("shows released tracks and keeps an upcoming track locked until its 48-hour window", async () => {
    const releaseAt = new Date(Date.now() + 50 * 60 * 60 * 1000).toISOString();
    const client = connectMember({
      profile: memberProfile,
      tracks: [
        { id: "bhula-id", slug: "bhula-do-mujhe", title: "Bhula Do Mujhe", collection: "Dhaage EP", release_year: 2026, is_released: true, release_at: null, storage_path: "dhaage/2026/bhula-do-mujhe.wav" },
        { id: "keh-id", slug: "keh-do", title: "Keh Do", collection: "Dhaage EP", release_year: 2026, is_released: true, release_at: null, storage_path: "dhaage/2026/keh-do.wav" },
        { id: "mera-ghar-id", slug: "mera-ghar", title: "Mera Ghar", collection: "Dhaage EP", release_year: 2026, is_released: false, release_at: releaseAt, storage_path: "dhaage/2026/mera-ghar.wav" },
      ],
    });
    render(<MusicLibrary />);

    expect(await screen.findByRole("button", { name: "Listen to Bhula Do Mujhe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Listen to Keh Do" })).toBeInTheDocument();
    expect(screen.getByText(/Preview opens 48 hours before release/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Listen to Mera Ghar" })).not.toBeInTheDocument();
    expect(client.createSignedUrl).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Listen to Bhula Do Mujhe" }));
    expect(await screen.findByLabelText("Bhula Do Mujhe full preview")).toHaveAttribute("src", "https://audio.example/dhaage/2026/bhula-do-mujhe.wav");
    expect(client.createSignedUrl).toHaveBeenCalledOnce();
  });

  it("hides Safar and shows Dhaage release year and credit fields", async () => {
    connectMember({
      profile: memberProfile,
      tracks: [
        { id: "safar-id", slug: "safar", title: "Safar", collection: "Singles", is_released: true, release_at: null, storage_path: "released/safar.wav", is_member_visible: false },
        { id: "bhula-id", slug: "bhula-do-mujhe", title: "Bhula Do Mujhe", collection: "Dhaage EP", release_year: 2026, is_released: true, release_at: null, storage_path: null, composed_by: null, lyrics_by: null, recording_studio: null, mix_and_master: null, is_member_visible: true },
      ],
    });
    render(<MusicLibrary />);

    expect(await screen.findByRole("heading", { name: "Bhula Do Mujhe" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Safar" })).not.toBeInTheDocument();
    expect(screen.getByText("Dhaage EP · 2026")).toBeInTheDocument();
    expect(screen.getByText("Credits & recording details")).toBeInTheDocument();
    expect(screen.getByText("Composed by")).toBeInTheDocument();
    expect(screen.getByText("Lyrics by")).toBeInTheDocument();
    expect(screen.getByText("Recording studio")).toBeInTheDocument();
    expect(screen.getByText("Mix and master")).toBeInTheDocument();
    expect(screen.getAllByText("To be added")).toHaveLength(4);
  });

  it("lets a member select an available song and leave private comments", async () => {
    const releaseAt = new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString();
    const client = connectMember({
      profile: memberProfile,
      tracks: [{ id: "mera-ghar-id", slug: "mera-ghar", title: "Mera Ghar", is_released: false, release_at: releaseAt, storage_path: "upcoming/mera-ghar.mp3" }],
    });
    render(<MusicLibrary />);

    fireEvent.click(await screen.findByRole("button", { name: "Listen to Mera Ghar" }));
    expect(await screen.findByLabelText("Mera Ghar full preview")).toHaveAttribute("src", "https://audio.example/upcoming/mera-ghar.mp3");
    expect(screen.getByLabelText("Your comment on Mera Ghar")).toBeInTheDocument();
    expect(screen.getByText(/Only Mayank can read this/i)).toBeInTheDocument();
    expect(client.createSignedUrl).toHaveBeenCalledWith("upcoming/mera-ghar.mp3", 600);
  });

  it("lets a member sign out of their music account", async () => {
    const client = connectMember({ profile: memberProfile });
    render(<MusicLibrary />);
    fireEvent.click(await screen.findByRole("button", { name: "Sign out" }));
    expect(client.signOut).toHaveBeenCalledOnce();
  });
});
