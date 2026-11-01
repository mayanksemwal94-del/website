// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import MusicVideos from "./MusicVideos";
import { mayankVideos } from "../lib/content";

afterEach(cleanup);

describe("Music in motion section", () => {
  it("features the newest official upload and preserves the earlier video link", () => {
    render(<MusicVideos />);

    expect(screen.getByRole("heading", { name: "Music in motion." })).toBeInTheDocument();
    expect(screen.getByTitle(mayankVideos[0].title)).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${mayankVideos[0].videoId}?rel=0`,
    );
    expect(screen.getByText("Latest")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Watch on YouTube/ })).toHaveAttribute("href", mayankVideos[0].href);
    expect(screen.getByRole("link", { name: /Watch previous video/ })).toHaveAttribute("href", mayankVideos[1].href);
    expect(screen.getByText("Bhula Do Mujhe")).toBeInTheDocument();
  });
});
