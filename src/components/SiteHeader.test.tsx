// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./CartIndicator", () => ({ default: () => null }));
import SiteHeader from "./SiteHeader";

afterEach(cleanup);

describe("main navigation", () => {
  it("offers log in and sign up from the header", () => {
    const { container } = render(<SiteHeader />);
    const login = container.querySelector(".header-login");
    expect(login).toHaveTextContent("Log in");
    expect(login).toHaveAttribute("href", "/login");

    const cta = container.querySelector(".header-cta");
    expect(cta).toHaveTextContent("Sign up");
    expect(cta).toHaveAttribute("href", "/signup");
  });

  it("still links to the music area from the main nav", () => {
    const { container } = render(<SiteHeader />);
    expect(container.querySelector('nav a[href="/music"]')).toHaveTextContent("Music");
  });
});
