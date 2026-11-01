// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./CartIndicator", () => ({ default: () => null }));
import SiteHeader from "./SiteHeader";

afterEach(cleanup);

describe("main navigation", () => {
  it("opens the members-only music area from the header CTA", () => {
    const { container } = render(<SiteHeader />);
    const cta = container.querySelector(".header-cta");
    expect(cta).toHaveTextContent("Music");
    expect(cta).toHaveAttribute("href", "/music");
  });
});
