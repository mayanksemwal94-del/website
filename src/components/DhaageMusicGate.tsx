import Link from "next/link";

export default function DhaageMusicGate() {
  return (
    <div className="ep-layout dhaage-music-gate">
      <div className="ep-intro">
        <p className="ep-quote">Six songs.<br />One story held together.</p>
        <p>Singles are planned for release on the last Friday of each month as the EP builds toward its February release.</p>
      </div>
      <div className="dhaage-members-card">
        <span className="eyebrow">Members-only tracklist</span>
        <h3>Listen from the inside.</h3>
        <p>The tracklist lives inside the members-only Music library. Members can stream released songs and hear the next song 48 hours before release.</p>
        <Link className="button button-dark" href="/music">Open Music ↗</Link>
      </div>
    </div>
  );
}
