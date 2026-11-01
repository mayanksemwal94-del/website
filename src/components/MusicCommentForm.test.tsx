// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getBrowserSupabaseMock, insertMock } = vi.hoisted(() => ({
  getBrowserSupabaseMock: vi.fn(),
  insertMock: vi.fn(),
}));
vi.mock("../lib/supabase-client", () => ({ getBrowserSupabase: getBrowserSupabaseMock }));

import MusicCommentForm from "./MusicCommentForm";

afterEach(cleanup);
beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  getBrowserSupabaseMock.mockReset().mockReturnValue({ from: vi.fn(() => ({ insert: insertMock })) });
});

describe("private music comments", () => {
  it("sends a comment for the selected track and confirms it is private", async () => {
    render(<MusicCommentForm trackId="track-1" trackTitle="Mera Ghar" />);
    fireEvent.change(screen.getByLabelText("Your comment on Mera Ghar"), { target: { value: "The chorus stays with me." } });
    fireEvent.click(screen.getByRole("button", { name: "Send comment privately" }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledWith({
      track_id: "track-1",
      comment: "The chorus stays with me.",
    }));
    expect(await screen.findByRole("status")).toHaveTextContent("Comment sent privately to Mayank.");
    expect(screen.getByText(/only Mayank can read this/i)).toBeInTheDocument();
  });
});
