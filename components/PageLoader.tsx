"use client";

import { useState, useEffect } from "react";

const MS_DOS_LINES = [
  "Award Modular BIOS v4.51PG, An Energy Star Ally",
  "Copyright (C) 1984-95, Award Software, Inc.",
  "",
  "PENTIUM-S CPU at 133MHz",
  "Memory Test :  32768K OK",
  "",
  "Award Plug and Play BIOS Extension  v1.0A",
  "Initialize Plug and Play Cards...",
  "PNP Init Completed",
  "",
  "Detecting IDE Primary Master   ... WDC AC31600H",
  "Detecting IDE Primary Slave    ... None",
  "Detecting IDE Secondary Master ... ATAPI CD-ROM DRIVE",
  "",
  "Updating ESCD ... Success",
  "Building DMI Pool Part ... Success",
  "",
  "Starting MS-DOS...",
  "HIMEM is testing extended memory...done.",
  "",
  "C:\\>C:\\WINDOWS\\smartdrv.exe",
  "C:\\>C:\\WINDOWS\\net start",
  "C:\\>win",
];

type PageLoaderProps = {
  onComplete?: () => void;
};

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [fadeOut, setFadeOut] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lineIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const showNextLine = () => {
      if (lineIndex < MS_DOS_LINES.length) {
        setLines((prev) => [...prev, MS_DOS_LINES[lineIndex]]);
        lineIndex++;

        let delay = 60;
        if (lineIndex === 5) delay = 400; 
        else if (lineIndex === 9) delay = 250; 
        else if (lineIndex === 11 || lineIndex === 13) delay = 200; 
        else if (lineIndex === 15 || lineIndex === 16) delay = 300; 
        else if (lineIndex === 19) delay = 500; 
        else if (lineIndex === 21) delay = 400; 
        else if (lineIndex === 22) delay = 300; 
        else if (lineIndex === MS_DOS_LINES.length) delay = 800;

        timeoutId = setTimeout(showNextLine, delay);
      } else {
        setFadeOut(true);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 800);
      }
    };

    timeoutId = setTimeout(showNextLine, 300);

    return () => clearTimeout(timeoutId);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[999] bg-black text-gray-300 font-mono transition-opacity duration-700 pointer-events-none flex flex-col ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      {/* scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.18) 3px, rgba(0, 0, 0, 0.18) 4px)" }} />

      <div className="p-6 text-base md:text-lg flex flex-col gap-1">
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.5rem]">{line}</div>
        ))}
        {lines.length < MS_DOS_LINES.length ? (
          <div className="animate-pulse">_</div>
        ) : null}
      </div>
    </div>
  );
}
