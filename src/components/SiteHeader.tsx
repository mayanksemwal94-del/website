import Link from "next/link";
import CartIndicator from "./CartIndicator";
import MobileNavigation from "./MobileNavigation";

export default function SiteHeader({ project = "mayank" }: { project?: "mayank" | "fog" }) {
  if (project === "fog") {
    return (
      <header className="site-header header-dark">
        <Link className="wordmark" href="/">MAYANK SEMWAL <span>●</span></Link>
        <nav className="desktop-navigation" aria-label="Flares Of Gold navigation">
          <a href="#album">Album</a><a href="#videos">Videos</a><a href="#epk">EPK</a><a href="#shop">FOG merch</a>
        </nav>
        <div className="header-actions"><CartIndicator /><Link className="header-back" href="/">← Home</Link></div>
        <MobileNavigation project="fog" />
      </header>
    );
  }
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">MAYANK SEMWAL <span>●</span></Link>
      <nav className="desktop-navigation" aria-label="Main navigation">
        <Link href="/music">Music</Link><Link href="/#videos">Videos</Link><Link href="/#shop">Merch</Link><Link href="/flares-of-gold">Flares Of Gold ↗</Link>
      </nav>
      <div className="header-actions">
        <CartIndicator />
        <Link className="header-login" href="/login">Log in</Link>
        <Link className="header-cta" href="/signup">Sign up</Link>
      </div>
      <MobileNavigation project="mayank" />
    </header>
  );
}
