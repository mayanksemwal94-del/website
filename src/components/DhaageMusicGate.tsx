import Image from "next/image";
import Link from "next/link";
import { dhaageTracks, upcomingSongs } from "../lib/content";
import MusicPlatformIcon from "./MusicPlatformIcon";

const releasedDhaageSongs = dhaageTracks.filter((song) => song.status === "released");
const nextDhaageSong = upcomingSongs[0];

export default function DhaageMusicGate() {
  return (
    <div className="ep-layout dhaage-music-gate">
      <div className="ep-intro">
        <p className="ep-quote">Six songs.<br />One story held together.</p>
        <p>The Dhaage story is unfolding one single at a time. Hear the released songs on your preferred streaming service, then continue the journey in members-only Music.</p>
        <div className="dhaage-members-card dhaage-members-card-left">
          <span className="eyebrow">Members-only Music</span>
          <h3>Listen from the inside.</h3>
          <p>The Music library offers high-quality versions of released songs and access to upcoming tracks 48 hours before release.</p>
          <Link className="button button-dark" href="/music">Open Music ↗</Link>
        </div>
      </div>

      <div className="dhaage-showcase-content">
        <section className="dhaage-released-singles" aria-labelledby="dhaage-released-heading">
          <div className="dhaage-released-heading">
            <span className="eyebrow">Out now · Streaming</span>
            <h3 id="dhaage-released-heading">Released songs</h3>
          </div>
          <ul className="dhaage-track-list" aria-label="Dhaage releases">
            {releasedDhaageSongs.map((song, index) => song.cover && song.href ? (
              <li className="dhaage-track-row" key={song.title}>
                <span className="dhaage-track-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="dhaage-track-art">
                  <Image src={song.cover} alt={`${song.title} cover artwork`} width={160} height={160} />
                </div>
                <div className="dhaage-track-details">
                  <span className="eyebrow">Released · Dhaage</span>
                  <h4>{song.title}</h4>
                </div>
                <div className="dhaage-platform-links">
                  <a
                    className="dhaage-track-listen"
                    href={song.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Listen to ${song.title} on Spotify`}
                    data-tooltip="Spotify"
                  >
                    <MusicPlatformIcon platform="spotify" />
                  </a>
                  {song.appleMusicHref ? (
                    <a
                      className="dhaage-track-listen"
                      href={song.appleMusicHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Listen to ${song.title} on Apple Music`}
                      data-tooltip="Apple Music"
                    >
                      <MusicPlatformIcon platform="appleMusic" />
                    </a>
                  ) : null}
                  {song.youtubeMusicHref ? (
                    <a
                      className="dhaage-track-listen"
                      href={song.youtubeMusicHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Listen to ${song.title} on YouTube Music`}
                      data-tooltip="YouTube Music"
                    >
                      <MusicPlatformIcon platform="youtubeMusic" />
                    </a>
                  ) : null}
                  {song.amazonMusicSearchHref ? (
                    <a
                      className="dhaage-track-listen dhaage-track-listen-search"
                      href={song.amazonMusicSearchHref}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Search Amazon Music for ${song.title}`}
                      data-tooltip="Amazon Music search"
                    >
                      <MusicPlatformIcon platform="amazonMusic" />
                    </a>
                  ) : null}
                </div>
              </li>
            ) : null)}
            {nextDhaageSong?.cover ? (
              <li className="dhaage-track-row dhaage-track-row-upcoming" key={nextDhaageSong.title}>
                <span className="dhaage-track-number" aria-hidden="true">{String(releasedDhaageSongs.length + 1).padStart(2, "0")}</span>
                <div className="dhaage-track-art">
                  <Image src={nextDhaageSong.cover} alt={`${nextDhaageSong.title} cover artwork`} width={160} height={160} />
                </div>
                <div className="dhaage-track-details">
                  <span className="eyebrow">Up next · Dhaage</span>
                  <h4>{nextDhaageSong.title}</h4>
                </div>
                <div className="dhaage-track-date">
                  <span>Release date</span>
                  <time>{nextDhaageSong.releaseDate ?? "To be announced"}</time>
                </div>
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
