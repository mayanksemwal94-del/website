// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AIPortraitReveal from "./AIPortraitReveal";

class TestIntersectionObserver {
  static latest: TestIntersectionObserver;
  static created = 0;
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    TestIntersectionObserver.created += 1;
    TestIntersectionObserver.latest = this;
  }

  trigger(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

beforeEach(() => {
  TestIntersectionObserver.created = 0;
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: false })),
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("AI portrait reveal", () => {
  it("uses the supplied portrait and reveals it only when it first enters view", () => {
    const { container } = render(<AIPortraitReveal />);
    const frame = container.querySelector(".ai-film-portrait");
    const rail = container.querySelector<HTMLDivElement>(".ai-film-portrait-rail");
    const image = container.querySelector("img");

    expect(image?.alt).toBe("Portrait of Mayank Semwal in sunglasses and a charcoal jacket");
    expect(image?.getAttribute("src")).toContain("mayank-ai-portrait.png");
    expect(image?.getAttribute("loading")).toBe("eager");
    expect(frame).not.toHaveClass("is-visible");
    expect(TestIntersectionObserver.latest.observe).toHaveBeenCalledOnce();
    expect(TestIntersectionObserver.latest.observe).toHaveBeenCalledWith(rail);

    act(() => TestIntersectionObserver.latest.trigger(true));

    expect(frame).toHaveClass("is-visible");
    expect(TestIntersectionObserver.latest.disconnect).toHaveBeenCalledOnce();
  });

  it("uses an abstract vector illustration instead of a circular backdrop", () => {
    const { container } = render(<AIPortraitReveal />);
    const illustration = container.querySelector("svg.ai-film-illustration");

    expect(illustration).toHaveAttribute("aria-hidden", "true");
    expect(illustration?.querySelectorAll("path").length).toBeGreaterThanOrEqual(4);
    expect(container.querySelector(".ai-film-orbit")).toBeNull();
  });

  it("tilts the portrait toward a mouse pointer and resets the effect on exit", () => {
    const { container } = render(<AIPortraitReveal />);
    const rail = container.querySelector<HTMLDivElement>(".ai-film-portrait-rail");
    expect(rail).not.toBeNull();
    vi.spyOn(rail!, "getBoundingClientRect").mockReturnValue({
      left: 10, top: 20, right: 210, bottom: 420, width: 200, height: 400,
      x: 10, y: 20, toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerMove(rail!, { pointerType: "mouse", clientX: 160, clientY: 120 });
    expect(rail!.style.getPropertyValue("--portrait-shift-x")).toBe("3px");
    expect(rail!.style.getPropertyValue("--portrait-shift-y")).toBe("-2.5px");
    expect(rail!.style.getPropertyValue("--portrait-tilt")).toBe("0.75deg");

    fireEvent.pointerLeave(rail!);
    expect(rail!.style.getPropertyValue("--portrait-shift-x")).toBe("");
    expect(rail!.style.getPropertyValue("--portrait-shift-y")).toBe("");
    expect(rail!.style.getPropertyValue("--portrait-tilt")).toBe("");
  });

  it("shows the portrait immediately when reduced motion is preferred", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({ matches: true })),
    });
    render(<AIPortraitReveal />);

    expect(TestIntersectionObserver.created).toBe(0);
  });
});
