// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ThreadLoom from "./ThreadLoom";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("interactive coming-soon thread loom", () => {
  it("tilts toward a pointer and returns to neutral when pointer leaves", () => {
    const { container } = render(<ThreadLoom />);
    const loom = container.querySelector(".thread-loom") as HTMLDivElement;
    vi.spyOn(loom, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    fireEvent.pointerMove(loom, { clientX: 100, clientY: 0, pointerType: "mouse" });
    expect(parseFloat(loom.style.getPropertyValue("--thread-x"))).toBe(10);
    expect(parseFloat(loom.style.getPropertyValue("--thread-y"))).toBe(10);

    fireEvent.pointerLeave(loom);
    expect(loom.style.getPropertyValue("--thread-x")).toBe("0deg");
    expect(loom.style.getPropertyValue("--thread-y")).toBe("0deg");
  });

  it("creates a brief thread burst when tapped", () => {
    vi.useFakeTimers();
    const { container } = render(<ThreadLoom />);
    const loom = container.querySelector(".thread-loom") as HTMLDivElement;

    fireEvent.pointerDown(loom, { pointerType: "touch" });
    expect(loom).toHaveClass("is-bursting");

    act(() => vi.advanceTimersByTime(900));
    expect(loom).not.toHaveClass("is-bursting");
  });
});
