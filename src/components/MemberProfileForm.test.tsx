// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getBrowserSupabaseMock, insertMock } = vi.hoisted(() => ({
  getBrowserSupabaseMock: vi.fn(),
  insertMock: vi.fn(),
}));
vi.mock("../lib/supabase-client", () => ({ getBrowserSupabase: getBrowserSupabaseMock }));

import MemberProfileForm from "./MemberProfileForm";

afterEach(cleanup);
beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  getBrowserSupabaseMock.mockReset().mockReturnValue({ from: vi.fn(() => ({ insert: insertMock })) });
});

describe("music member profile setup", () => {
  it("saves username, private birth date, music preferences and favourite artists", async () => {
    const onComplete = vi.fn();
    render(<MemberProfileForm onComplete={onComplete} />);

    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "mayankfan" } });
    fireEvent.change(screen.getByLabelText("Date of birth"), { target: { value: "1990-01-02" } });
    fireEvent.click(screen.getByLabelText("Indie pop"));
    fireEvent.click(screen.getByLabelText("Hindi"));
    fireEvent.change(screen.getByLabelText(/Favourite artists or bands/), { target: { value: "Radiohead, Arijit Singh" } });
    fireEvent.click(screen.getByRole("button", { name: "Create music profile" }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledWith({
      username: "mayankfan",
      date_of_birth: "1990-01-02",
      favorite_genres: ["Indie pop"],
      favorite_languages: ["Hindi"],
      favorite_artists: ["Radiohead", "Arijit Singh"],
    }));
    expect(await screen.findByRole("status")).toHaveTextContent("Profile saved.");
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
