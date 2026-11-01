import { describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import ReviewPage from "./page";

describe("legacy reviewer route", () => {
  it("redirects old reviewer-space links to Music", () => {
    ReviewPage();
    expect(redirectMock).toHaveBeenCalledWith("/music");
  });
});
