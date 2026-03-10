"use client";

import { useState, useEffect } from "react";

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

const ICONS = ["icon_explorer.png", "icon_notepad.png", "icon_folder.png", "icon_mycomputer.png", "icon_mail.png"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");

  const [profile, setProfile] = useState<Profile>({
    name: "", role: "", bio: "", email: "", github: "", linkedin: "", skills: [],
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [status, setStatus] = useState("");

  const [newProject, setNewProject] = useState<Project>({
    id: "", name: "", description: "", stack: [{ label: "", value: "" }], github: "", icon: "icon_explorer.png",
  });
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        if (data.projects) setProjects(data.projects);
      });
  }, [authed]);

  const login = async () => {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({}),
    });
    if (res.status === 401) { setAuthError("Неверный пароль"); return; }
    sessionStorage.setItem("admin_pw", password);
    setAuthed(true);
    setAuthError("");
  };

  const apiHeaders = () => ({
    "Content-Type": "application/json",
    "x-admin-password": password,
  });

  const flash = (msg: string) => { setStatus(msg); setTimeout(() => setStatus(""), 3000); };

  // ── Profile save ──
  const saveProfile = async () => {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: apiHeaders(),
      body: JSON.stringify(profile),
    });
    flash(res.ok ? "✅ Профиль сохранён" : "❌ Ошибка");
  };

  // ── Skills ──
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    setNewSkill("");
  };
  const removeSkill = (i: number) =>
    setProfile({ ...profile, skills: profile.skills.filter((_, idx) => idx !== i) });

  // ── Projects ──
  const saveProject = async (p: Project) => {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: apiHeaders(),
      body: JSON.stringify(p),
    });
    flash(res.ok ? `✅ ${p.name} сохранён` : "❌ Ошибка");
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Удалить проект?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: apiHeaders() });
    if (res.ok) { setProjects(projects.filter((p) => p.id !== id)); flash("✅ Удалено"); }
  };

  const createProject = async () => {
    if (!newProject.id || !newProject.name) { flash("❌ Заполни id и name"); return; }
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      setProjects([...projects, newProject]);
      setNewProject({ id: "", name: "", description: "", stack: [{ label: "", value: "" }], github: "", icon: "icon_explorer.png" });
      setShowNewProject(false);
      flash("✅ Проект добавлен");
    } else flash("❌ Ошибка");
  };

  const updateProjectField = (idx: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    (updated[idx] as any)[field] = value;
    setProjects(updated);
  };

  const updateStackItem = (pIdx: number, sIdx: number, field: keyof StackItem, value: string) => {
    const updated = [...projects];
    updated[pIdx].stack[sIdx][field] = value;
    setProjects(updated);
  };

  const addStackItem = (pIdx: number) => {
    const updated = [...projects];
    updated[pIdx].stack = [...updated[pIdx].stack, { label: "", value: "" }];
    setProjects(updated);
  };

  const removeStackItem = (pIdx: number, sIdx: number) => {
    const updated = [...projects];
    updated[pIdx].stack = updated[pIdx].stack.filter((_, i) => i !== sIdx);
    setProjects(updated);
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-80">
          <h1 className="text-white text-2xl font-bold mb-6 text-center">Admin Panel</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded mb-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
          <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold">
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {status && <span className="text-sm bg-gray-700 px-3 py-1 rounded">{status}</span>}
        <button onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthed(false); }} className="text-sm text-gray-400 hover:text-white">
          Выйти
        </button>
      </div>

      {/* ── PROFILE ── */}
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">Профиль</h2>
        <div className="grid grid-cols-2 gap-3">
          {(["name", "role", "email", "github", "linkedin"] as const).map((field) => (
            <div key={field}>
              <label className="text-xs text-gray-400 uppercase mb-1 block">{field}</label>
              <input
                value={profile[field]}
                onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <label className="text-xs text-gray-400 uppercase mb-1 block">bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <label className="text-xs text-gray-400 uppercase mb-2 block">Skills</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.skills.map((s, i) => (
              <span key={i} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded text-sm">
                {s}
                <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-300 ml-1 font-bold leading-none">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Новый скилл..."
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm">+ Add</button>
          </div>
        </div>

        <button onClick={saveProfile} className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded font-bold">
          Сохранить профиль
        </button>
      </section>

      {/* ── PROJECTS ── */}
      <section className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-2">
          <h2 className="text-xl font-bold">Проекты</h2>
          <button onClick={() => setShowNewProject(!showNewProject)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
            + Новый проект
          </button>
        </div>

        {/* New project form */}
        {showNewProject && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h3 className="font-bold mb-3 text-blue-300">Новый проект</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {(["id", "name", "github"] as const).map((f) => (
                <div key={f}>
                  <label className="text-xs text-gray-400 uppercase mb-1 block">{f}</label>
                  <input
                    value={newProject[f]}
                    onChange={(e) => setNewProject({ ...newProject, [f]: e.target.value })}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">icon</label>
                <select
                  value={newProject.icon}
                  onChange={(e) => setNewProject({ ...newProject, icon: e.target.value })}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none"
                >
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 uppercase mb-1 block">description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={2}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none resize-none"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-xs text-gray-400 uppercase mb-2 block">Tech Stack</label>
              {newProject.stack.map((s, si) => (
                <div key={si} className="flex gap-2 mb-2">
                  <input placeholder="Label" value={s.label} onChange={(e) => { const st = [...newProject.stack]; st[si].label = e.target.value; setNewProject({ ...newProject, stack: st }); }} className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none" />
                  <input placeholder="Value" value={s.value} onChange={(e) => { const st = [...newProject.stack]; st[si].value = e.target.value; setNewProject({ ...newProject, stack: st }); }} className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none" />
                  <button onClick={() => setNewProject({ ...newProject, stack: newProject.stack.filter((_, i) => i !== si) })} className="text-red-400 px-2">×</button>
                </div>
              ))}
              <button onClick={() => setNewProject({ ...newProject, stack: [...newProject.stack, { label: "", value: "" }] })} className="text-blue-400 text-sm hover:underline">+ строка</button>
            </div>
            <div className="flex gap-2">
              <button onClick={createProject} className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-bold text-sm">Создать</button>
              <button onClick={() => setShowNewProject(false)} className="px-4 bg-gray-600 hover:bg-gray-500 rounded text-sm">Отмена</button>
            </div>
          </div>
        )}

        {/* Existing projects */}
        {projects.map((p, pIdx) => (
          <div key={p.id} className="bg-gray-700 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-2 gap-3 mb-3">
              {(["name", "github"] as const).map((f) => (
                <div key={f}>
                  <label className="text-xs text-gray-400 uppercase mb-1 block">{f}</label>
                  <input
                    value={p[f]}
                    onChange={(e) => updateProjectField(pIdx, f, e.target.value)}
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 uppercase mb-1 block">icon</label>
                <select
                  value={p.icon}
                  onChange={(e) => updateProjectField(pIdx, "icon", e.target.value)}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none"
                >
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 uppercase mb-1 block">description</label>
                <textarea
                  value={p.description}
                  onChange={(e) => updateProjectField(pIdx, "description", e.target.value)}
                  rows={2}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm outline-none resize-none"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-400 uppercase mb-2 block">Tech Stack</label>
              {p.stack.map((s, sIdx) => (
                <div key={sIdx} className="flex gap-2 mb-2">
                  <input placeholder="Label" value={s.label} onChange={(e) => updateStackItem(pIdx, sIdx, "label", e.target.value)} className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none" />
                  <input placeholder="Value" value={s.value} onChange={(e) => updateStackItem(pIdx, sIdx, "value", e.target.value)} className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none" />
                  <button onClick={() => removeStackItem(pIdx, sIdx)} className="text-red-400 hover:text-red-300 px-2 text-lg">×</button>
                </div>
              ))}
              <button onClick={() => addStackItem(pIdx)} className="text-blue-400 text-sm hover:underline">+ строка</button>
            </div>

            <div className="flex gap-2">
              <button onClick={() => saveProject(p)} className="flex-1 bg-green-600 hover:bg-green-700 py-1.5 rounded text-sm font-bold">Сохранить</button>
              <button onClick={() => deleteProject(p.id)} className="px-4 bg-red-700 hover:bg-red-600 rounded text-sm">Удалить</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
