export type TrackAccessWindow = {
  is_released: boolean;
  release_at: string | null;
};

const EARLY_ACCESS_MS = 48 * 60 * 60 * 1000;

export function isTrackAvailable(track: TrackAccessWindow, nowMs = Date.now()): boolean {
  if (track.is_released) return true;
  if (!track.release_at) return false;
  const releaseMs = Date.parse(track.release_at);
  return Number.isFinite(releaseMs) && nowMs >= releaseMs - EARLY_ACCESS_MS;
}
