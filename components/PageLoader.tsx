"use client";

import { useState, useEffect } from "react";

const BOOT_LINES = [
  "> BIOS v2.1 ... OK",
  "> Loading kernel modules ...",
  "> Mounting filesystem ... OK",
  "> Initializing portfolio.exe",
  "> Hello, World!",
];

type PageLoaderProps = {
  onComplete?: () => void;
};

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lineIndex = 0;

    // Print one boot line every 280ms
    const lineInterval = setInterval(() => {
      if (lineIndex < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(lineInterval);
      }
    }, 280);

    // Animate progress bar 0→100 over ~1.4s
    let p = 0;
    const barInterval = setInterval(() => {
      p += 2;
      setProgress(Math.min(p, 100));
      if (p >= 100) clearInterval(barInterval);
    }, 28);

    // Fade out
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2750);

    return () => {
      clearInterval(lineInterval);
      clearInterval(barInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`pl-root ${fadeOut ? "pl-root--out" : ""}`}>
      {/* scanlines overlay */}
      <div className="pl-scanlines" />

      <div className="pl-terminal">
        {/* title bar */}
        <div className="pl-titlebar">
          <span className="pl-dot pl-dot--red" />
          <span className="pl-dot pl-dot--yellow" />
          <span className="pl-dot pl-dot--green" />
          <span className="pl-titlebar-label">boot.sh</span>
        </div>

        {/* boot lines */}
        <div className="pl-body">
          {lines.map((line, i) => (
            <div key={i} className="pl-line">
              {line}
            </div>
          ))}
          {/* blinking cursor on last line */}
          {lines.length < BOOT_LINES.length && (
            <div className="pl-line">
              <span className="pl-caret">█</span>
            </div>
          )}
        </div>

        {/* progress bar */}
        <div className="pl-bar-wrap">
          <div className="pl-bar-track">
            <div className="pl-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="pl-bar-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
