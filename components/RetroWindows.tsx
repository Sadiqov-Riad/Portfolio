"use client";

import { useState, useEffect, useRef } from "react";
import { X, Code, Map, Mail, TerminalSquare, Github, Linkedin, Power } from "lucide-react";

type StackItem = { label: string; value: string };
type Project = {
  id: string;
  name: string;
  description: string;
  stack: StackItem[];
  github: string;
  icon: string;
};
type Profile = {
  name: string;
  role: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
};

export default function RetroWindows({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        if (data.projects) setProjects(data.projects);
      })
      .catch(console.error);
  }, []);
  const [bootStage, setBootStage] = useState(0); // 0 = start text, 1 = logo, 2 = desktop
  const isBooting = bootStage < 2;
  const [time, setTime] = useState("");
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const [positions, setPositions] = useState<Record<string, {x: number, y: number}>>({
    "About": { x: 50, y: 50 },
    "Projects": { x: 150, y: 100 },
    "Contact": { x: 250, y: 150 },
    "My Computer": { x: 100, y: 200 },
    "HabitForge": { x: 180, y: 130 },
    "CoffeeShop": { x: 200, y: 150 },
    "E_Wallet": { x: 220, y: 170 },
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [osFadeOut, setOsFadeOut] = useState(false);

  const handleShutdown = () => {
    setShutdownDialogOpen(false);
    setStartMenuOpen(false);
    setIsShuttingDown(true);
    setTimeout(() => {
      setOsFadeOut(true);
      setTimeout(() => {
        onClose();
      }, 500);
    }, 1000);
  };

  useEffect(() => {
    const stageTimer = setTimeout(() => {
      setBootStage(1);
      const audio = new Audio("https://upload.wikimedia.org/wikipedia/commons/e/e3/The_Microsoft_Sound.ogg");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }, 150);

    // Desktop
    const bootTimer = setTimeout(() => setBootStage(2), 1800);

    const tick = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(stageTimer);
      clearTimeout(bootTimer);
      clearInterval(id);
    };
  }, []);

  const toggleWindow = (name: string) => {
    if (!openWindows.includes(name)) {
      setOpenWindows([...openWindows, name]);
    }
    // Ensure position exists for dynamically loaded project windows
    if (!positions[name]) {
      setPositions((prev) => ({
        ...prev,
        [name]: { x: 160 + Math.random() * 80, y: 80 + Math.random() * 80 },
      }));
    }
    setActiveWindow(name);
  };

  const closeWindow = (name: string) => {
    setOpenWindows(openWindows.filter((w) => w !== name));
    if (activeWindow === name) {
      setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
    }
  };

  // Dragging logic
  const startDrag = (e: React.MouseEvent, name: string) => {
    setActiveWindow(name);
    setDragging(name);
    dragOffset.current = {
      x: e.clientX - positions[name].x,
      y: e.clientY - positions[name].y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPositions({
        ...positions,
        [dragging]: {
          x: Math.max(0, e.clientX - dragOffset.current.x),
          y: Math.max(0, e.clientY - dragOffset.current.y),
        },
      });
    }
  };

  const stopDrag = () => {
    setDragging(null);
  };

  const launchApp = (appName: string) => {
    alert(`Starting ${appName}...\n(In a real OS this would launch the app!)`);
  };

  if (isBooting) {
    if (bootStage === 0) {
      return (
        <div className="fixed inset-0 z-[200] bg-black text-gray-300 font-mono text-xl p-6 flex flex-col items-start justify-start cursor-wait" style={{ animation: 'win95-boot 0.3s ease-in-out' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.18) 3px, rgba(0, 0, 0, 0.18) 4px)" }} />
          <p>Starting Windows 95...</p>
          <div className="animate-pulse mt-1">_</div>
        </div>
      );
    }

    return (
      <div 
        className="fixed inset-0 z-[200] bg-black text-gray-300 font-mono flex flex-col items-center justify-center cursor-wait"
      >
        <style>{`
          @keyframes winBootBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
          .animate-win-boot {
            animation: winBootBar 2s linear infinite;
          }
        `}</style>
        
        {/* scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0, 0, 0, 0.18) 3px, rgba(0, 0, 0, 0.18) 4px)" }} />
        
        <div className="flex flex-col items-center z-10">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_95_logo.png" alt="Windows 95" className="h-[120px] md:h-[160px] drop-shadow-2xl" />
          <h1 className="text-white text-4xl md:text-6xl font-bold mt-6 tracking-tighter" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #222" }}>
            Microsoft<br/>Windows 95
          </h1>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[250px] h-5 border-2 border-[#555] bg-black p-[2px] overflow-hidden z-10">
          <div className="h-full w-1/3 bg-gradient-to-r from-blue-800 via-blue-400 to-blue-800 animate-win-boot" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="win95-os" 
      onMouseMove={onMouseMove} 
      onMouseUp={stopDrag} 
      onMouseLeave={stopDrag}
      style={{ opacity: osFadeOut ? 0 : 1, transition: 'opacity 0.8s ease-in-out' }}
    >
      {/* Desktop */}
      <div className="win95-desktop">
        <div className="win95-desktop-icon" onDoubleClick={() => toggleWindow("My Computer")}>
          <img src="/assets/icon_mycomputer.png" width={32} height={32} className="win95-icon-img" />
          <span>My Computer</span>
        </div>
        <div className="win95-desktop-icon" onDoubleClick={() => toggleWindow("Projects")}>
          <img src="/assets/icon_explorer.png" width={32} height={32} className="win95-icon-img" />
          <span>Projects</span>
        </div>
        <div className="win95-desktop-icon" onDoubleClick={() => toggleWindow("About")}>
          <img src="/assets/icon_notepad.png" width={32} height={32} className="win95-icon-img" />
          <span>About_Me.txt</span>
        </div>
        <div className="win95-desktop-icon" onDoubleClick={() => toggleWindow("Contact")}>
          <img src="/assets/icon_mail.png" width={32} height={32} className="win95-icon-img" />
          <span>Contact</span>
        </div>
        <div className="win95-desktop-icon">
          <img src="/assets/icon_recyclebin.png" width={32} height={32} className="win95-icon-img" />
          <span>Recycle Bin</span>
        </div>

      </div>

      {/* Windows */}
      {openWindows.includes("About") && (
        <div 
          className={`win95-window ${activeWindow === "About" ? "active" : ""}`} 
          onMouseDown={() => setActiveWindow("About")} 
          style={{ top: positions["About"].y, left: positions["About"].x, width: "350px", height: "300px" }}
        >
          <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "About")}>
            <span className="win95-title">
              <img src="/assets/icon_notepad.png" width={14} height={14} className="inline mr-1" /> About_Me.txt - Notepad
            </span>
            <button className="win95-close-btn" onClick={() => closeWindow("About")}>
              <X size={12} strokeWidth={3} />
            </button>
          </div>
          <div className="win95-menubar">
            <span>File</span><span>Edit</span><span>Search</span><span>Help</span>
          </div>
          <div className="win95-window-content bg-white text-black p-3 font-mono text-sm overflow-y-auto">
            <p className="font-bold"># {profile?.name ?? "Riad Sadiqov"}</p>
            <p>=================</p>
            <p className="mt-2">{profile?.bio ?? "Software Engineer focused on building web and mobile products."}</p>
            <br />
            <p>&gt; SPECIALTIES:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {(profile?.skills ?? ["React","Python","Django","ASP.NET","C++","C#","SQL","Docker","AWS","Git"]).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <br />
            <p>&gt; STATUS: Open to new opportunities.</p>
            <p>&gt; FOCUS: Full-stack and mobile development.</p>
          </div>
        </div>
      )}

      {openWindows.includes("Projects") && (
        <div 
          className={`win95-window ${activeWindow === "Projects" ? "active" : ""}`} 
          onMouseDown={() => setActiveWindow("Projects")} 
          style={{ top: positions["Projects"].y, left: positions["Projects"].x, width: "450px", height: "280px" }}
        >
          <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "Projects")}>
            <span className="win95-title">
              <img src="/assets/icon_explorer.png" width={14} height={14} className="inline mr-1" /> C:\Projects
            </span>
            <button className="win95-close-btn" onClick={() => closeWindow("Projects")}>
              <X size={12} strokeWidth={3} />
            </button>
          </div>
          <div className="win95-window-content bg-white text-black p-4 flex gap-6 flex-wrap content-start">
              {projects.map((p) => (
                <div key={p.id} className="win95-file-icon" onDoubleClick={() => toggleWindow(p.id)}>
                  <img src={`/assets/${p.icon}`} width={36} height={36} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      
        {projects.map((p) =>
          openWindows.includes(p.id) && positions[p.id] ? (
            <div
              key={p.id}
              className={`win95-window ${activeWindow === p.id ? "active" : ""}`}
              onMouseDown={() => setActiveWindow(p.id)}
              style={{ top: positions[p.id].y, left: positions[p.id].x, width: "380px", height: "300px" }}
            >
              <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, p.id)}>
                <span className="win95-title">
                  <Code size={14} className="inline mr-1 text-blue-200" /> {p.name}
                </span>
                <button className="win95-close-btn" onClick={() => closeWindow(p.id)}>
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
              <div className="win95-window-content bg-white text-black p-4 text-sm overflow-y-auto">
                <img src={`/assets/${p.icon}`} width={32} height={32} className="float-right ml-4 mb-4" />
                <h2 className="text-xl font-bold mb-2">{p.name}</h2>
                <p className="mb-3">{p.description}</p>
                <h3 className="font-bold mt-2">TECH STACK:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {p.stack.map((s) => (
                    <li key={s.label}><strong>{s.label}:</strong> {s.value}</li>
                  ))}
                </ul>
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline flex items-center gap-1 mt-4 hover:text-blue-800">
                  <Github size={16} /> View on GitHub
                </a>
              </div>
            </div>
          ) : null
        )}

        {openWindows.includes("Contact") && (
        <div 
          className={`win95-window ${activeWindow === "Contact" ? "active" : ""}`} 
          onMouseDown={() => setActiveWindow("Contact")} 
          style={{ top: positions["Contact"].y, left: positions["Contact"].x, width: "380px", height: "240px" }}
        >
          <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "Contact")}>
            <span className="win95-title">
              <Mail size={14} className="inline mr-1 text-blue-200" /> Outlook Express - Contact
            </span>
            <button className="win95-close-btn" onClick={() => closeWindow("Contact")}>
              <X size={12} strokeWidth={3} />
            </button>
          </div>
          <div className="win95-menubar">
            <span>File</span><span>Edit</span><span>View</span><span>Tools</span><span>Message</span><span>Help</span>
          </div>
          <div className="win95-window-content bg-gray-200 p-2 text-black text-sm flex flex-col gap-2">
            <div className="flex bg-white border border-gray-400 p-1 px-2 items-center">
              <span className="text-gray-500 w-12">To:</span> <span className="font-bold">{profile?.email ?? "sadiqovriad2@gmail.com"}</span>
            </div>
            <div className="flex bg-white border border-gray-400 p-1 px-2 items-center">
              <span className="text-gray-500 w-12">Subj:</span> <span>Let's talk about a project!</span>
            </div>
            <div className="bg-white border border-gray-400 p-2 flex-1 flex flex-col gap-4">
              <p>You can find me on the internet here:</p>
              <div className="flex gap-4">
                <a href={profile?.github ?? "https://github.com/Sadiqov-Riad"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline">
                  <Github size={16} /> GitHub
                </a>
                <a href={profile?.linkedin ?? "https://www.linkedin.com/in/riad-sadiqov-93a600329"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline">
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {openWindows.includes("My Computer") && (
        <div 
          className={`win95-window ${activeWindow === "My Computer" ? "active" : ""}`} 
          onMouseDown={() => setActiveWindow("My Computer")} 
          style={{ top: positions["My Computer"].y, left: positions["My Computer"].x, width: "350px", height: "200px" }}
        >
          <div className="win95-titlebar" onMouseDown={(e) => startDrag(e, "My Computer")}>
            <span className="win95-title">
              <img src="/assets/icon_mycomputer.png" width={14} height={14} className="inline mr-1" /> My Computer
            </span>
            <button className="win95-close-btn" onClick={() => closeWindow("My Computer")}>
              <X size={12} strokeWidth={3} />
            </button>
          </div>
          <div className="win95-menubar">
            <span>File</span><span>Edit</span><span>View</span><span>Help</span>
          </div>
          <div className="win95-window-content bg-white text-black p-4 flex gap-6">
            <div className="win95-file-icon">
              <div className="text-2xl font-bold flex items-center justify-center border-2 border-gray-400 w-12 h-10 mb-1">C:</div>
              <span>Local Disk (C:)</span>
            </div>
            <div className="win95-file-icon">
              <div className="text-2xl font-bold flex items-center justify-center border-2 border-gray-400 w-12 h-10 mb-1 bg-blue-100 flex-col leading-none">
                <div className="h-1 bg-black w-4 mb-1"></div>
                --
              </div>
              <span>Floppy (A:)</span>
            </div>
          </div>
        </div>
      )}

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="win95-start-menu" onClick={(e) => e.stopPropagation()}>
          <div className="win95-start-menu-sidebar">
            <span>Windows 95</span>
          </div>
          <div className="win95-start-menu-items">
            <button className="win95-start-menu-item" onClick={() => { toggleWindow("Projects"); setStartMenuOpen(false); }}>
              <img src="/assets/icon_explorer.png" width={18} height={18} />
              <span>Programs</span>
            </button>
            <button className="win95-start-menu-item" onClick={() => { toggleWindow("About"); setStartMenuOpen(false); }}>
              <img src="/assets/icon_notepad.png" width={18} height={18} />
              <span>Documents</span>
            </button>
            <button className="win95-start-menu-item" onClick={() => { toggleWindow("My Computer"); setStartMenuOpen(false); }}>
              <img src="/assets/icon_mycomputer.png" width={18} height={18} />
              <span>Settings</span>
            </button>
            <button className="win95-start-menu-item" onClick={() => { toggleWindow("My Computer"); setStartMenuOpen(false); }}>
              <img src="/assets/icon_settings.png" width={18} height={18} />
              <span>My Computer</span>
            </button>
            <div className="win95-start-menu-divider" />
            <button className="win95-start-menu-item win95-shutdown-item" onClick={() => { setShutdownDialogOpen(true); setStartMenuOpen(false); }}>
              <Power size={18} color="#ef4444" />
              <span>Shut Down...</span>
            </button>
          </div>
        </div>
      )}

      {/* Shutdown Dialog */}
      {shutdownDialogOpen && (
        <div className="win95-shutdown-overlay" onClick={() => setShutdownDialogOpen(false)}>
          <div className="win95-window win95-shutdown-dialog" onClick={(e) => e.stopPropagation()} style={{ position: "relative", top: 0, left: 0, width: "340px", height: "auto" }}>
            <div className="win95-titlebar">
              <span className="win95-title"><Power size={13} className="inline mr-1" /> Shut Down Windows</span>
              <button className="win95-close-btn" onClick={() => setShutdownDialogOpen(false)}><X size={12} strokeWidth={3} /></button>
            </div>
            <div className="win95-window-content bg-[#c0c0c0] text-black p-4 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <img src="/assets/icon_mycomputer.png" width={48} height={48} />
                <div>
                  <p className="font-bold text-sm">What do you want the computer to do?</p>
                  <div className="mt-2 flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" name="shutdown" defaultChecked /> Shut down
                    </label>

                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button className="win95-dialog-btn" onClick={handleShutdown}><b>OK</b></button>
                <button className="win95-dialog-btn" onClick={() => setShutdownDialogOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shutdown screen */}
      {isShuttingDown && (
        <div className="win95-shutdown-screen">
          <p>It is now safe to turn off<br />your computer.</p>
        </div>
      )}

      {/* Taskbar */}
      <div className="win95-taskbar" onClick={() => startMenuOpen && setStartMenuOpen(false)}>
        <button
          className={`win95-start-btn ${startMenuOpen ? "active" : ""}`}
          onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen); }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_95_logo.png" alt="Win95" className="h-4 mr-1" />
          <b>Start</b>
        </button>
        <div className="win95-taskbar-tasks">
          {openWindows.map((win) => (
            <button
              key={win}
              className={`win95-task-btn ${activeWindow === win ? "active" : ""}`}
              onClick={() => setActiveWindow(win)}
            >
              {win}
            </button>
          ))}
        </div>
        <div className="win95-tray">
          <div className="win95-tray-icons">
            <span className="text-xs">ENG</span>
          </div>
          <span className="win95-clock">{time}</span>
        </div>
      </div>
    </div>
  );
}

