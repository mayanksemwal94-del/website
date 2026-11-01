import Image from "next/image";
import { mayankVideos } from "../lib/content";

const [latestVideo, previousVideo] = mayankVideos;

export default function MusicVideos() {
  return (
    <section className="section video-section" id="videos" aria-labelledby="music-in-motion-title">
      <div className="page-wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">03 / Watch the world</span>
            <h2 id="music-in-motion-title">Music in motion.</h2>
          </div>
          <p>Latest official video<br />on YouTube</p>
        </div>
        <div className="video-feature-layout">
          <div className="video-main">
            <div className="video-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${latestVideo.videoId}?rel=0`}
                title={latestVideo.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="video-caption">
              <div className="video-caption-title">
                <span className="video-latest-badge">Latest</span>
                <span>{latestVideo.shortTitle} · Official music video</span>
              </div>
              <a href={latestVideo.href} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
            </div>
          </div>
          <aside className="video-archive-card" aria-label={`Previous official video: ${previousVideo.shortTitle}`}>
            <div className="video-archive-art" aria-hidden="true">
              <Image src={previousVideo.cover} alt="" fill sizes="(max-width: 620px) 35vw, 18vw" />
              <span className="video-play">▶</span>
            </div>
            <div className="video-archive-copy">
              <span className="eyebrow">Previous video</span>
              <h3>{previousVideo.shortTitle}</h3>
              <a className="video-archive-link" href={previousVideo.href} target="_blank" rel="noreferrer">Watch previous video ↗</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
