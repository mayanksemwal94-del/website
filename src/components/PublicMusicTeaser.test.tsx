// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import PublicMusicTeaser from "./PublicMusicTeaser";

afterEach(cleanup);

describe("public music teaser", () => {
  it("does not expose track listings and directs listeners to the gated Music area", () => {
    render(<PublicMusicTeaser />);
    expect(screen.getByRole("link", { name: /open music/i })).toHaveAttribute("href", "/music");
    expect(screen.getByText(/48 hours before release/i)).toBeInTheDocument();
    expect(screen.queryByText("Safar")).not.toBeInTheDocument();
    expect(screen.queryByText("Mera Ghar")).not.toBeInTheDocument();
  });
});
