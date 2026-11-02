// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./CartIndicator", () => ({ default: () => null }));
import MobileNavigation from "./MobileNavigation";

afterEach(cleanup);

describe("mobile navigation", () => {
  it("opens an accessible menu with the main links and account actions", () => {
    render(<MobileNavigation project="mayank" />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);

    const nav = screen.getByRole("navigation", { name: "Mobile main navigation" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(nav).getByRole("link", { name: "Music" })).toHaveAttribute("href", "/music");
    expect(within(nav).getByRole("link", { name: "Videos" })).toHaveAttribute("href", "/#videos");
    expect(within(nav).getByRole("link", { name: "Merch" })).toHaveAttribute("href", "/#shop");
    expect(within(nav).getByRole("link", { name: "Flares Of Gold" })).toHaveAttribute("href", "/flares-of-gold");
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup");

    fireEvent.keyDown(nav, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Mobile main navigation" })).not.toBeInTheDocument();
  });

  it("shows project-specific navigation on the FOG page", () => {
    render(<MobileNavigation project="fog" />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const nav = screen.getByRole("navigation", { name: "Mobile main navigation" });
    expect(within(nav).getByRole("link", { name: "Album" })).toHaveAttribute("href", "#album");
    expect(within(nav).getByRole("link", { name: "FOG merch" })).toHaveAttribute("href", "#shop");
    expect(screen.getByRole("link", { name: "Back to Mayank Semwal" })).toHaveAttribute("href", "/");
  });
});
