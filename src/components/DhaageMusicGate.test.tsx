// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import DhaageMusicGate from "./DhaageMusicGate";

afterEach(cleanup);

describe("public Dhaage showcase", () => {
  it("presents released and upcoming songs as one accessible list", () => {
    render(<DhaageMusicGate />);

    const list = screen.getByRole("list", { name: "Dhaage releases" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(list).getByText("Bhula Do Mujhe")).toBeInTheDocument();
    expect(within(list).getByText("Keh Do")).toBeInTheDocument();
    expect(within(list).getByText("Mera Ghar")).toBeInTheDocument();
  });

  it("shows each released Dhaage single with artwork and Spotify, Apple Music, YouTube Music, and Amazon Music search links", () => {
    const { container } = render(<DhaageMusicGate />);

    expect(screen.getByRole("heading", { name: "Bhula Do Mujhe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Keh Do" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Bhula Do Mujhe cover artwork" })).toHaveAttribute(
      "src",
      expect.stringContaining("bhula-do-mujhe-cover.webp"),
    );
    expect(screen.getByRole("img", { name: "Keh Do cover artwork" })).toHaveAttribute(
      "src",
      expect.stringContaining("keh-do-single-cover.webp"),
    );
    expect(screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on Spotify" })).toHaveAttribute(
      "href",
      "https://open.spotify.com/track/4y1fI2xAYzW4b10fXrnB4h",
    );
    expect(screen.getByRole("link", { name: "Listen to Keh Do on Spotify" })).toHaveAttribute(
      "href",
      "https://open.spotify.com/track/1UeFEEShnjmhdJS0QblkwF",
    );
    expect(screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on Apple Music" })).toHaveAttribute(
      "href",
      "https://music.apple.com/in/album/bhula-do-mujhe/6804393568?i=6804393571&uo=4",
    );
    expect(screen.getByRole("link", { name: "Listen to Keh Do on Apple Music" })).toHaveAttribute(
      "href",
      "https://music.apple.com/in/album/keh-do/6822160515?i=6822160517&uo=4",
    );
    expect(screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on YouTube Music" })).toHaveAttribute(
      "href",
      "https://music.youtube.com/watch?v=HbvGCMHBhB4",
    );
    expect(screen.getByRole("link", { name: "Listen to Keh Do on YouTube Music" })).toHaveAttribute(
      "href",
      "https://music.youtube.com/watch?v=xfvfWg-ahiw",
    );
    const platformLinks = [
      screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on Spotify" }),
      screen.getByRole("link", { name: "Listen to Keh Do on Spotify" }),
      screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on Apple Music" }),
      screen.getByRole("link", { name: "Listen to Keh Do on Apple Music" }),
      screen.getByRole("link", { name: "Listen to Bhula Do Mujhe on YouTube Music" }),
      screen.getByRole("link", { name: "Listen to Keh Do on YouTube Music" }),
      screen.getByRole("link", { name: "Search Amazon Music for Bhula Do Mujhe" }),
      screen.getByRole("link", { name: "Search Amazon Music for Keh Do" }),
    ];
    expect(platformLinks[6]).toHaveAttribute("href", "https://music.amazon.in/search/Bhula%20Do%20Mujhe%20Mayank%20Semwal");
    expect(platformLinks[7]).toHaveAttribute("href", "https://music.amazon.in/search/Keh%20Do%20Mayank%20Semwal");
    const tooltipNames = [
      "Spotify",
      "Spotify",
      "Apple Music",
      "Apple Music",
      "YouTube Music",
      "YouTube Music",
      "Amazon Music search",
      "Amazon Music search",
    ];
    for (const [index, link] of platformLinks.entries()) {
      expect(link).toHaveAttribute("data-tooltip", tooltipNames[index]);
      expect(link.querySelector("svg, img")).toHaveAttribute("aria-hidden", "true");
      expect(link).not.toHaveTextContent(/spotify|apple music|youtube music|amazon music/i);
    }
    expect(screen.getByText("Out now · Streaming")).toBeInTheDocument();
    expect(container.querySelector(".dhaage-music-gate")).not.toHaveTextContent(/spotify|apple music|youtube music|amazon music/i);
  });

  it("places the members-only Music card beneath the story copy in the left column", () => {
    const { container } = render(<DhaageMusicGate />);

    const storyColumn = container.querySelector(".ep-intro");
    expect(storyColumn?.querySelector(".dhaage-members-card")).not.toBeNull();
    expect(within(storyColumn as HTMLElement).getByRole("heading", { name: "Listen from the inside." })).toBeInTheDocument();
  });

  it("shows the next single Mera Ghar with its release date and artwork", () => {
    render(<DhaageMusicGate />);

    expect(screen.getByRole("heading", { name: "Mera Ghar" })).toBeInTheDocument();
    expect(screen.getByText("27 November")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Mera Ghar cover artwork" })).toHaveAttribute(
      "src",
      expect.stringContaining("mera-ghar-cover.webp"),
    );
  });

  it("keeps the members-only Music entry point for high-quality listening and early access", () => {
    render(<DhaageMusicGate />);

    expect(screen.getByRole("link", { name: /open music/i })).toHaveAttribute("href", "/music");
    expect(screen.getByText(/high-quality versions of released songs.*upcoming tracks 48 hours before release/i)).toBeInTheDocument();
  });
});
