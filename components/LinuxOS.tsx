"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Folder, Globe, Settings, FileText, X } from "lucide-react";

type LinuxStage = "booting" | "desktop";

const BOOT_LINES = [
  "[    0.000000] Linux version 6.8.0-portfolio (gcc 13.2.0) #1 SMP",
  "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.0 root=/dev/sda1 quiet splash",
  "[    0.012451] BIOS-provided physical RAM map:",
  "[    0.012451]  BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
  "[    0.034200] ACPI: RSDP 0x00000000000F0490 000024 (v02 BOCHS)",
  "[    0.078123] CPU: Intel(R) Core(TM) i7-1337 Portfolio Edition @ 4.20GHz",
  "[    0.112000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
  "[    0.148900] Booting paravirtualized kernel on bare hardware",
  "[    0.200100] Memory: 16384MB / 16384MB available (14212K kernel code)",
  "[    0.310000] PCI: Using configuration type 1 for base access",
  "[    0.420500] clocksource: tsc-early: mask: 0xffffffffffffffff",
  "[    0.560200] NET: Registered PF_INET6 protocol family",
  "[    0.720000] SCSI subsystem initialized",
  "[    0.880100] systemd[1]: Detected architecture x86-64.",
  "[    0.921000] systemd[1]: Set hostname to <portfolio-pc>.",
  "[    1.040000] systemd[1]: Starting Journal Service...",
  "[    1.180200] systemd[1]: Started Journal Service.",
  "[    1.250000] systemd[1]: Starting Network Manager...",
  "[    1.380000] systemd[1]: Started Network Manager.",
  "[    1.480000] systemd[1]: Starting OpenSSH Server Daemon...",
  "[    1.560200] systemd[1]: Started OpenSSH Server Daemon.",
  "[    1.620500] systemd[1]: Starting GNOME Display Manager...",
  "[    1.800000] systemd[1]: Reached target Graphical Interface.",
  "[    2.000000] systemd[1]: Startup finished in 2.001s (kernel) + 1.337s (userspace) = 3.338s.",
];

function BootView({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((p) => [...p, BOOT_LINES[i]]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        i++;
      } else {
        clearInterval(t);
        setTimeout(() => onDoneRef.current(), 700);
      }
    }, 100);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="lnx-boot">
      <div className="lnx-boot-bar-top">
        <span className="lnx-boot-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="lnx-boot-lines" ref={scrollRef}>
        {lines.map((l, i) => (
          <p key={i} className="lnx-boot-line">{l}</p>
        ))}
        {lines.length < BOOT_LINES.length && <span className="lnx-boot-cursor">█</span>}
      </div>
      <div className="lnx-boot-footer">
        <span className="lnx-boot-pct">{progress}%</span>
        <span className="lnx-boot-label">Portfolio Linux 6.8.0 — Loading...</span>
      </div>
    </div>
  );
}

function DesktopView({ onClose }: { onClose: () => void }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lnx-desktop">
      {/* Top bar */}
      <div className="lnx-topbar">
        <span className="lnx-activities">Activities</span>
        <span className="lnx-topbar-center">Portfolio Linux</span>
        <div className="lnx-topbar-right">
          <span className="lnx-tray-item">🔊</span>
          <span className="lnx-tray-item">📶</span>
          <span className="lnx-clock">{time}</span>
          <button className="lnx-close-btn" onClick={onClose} title="Exit Linux">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Left dock */}
      <nav className="lnx-dock">
        {[
          { icon: <Folder size={22} />, label: "Files" },
          { icon: <Terminal size={22} />, label: "Terminal", active: true },
          { icon: <Globe size={22} />, label: "Firefox" },
          { icon: <FileText size={22} />, label: "Editor" },
          { icon: <Settings size={22} />, label: "Settings" },
        ].map(({ icon, label, active }) => (
          <div key={label} className={`lnx-dock-icon${active ? " lnx-dock-icon--active" : ""}`} title={label}>
            {icon}
          </div>
        ))}
      </nav>

      {/* Main workspace */}
      <div className="lnx-workspace">
        {/* Terminal window */}
        <div className="lnx-window">
          <div className="lnx-window-titlebar">
            <div className="lnx-window-dots">
              <span className="lnx-dot lnx-dot--close" />
              <span className="lnx-dot lnx-dot--min" />
              <span className="lnx-dot lnx-dot--max" />
            </div>
            <span className="lnx-window-title">riad@portfolio: ~</span>
          </div>
          <div className="lnx-terminal-body">
            <TypingTerminal />
          </div>
        </div>
      </div>
    </div>
  );
}

const TERMINAL_SEQUENCE = [
  { type: "cmd", text: "neofetch" },
  { type: "neofetch" },
  { type: "cmd", text: "cat skills.txt" },
  { type: "out", text: "React  Next.js  Three.js  TypeScript  Node.js  Python" },
  { type: "cmd", text: "cat about.txt" },
  { type: "out", text: "Hi! I'm Riad Sadiqov — Software Engineer.\nI build modern web apps and interactive 3D experiences." },
  { type: "cmd", text: "" },
] as const;

const NEOFETCH_ASCII = `        #####
       #######
       ##O#O##
       #######
     ###########
    #############
   ###############
   ####  #  ######`;

function TypingTerminal() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step >= TERMINAL_SEQUENCE.length) { setDone(true); return; }
    const item = TERMINAL_SEQUENCE[step];

    if (item.type === "neofetch") {
      const t = setTimeout(() => setStep((s) => s + 1), 600);
      return () => clearTimeout(t);
    }

    if (item.type === "cmd") {
      if (!item.text) { setDone(true); return; }
      let i = 0;
      setTyped("");
      const t = setInterval(() => {
        i++;
        setTyped(item.text.slice(0, i));
        if (i >= item.text.length) {
          clearInterval(t);
          setTimeout(() => setStep((s) => s + 1), 300);
        }
      }, 55);
      return () => clearInterval(t);
    }

    if (item.type === "out") {
      const t = setTimeout(() => setStep((s) => s + 1), 400);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [step, typed]);

  const rendered = TERMINAL_SEQUENCE.slice(0, step + 1);

  return (
    <div className="lnx-term-body" ref={bodyRef}>
      {rendered.map((item, idx) => {
        const isLast = idx === step;
        if (item.type === "cmd") {
          return (
            <p key={idx} className="lnx-term-row">
              <span className="lnx-prompt">riad@portfolio:~$</span>{" "}
              {isLast ? typed : item.text}
              {isLast && !done && <span className="lnx-cursor">█</span>}
            </p>
          );
        }
        if (item.type === "out" && idx < step) {
          return (
            <div key={idx} className="lnx-term-out">
              {item.text.split("\n").map((l, i) => <p key={i}>{l}</p>)}
            </div>
          );
        }
        if (item.type === "neofetch" && idx < step) {
          return (
            <div key={idx} className="lnx-neofetch">
              <pre className="lnx-neofetch-ascii">{NEOFETCH_ASCII}</pre>
              <div className="lnx-neofetch-info">
                <p><span className="lnx-nf-key">riad</span>@<span className="lnx-nf-key">portfolio</span></p>
                <p>-----------------</p>
                <p><span className="lnx-nf-key">OS:</span> Portfolio Linux 6.8.0</p>
                <p><span className="lnx-nf-key">Host:</span> Retro PC 1990s</p>
                <p><span className="lnx-nf-key">Kernel:</span> 6.8.0-portfolio</p>
                <p><span className="lnx-nf-key">Shell:</span> zsh 5.9</p>
                <p><span className="lnx-nf-key">User:</span> Riad Sadiqov</p>
                <p><span className="lnx-nf-key">Role:</span> Software Engineer</p>
                <p><span className="lnx-nf-key">Stack:</span> React · Next.js · Three.js</p>
                <p><span className="lnx-nf-key">Uptime:</span> Always ∞</p>
              </div>
            </div>
          );
        }
        return null;
      })}
      {done && (
        <p className="lnx-term-row">
          <span className="lnx-prompt">riad@portfolio:~$</span>{" "}
          <span className="lnx-cursor">█</span>
        </p>
      )}
    </div>
  );
}

/* ─── Main export ─── */
export default function LinuxOS({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<LinuxStage>("booting");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade in
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <div className={`lnx-overlay${visible ? " lnx-overlay--visible" : ""}`}>
      {stage === "booting" && <BootView onDone={() => setStage("desktop")} />}
      {stage === "desktop" && <DesktopView onClose={handleClose} />}
    </div>
  );
}
