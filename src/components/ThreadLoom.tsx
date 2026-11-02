"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const orbitalAngles = [0, 45, 90, 135];

export default function ThreadLoom() {
  const [bursting, setBursting] = useState(false);
  const burstTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (burstTimer.current) window.clearTimeout(burstTimer.current);
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--thread-x", `${((x - 0.5) * 20).toFixed(1)}deg`);
    event.currentTarget.style.setProperty("--thread-y", `${((0.5 - y) * 20).toFixed(1)}deg`);
  };

  const resetPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--thread-x", "0deg");
    event.currentTarget.style.setProperty("--thread-y", "0deg");
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    setBursting(true);
    if (burstTimer.current) window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBursting(false), 900);
  };

  return (
    <div
      className={`thread-loom${bursting ? " is-bursting" : ""}`}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onPointerDown={handlePointerDown}
    >
      <svg className="thread-loom-svg" viewBox="0 0 200 200" focusable="false">
        <g className="thread-loom-orbits thread-loom-orbits-a">
          {orbitalAngles.map((angle) => (
            <ellipse key={`warp-${angle}`} cx="100" cy="100" rx="84" ry="29" transform={`rotate(${angle} 100 100)`} />
          ))}
        </g>
        <g className="thread-loom-orbits thread-loom-orbits-b">
          {orbitalAngles.map((angle) => (
            <ellipse key={`weft-${angle}`} cx="100" cy="100" rx="72" ry="45" transform={`rotate(${angle + 11.25} 100 100)`} />
          ))}
        </g>
        <g className="thread-loom-weave">
          <path d="M22 72 C58 26 140 174 178 128 C205 94 117 25 71 54 C31 79 88 166 139 145 C177 129 162 67 109 47" />
          <path d="M27 126 C64 174 142 26 178 72 C205 106 116 175 70 146 C31 121 88 34 139 55 C177 71 162 133 109 153" />
          <path d="M45 32 C153 44 157 155 45 168 C19 171 17 29 45 32 Z" />
          <path d="M155 32 C47 44 43 155 155 168 C181 171 183 29 155 32 Z" />
        </g>
        <circle className="thread-loom-core" cx="100" cy="100" r="21" />
      </svg>
      <span className="thread-loom-knot thread-loom-knot-a" />
      <span className="thread-loom-knot thread-loom-knot-b" />
      <span className="thread-loom-burst" />
    </div>
  );
}
