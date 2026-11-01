"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    label: "01 / The artist",
    title: <>Meet Mayank<br /><em>Semwal.</em></>,
    body: "A songwriter’s world, made one feeling at a time. Find the songs, films, and stories from Mayank Semwal here.",
    cta: "Explore the music",
    href: "#music",
    visual: "portrait",
    image: "/images/mayank-artist-intro.webp",
    imageAlt: "Mayank Semwal wearing the Dhaage campaign T-shirt",
    stamp: "MAYANK / SEMWAL",
  },
  {
    label: "02 / The upcoming EP",
    title: <>Every thread<br />leads to <em>Dhaage.</em></>,
    body: "Six songs, connected by the things we hold on to. The upcoming EP gathers Bhula Do Mujhe, Keh Do, Mera Ghar, Pal Roshni Ka, Mera Kasoor, and Woh Hai Kahan.",
    cta: "Meet Dhaage",
    href: "#dhaage",
    visual: "dhaage",
    image: "/images/dhaage-ep-cover.webp",
    imageAlt: "Dhaage EP cover artwork",
    stamp: "DHAAGE / SIX SONGS",
  },
  {
    label: "03 / Next up · upcoming",
    title: <>Next up:<br /><em>Mera Ghar.</em></>,
    body: "Mera Ghar is the next song on the way. New tracks are planned for the last Friday of each month, building toward the Dhaage EP.",
    cta: "See what’s coming",
    href: "#upcoming",
    visual: "meraghar",
    image: "/images/mera-ghar-cover.webp",
    imageAlt: "Mera Ghar single cover artwork",
    stamp: "NEXT / MERA GHAR",
  },
];

export default function Carousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((index: number) => setActive((index + slides.length) % slides.length), []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label="Mayank Semwal featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {slides.map((slide, index) => (
        <article
          className={`carousel-slide slide-${slide.visual}${active === index ? " is-active" : ""}`}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}: ${slide.label}`}
          aria-hidden={active !== index}
          key={slide.visual}
        >
          <div className="slide-copy">
            <span className="eyebrow">{slide.label}</span>
            <h1>{slide.title}</h1>
            <p>{slide.body}</p>
            <a className="button button-light" href={slide.href}>{slide.cta} <span aria-hidden="true">↘</span></a>
          </div>
          <div className={`slide-art slide-art-${slide.visual}`}>
            <div className="slide-image-frame">
              <Image className={`slide-image slide-image-${slide.visual}`} src={slide.image} alt={slide.imageAlt} fill priority={index === 0} sizes="(max-width: 620px) 70vw, (max-width: 850px) 40vw, 420px" />
            </div>
            <div className="art-stamp">{slide.stamp}</div>
          </div>
        </article>
      ))}
      <div className="carousel-controls">
        <div className="carousel-dots" role="group" aria-label="Choose featured slide">
          {slides.map((slide, index) => (
            <button
              className={`carousel-dot${active === index ? " is-active" : ""}`}
              aria-label={`Show slide ${index + 1}`}
              aria-current={active === index}
              key={slide.visual}
              onClick={() => go(index)}
            />
          ))}
        </div>
        <div className="carousel-arrows">
          <button className="carousel-arrow" aria-label="Previous slide" onClick={() => go(active - 1)}>←</button>
          <button className="carousel-arrow" aria-label="Next slide" onClick={() => go(active + 1)}>→</button>
        </div>
      </div>
    </section>
  );
}
