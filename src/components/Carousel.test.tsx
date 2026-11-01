// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Carousel from "./Carousel";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (media: string) => ({
      matches: true,
      media,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList,
  });
});

describe("featured carousel imagery", () => {
  it("uses the selected artist, Dhaage, and Mera Ghar artwork instead of placeholders", () => {
    const { container } = render(<Carousel />);
    const images = [...container.querySelectorAll("img")];

    expect(images.map((image) => image.alt)).toEqual([
      "Mayank Semwal wearing the Dhaage campaign T-shirt",
      "Dhaage EP cover artwork",
      "Mera Ghar single cover artwork",
    ]);
    expect(images.map((image) => image.getAttribute("src")).join(" ")).toContain("mayank-artist-intro.webp");
    expect(images.map((image) => image.getAttribute("src")).join(" ")).toContain("dhaage-ep-cover.webp");
    expect(images.map((image) => image.getAttribute("src")).join(" ")).toContain("mera-ghar-cover.webp");
  });
});
