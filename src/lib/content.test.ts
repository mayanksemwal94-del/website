import { describe, expect, it } from "vitest";
import {
  currentSongs,
  dhaageTracks,
  flaresAlbum,
  flaresMerch,
  flaresTracks,
  flaresVideos,
  aiPerspective,
  upcomingSongs,
} from "./content";

describe("artist release content", () => {
  it("lists the released Mayank Semwal songs, including the latest Keh Do single", () => {
    expect(currentSongs.map((song) => song.title)).toEqual([
      "Safar",
      "Puff Puff Pass",
      "Woh Tu Hi Hai",
      "Bhula Do Mujhe",
      "Keh Do",
    ]);
    expect(currentSongs.every((song) => song.status === "released")).toBe(true);
    expect(currentSongs[4]).toMatchObject({
      status: "released",
      href: "https://open.spotify.com/track/1UeFEEShnjmhdJS0QblkwF",
      linkLabel: "Listen",
      cover: "/images/keh-do-single-cover.webp",
    });
  });

  it("features the verified latest Keh Do video while preserving the previous official video", async () => {
    type MayankVideoEntry = { title: string; videoId: string; href: string };
    const contentModule = await import("./content");
    const videos = (contentModule as unknown as { mayankVideos?: readonly MayankVideoEntry[] }).mayankVideos;

    expect(videos).toBeDefined();
    expect(videos).toHaveLength(2);
    expect(videos?.[0]).toMatchObject({
      title: "Mayank Semwal – Keh Do (कह दो) | Official Music Video | Hindi Romantic Song 2026",
      videoId: "xfvfWg-ahiw",
      href: "https://www.youtube.com/watch?v=xfvfWg-ahiw",
    });
    expect(videos?.[1]).toMatchObject({
      title: expect.stringContaining("Bhula Do Mujhe"),
      shortTitle: "Bhula Do Mujhe",
      videoId: "HbvGCMHBhB4",
      cover: "/images/bhula-do-mujhe-cover.webp",
    });
  });

  it("keeps the four upcoming Dhaage tracks in release order", () => {
    expect(upcomingSongs.map((song) => song.title)).toEqual([
      "Mera Ghar",
      "Pal Roshni Ka",
      "Mera Kasoor",
      "Woh Hai Kahan",
    ]);
    expect(upcomingSongs.every((song) => song.status === "upcoming")).toBe(true);
  });

  it("contains the six Dhaage EP tracks and marks Bhula Do Mujhe and Keh Do as released", () => {
    expect(dhaageTracks.map((song) => song.title)).toEqual([
      "Bhula Do Mujhe",
      "Keh Do",
      "Mera Ghar",
      "Pal Roshni Ka",
      "Mera Kasoor",
      "Woh Hai Kahan",
    ]);
    expect(dhaageTracks[0].status).toBe("released");
    expect(dhaageTracks[1].status).toBe("released");
    expect(dhaageTracks.slice(2).every((song) => song.status === "upcoming")).toBe(true);
  });

  it("maps every Dhaage song to its supplied individual cover in track order", () => {
    expect(dhaageTracks.map(({ title, cover }) => [title, cover])).toEqual([
      ["Bhula Do Mujhe", "/images/bhula-do-mujhe-cover.webp"],
      ["Keh Do", "/images/keh-do-single-cover.webp"],
      ["Mera Ghar", "/images/mera-ghar-cover.webp"],
      ["Pal Roshni Ka", "/images/pal-roshni-ka-cover.webp"],
      ["Mera Kasoor", "/images/mera-kasoor-cover.webp"],
      ["Woh Hai Kahan", "/images/woh-hai-kahan-cover.webp"],
    ]);
  });

  it("keeps FOG's debut album and merch separate from Mayank's collection", () => {
    expect(flaresAlbum).toMatchObject({
      artist: "Flares Of Gold",
      shortName: "FOG",
      title: "Life in a Walnut",
      releaseMonth: "February",
      releaseYear: null,
    });
    expect(flaresMerch.length).toBeGreaterThan(0);
    expect(flaresMerch.every((product) => product.collection === "flares-of-gold")).toBe(true);
  });

  it("includes all twelve verified Life in a Walnut Spotify tracks in album order", () => {
    expect(flaresAlbum.trackCount).toBe(12);
    expect(flaresTracks.map((track) => track.title)).toEqual([
      "Life in a Walnut",
      "Online Bin",
      "Money",
      "Planet Funkatopia",
      "Life Goes On",
      "Put Your Hands Up",
      "Suck it and See",
      "Funky Monkeys",
      "FOG Anthem",
      "Hey Girls",
      "Collateral Damage",
      "People Gathered in the Crowd",
    ]);
    expect(flaresTracks.every((track) => track.href.startsWith("https://open.spotify.com/track/"))).toBe(true);
    expect(flaresVideos).toHaveLength(6);
  });

  it("uses a concise original opening title and keeps the body copy balanced", () => {
    const body = aiPerspective.body;
    expect(aiPerspective.title).toBe("AI is a tool, like a knife.");
    expect(`${aiPerspective.title} ${body[0]}`).toBe("AI is a tool, like a knife. People can use a knife to kill each other, or to prepare food and feed each other. The tool doesn't choose its purpose; people do.");
    expect(body).toHaveLength(6);
    expect(`${body[2]} ${body[3]}`).toBe("For my music videos, I use AI as a filmmaking tool. I usually start with an image or a moment I can picture, then explore which tools and features might help me bring it closer to the screen. Understanding the tools matters to me. It lets me guide the process, decide what to keep or change, and shape how the shots fit the song. I feel a lot of creative control, but the result still takes work.");
    const countWords = (paragraphs: readonly string[]) => paragraphs.join(" ").trim().split(" ").filter(Boolean).length;
    expect(Math.abs(countWords(body.slice(0, 3)) - countWords(body.slice(3)))).toBeLessThan(20);
  });

  it("captures a humble first-person view of AI filmmaking and its effort", () => {
    const perspective = [aiPerspective.title, ...aiPerspective.body].join(" ");
    expect(perspective.toLowerCase()).toContain("knife");
    expect(perspective.toLowerCase()).toContain("filmmaking tool");
    expect(perspective.toLowerCase()).toContain("computer engineering");
    expect(perspective.toLowerCase()).toContain("revolution");
    expect(perspective.toLowerCase()).toContain("control");
    expect(perspective.toLowerCase()).toContain("effort");
    expect(perspective.toLowerCase()).toContain("still learning");
    expect(perspective.toLowerCase()).not.toContain("expert");
  });
});
