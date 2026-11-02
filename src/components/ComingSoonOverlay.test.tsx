// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import ComingSoonOverlay from "./ComingSoonOverlay";

afterEach(cleanup);

describe("coming-soon merch overlay", () => {
  it("shows a clear status while making the covered merch inert", () => {
    const { container } = render(
      <ComingSoonOverlay label="Mayank Semwal merch">
        <button type="button">Add to cart</button>
      </ComingSoonOverlay>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Mayank Semwal merch");
    expect(screen.getByRole("status")).toHaveTextContent("Coming soon");
    expect(screen.getByRole("status")).toHaveTextContent("New pieces are taking shape");
    expect(screen.queryByRole("button", { name: "Add to cart" })).not.toBeInTheDocument();
    expect(container.querySelector(".thread-loom")).toBeInTheDocument();
    expect(container.querySelector(".coming-soon-blurred")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".coming-soon-blurred")).toHaveAttribute("inert");
  });
});
