"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";

export default function AIPortraitReveal() {
  const railRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    if (!width || !height) return;

    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const round = (value: number) => Math.round(value * 100) / 100;
    const x = clamp((event.clientX - left) / width) - 0.5;
    const y = clamp((event.clientY - top) / height) - 0.5;
    event.currentTarget.style.setProperty("--portrait-shift-x", `${round(x * 12)}px`);
    event.currentTarget.style.setProperty("--portrait-shift-y", `${round(y * 10)}px`);
    event.currentTarget.style.setProperty("--portrait-tilt", `${round(x * 3)}deg`);
  };

  const resetPointer = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--portrait-shift-x");
    event.currentTarget.style.removeProperty("--portrait-shift-y");
    event.currentTarget.style.removeProperty("--portrait-tilt");
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ai-film-portrait-rail" ref={railRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <svg className="ai-film-illustration" viewBox="0 0 420 560" aria-hidden="true" focusable="false">
        <path className="ai-film-illustration-fill" d="M91 397c-32-45-5-84-27-137-20-48-11-99 30-141 39-40 83-24 123-49 43-27 99-18 127 19 25 33 4 68 24 105 23 43 65 71 40 123-18 38-10 73-44 107-34 33-80 28-114 13-39-17-75 13-116-6-22-10-32-19-43-34Z" />
        <path className="ai-film-illustration-paper" d="M278 91c24-15 55-6 66 16 11 23-4 46-27 53-24 7-44-8-49-30-4-16-2-29 10-39Z" />
        <path className="ai-film-illustration-line" d="M38 390c-19-73-3-160 42-225 44-63 116-106 191-91 72 14 120 75 113 137-7 62-59 79-71 132-15 67-71 123-143 125" />
        <path className="ai-film-illustration-line-secondary" d="M67 146c58 23 85 3 128-14 58-24 104-8 131 21m-243 255c57 23 107 11 148-19 35-26 57-53 96-53" />
        <path className="ai-film-illustration-dash" d="M58 252c20-35 42-58 72-73m166 270c26-14 48-36 64-62" />
        <path className="ai-film-illustration-spark" d="m358 105 8 24 24 8-24 8-8 24-8-24-24-8 24-8 8-24Z" />
        <path className="ai-film-illustration-spark" d="m77 432 5 14 14 5-14 5-5 14-5-14-14-5 14-5 5-14Z" />
        <circle className="ai-film-illustration-dot" cx="64" cy="187" r="5" />
        <circle className="ai-film-illustration-dot" cx="344" cy="411" r="4" />
      </svg>
      <figure className={`ai-film-portrait${isVisible ? " is-visible" : ""}`}>
        <Image
          src="/images/mayank-ai-portrait.png"
          alt="Portrait of Mayank Semwal in sunglasses and a charcoal jacket"
          fill
          loading="eager"
          sizes="(max-width: 620px) 72vw, (max-width: 1000px) 24vw, 300px"
        />
      </figure>
    </div>
  );
}
