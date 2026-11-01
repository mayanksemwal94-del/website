import Link from "next/link";

export default function PublicMusicTeaser() {
  return (
    <section className="section section-muted member-music-teaser" id="music">
      <div className="page-wrap">
        <div className="section-head">
          <div><span className="eyebrow">01 / Members-only listening</span><h2>Music, inside.</h2></div>
          <p>Released songs.<br />Early access to what’s next.</p>
        </div>
        <div className="member-music-card">
          <div>
            <span className="eyebrow">A private music library</span>
            <h3>Listen closely.<br /><em>Come back often.</em></h3>
            <p>Create a free account to listen to released music. Upcoming songs unlock 48 hours before release, with private comments for Mayank.</p>
          </div>
          <Link className="button button-dark" href="/music">Open Music ↗</Link>
        </div>
      </div>
    </section>
  );
}
