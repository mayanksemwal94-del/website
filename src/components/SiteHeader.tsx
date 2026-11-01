import Link from "next/link";
import CartIndicator from "./CartIndicator";

export default function SiteHeader({ project = "mayank" }: { project?: "mayank" | "fog" }) {
  if (project === "fog") {
    return (
      <header className="site-header header-dark">
        <Link className="wordmark" href="/">MAYANK SEMWAL <span>●</span></Link>
        <nav aria-label="Flares Of Gold navigation">
          <a href="#album">Album</a><a href="#videos">Videos</a><a href="#epk">EPK</a><a href="#shop">FOG merch</a>
        </nav>
        <div className="header-actions"><CartIndicator /><Link className="header-back" href="/">← Home</Link></div>
      </header>
    );
  }
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">MAYANK SEMWAL <span>●</span></Link>
      <nav aria-label="Main navigation">
        <Link href="/music">Music</Link><Link href="/#videos">Videos</Link><Link href="/#shop">Merch</Link><Link href="/flares-of-gold">Flares Of Gold ↗</Link>
      </nav>
      <div className="header-actions"><CartIndicator /><Link className="header-cta" href="/music">Music ↗</Link></div>
    </header>
  );
}
