// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import DhaageMusicGate from "./DhaageMusicGate";

afterEach(cleanup);

describe("public Dhaage teaser", () => {
  it("keeps the tracklist inside the member Music library", () => {
    render(<DhaageMusicGate />);
    expect(screen.getByRole("link", { name: /open music/i })).toHaveAttribute("href", "/music");
    expect(screen.getByText(/tracklist lives inside the members-only music library/i)).toBeInTheDocument();
    expect(screen.queryByText("Bhula Do Mujhe")).not.toBeInTheDocument();
    expect(screen.queryByText("Mera Ghar")).not.toBeInTheDocument();
  });
});
