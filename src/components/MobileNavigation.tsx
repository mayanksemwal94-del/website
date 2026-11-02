"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import CartIndicator from "./CartIndicator";

type MobileNavigationProps = { project: "mayank" | "fog" };
type MenuItem = { label: string; href: string };

const mainItems: MenuItem[] = [
  { label: "Music", href: "/music" },
  { label: "Videos", href: "/#videos" },
  { label: "Merch", href: "/#shop" },
  { label: "Flares Of Gold", href: "/flares-of-gold" },
];

const fogItems: MenuItem[] = [
  { label: "Album", href: "#album" },
  { label: "Videos", href: "#videos" },
  { label: "EPK", href: "#epk" },
  { label: "FOG merch", href: "#shop" },
];

export default function MobileNavigation({ project }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = project === "fog" ? "mobile-nav-fog-menu" : "mobile-nav-main-menu";
  const items = project === "fog" ? fogItems : mainItems;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="mobile-navigation" onKeyDown={handleKeyDown}>
      <button
        className={`mobile-menu-trigger${open ? " is-open" : ""}`}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        ref={triggerRef}
      >
        <span className="mobile-menu-label">{open ? "Close" : "Menu"}</span>
        <span className="mobile-menu-icon" aria-hidden="true"><i /><i /></span>
      </button>

      <div className="mobile-nav-panel" id={menuId} hidden={!open}>
        <div className="mobile-nav-panel-heading">
          <span className="eyebrow">Navigate</span>
          <span className="mobile-nav-panel-project">{project === "fog" ? "Flares Of Gold" : "Mayank Semwal"}</span>
        </div>
        <nav className="mobile-nav-links" aria-label="Mobile main navigation">
          {items.map((item, index) => (
            <Link
              aria-label={item.label}
              className="mobile-nav-link"
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-nav-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="mobile-nav-link-label">{item.label}</span>
              <span className="mobile-nav-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
        {open ? (
          <div className="mobile-nav-footer">
            <CartIndicator />
            {project === "fog" ? (
              <Link className="mobile-nav-home" href="/" onClick={() => setOpen(false)}>Back to Mayank Semwal</Link>
            ) : (
              <div className="mobile-nav-account-links">
                <Link className="mobile-nav-login" href="/login" onClick={() => setOpen(false)}>Log in</Link>
                <Link className="mobile-nav-signup" href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
