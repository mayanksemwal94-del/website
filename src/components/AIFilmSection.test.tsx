// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AIFilmSection from "./AIFilmSection";
import { aiPerspective } from "../lib/content";

class TestIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: false })),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AI filmmaking section layout", () => {
  it("uses an editorial, full-width title and numbered copy around the centered portrait", () => {
    const { container } = render(<AIFilmSection />);
    const section = container.querySelector("#ai-film");
    const intro = section?.querySelector(".ai-film-intro");
    const title = intro?.querySelector(".ai-film-title");
    const columns = section?.querySelectorAll(".ai-film-column");
    const layout = section?.querySelector(".ai-film-layout");

    expect(section).toHaveAttribute("aria-labelledby", "ai-film-title");
    expect(intro).toHaveClass("ai-film-intro");
    expect(intro?.querySelector(".ai-film-kicker")).toHaveTextContent("AI / FILMMAKING");
    expect(title?.tagName).toBe("H2");
    expect(title).toHaveTextContent(aiPerspective.title);
    expect(columns).toHaveLength(2);
    expect(columns?.[0].querySelectorAll(".ai-film-copy-item")).toHaveLength(3);
    expect(columns?.[1].querySelectorAll(".ai-film-copy-item")).toHaveLength(3);
    expect([...section!.querySelectorAll(".ai-film-index")].map((item) => item.textContent)).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(layout?.children[0]).toHaveClass("ai-film-intro");
    expect(layout?.children[1]).toHaveClass("ai-film-column-left");
    expect(layout?.children[2]).toHaveClass("ai-film-column-right");
    expect(layout?.children[3]).toHaveClass("ai-film-portrait-rail");
    expect(
      [...columns![0].querySelectorAll("p"), ...columns![1].querySelectorAll("p")]
        .map((paragraph) => paragraph.textContent)
        .join(" "),
    ).toBe(aiPerspective.body.join(" "));
  });
});
