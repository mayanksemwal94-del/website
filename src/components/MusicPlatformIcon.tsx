import Image from "next/image";
import { siApplemusic, siSpotify, siYoutubemusic } from "simple-icons";

export type MusicPlatform = "spotify" | "appleMusic" | "youtubeMusic" | "amazonMusic";

export default function MusicPlatformIcon({ platform }: { platform: MusicPlatform }) {
  if (platform === "amazonMusic") {
    return (
      <Image
        className="dhaage-platform-icon dhaage-platform-icon-amazon"
        src="/icons/amazon-music.png"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
    );
  }

  const icon = platform === "spotify"
    ? siSpotify
    : platform === "appleMusic"
      ? siApplemusic
      : siYoutubemusic;

  return (
    <svg
      className={`dhaage-platform-icon dhaage-platform-icon-${platform}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}
