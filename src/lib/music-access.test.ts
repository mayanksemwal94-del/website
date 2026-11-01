import { describe, expect, it } from "vitest";
import { isTrackAvailable } from "./music-access";

const releaseAt = "2026-12-25T18:00:00.000Z";
const track = { is_released: false, release_at: releaseAt };
const windowMs = 48 * 60 * 60 * 1000;

describe("music access window", () => {
  it("opens an upcoming track exactly 48 hours before release", () => {
    const releaseMs = Date.parse(releaseAt);
    expect(isTrackAvailable(track, releaseMs - windowMs - 1)).toBe(false);
    expect(isTrackAvailable(track, releaseMs - windowMs)).toBe(true);
  });

  it("keeps released music available and upcoming tracks closed without a release date", () => {
    expect(isTrackAvailable({ is_released: true, release_at: null }, Date.now())).toBe(true);
    expect(isTrackAvailable({ is_released: false, release_at: null }, Date.now())).toBe(false);
  });
});
