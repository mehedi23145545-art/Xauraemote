import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAuthenticated, setAuth, isMaintenance, setMaintenance,
  getUserPassword, setUserPassword, addCustomEmote, getCustomEmotes,
  getServerApis, setServerApis,
} from "@/store/appStore";
import ParticleBackground from "@/components/ParticleBackground";
import { toast } from "sonner";
import { Shield, LogOut, Plus, Trash2, Save, Power, Key, Globe, Gamepad2 } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const auth = isAuthenticated();

  const [maintenance, setMaintenanceState] = useState(isMaintenance());
  const [newPassword, setNewPassword] = useState(getUserPassword());
  const [newEmoteId, setNewEmoteId] = useState("");
  const [customEmotes, setCustomEmotesState] = useState(getCustomEmotes());
  const [apis, setApisState] = useState(getServerApis());
  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");

  if (auth !== "admin") {
    navigate("/");
    return null;
  }

  const toggleMaintenance = () => {
    const next = !maintenance;
    setMaintenanceState(next);
    setMaintenance(next);
    toast.success(next ? "Maintenance ON 🔧" : "Maintenance OFF ✅");
  };

  const savePassword = () => {
    if (newPassword.trim().length < 3) { toast.error("Password too short"); return; }
    setUserPassword(newPassword.trim());
    toast.success("User password updated!");
  };

  const handleAddEmote = () => {
    const id = newEmoteId.trim();
    if (!id) { toast.error("Enter an Emote ID"); return; }
    addCustomEmote(id);
    setCustomEmotesState(getCustomEmotes());
    setNewEmoteId("");
    toast.success(`Emote ${id} added!`);
  };

  const addApi = () => {
    if (!newServerName.trim() || !newServerUrl.trim()) { toast.error("Fill both fields"); return; }
    const updated = { ...apis, [newServerName.trim()]: newServerUrl.trim() };
    setApisState(updated);
    setServerApis(updated);
    setNewServerName("");
    setNewServerUrl("");
    toast.success("API added!");
  };

  const removeApi = (name: string) => {
    const updated = { ...apis };
    delete updated[name];
    setApisState(updated);
    setServerApis(updated);
    toast.success(`${name} API removed`);
  };

  const updateApiUrl = (name: string, url: string) => {
    const updated = { ...apis, [name]: url };
    setApisState(updated);
    setServerApis(updated);
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      <header className="sticky top-0 z-30 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-secondary" />
            <h1 className="font-display text-xl font-bold text-secondary neon-text-magenta tracking-wider">
              ADMIN DASHBOARD <span className="text-primary">by STAR</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { navigate("/dashboard"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors font-body">
              <Gamepad2 className="w-4 h-4" /> Dashboard
            </button>
            <button onClick={() => { setAuth(null); navigate("/"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors font-body">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto p-4 space-y-6">
        {/* Maintenance */}
        <div className="glass-panel p-6 animate-fade-in-up">
          <h2 className="font-display text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Power className="w-5 h-5" /> MAINTENANCE MODE
          </h2>
          <button onClick={toggleMaintenance}
            className={`px-6 py-3 rounded-lg font-display font-semibold tracking-wider transition-all ${maintenance ? "gradient-btn-magenta text-secondary-foreground neon-glow-magenta" : "gradient-btn text-primary-foreground neon-glow-green"}`}>
            {maintenance ? "⚠️ MAINTENANCE ON" : "✅ MAINTENANCE OFF"}
          </button>
        </div>

        {/* Password */}
        <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" /> USER PASSWORD
          </h2>
          <div className="flex gap-3">
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
            <button onClick={savePassword} className="gradient-btn-magenta px-6 py-2.5 rounded-lg text-secondary-foreground flex items-center gap-2">
              <Save className="w-4 h-4" /> SAVE
            </button>
          </div>
        </div>

        {/* Add Emotes */}
        <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="font-display text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> ADD EMOTES
          </h2>
          <div className="flex gap-3 mb-4">
            <input value={newEmoteId} onChange={(e) => setNewEmoteId(e.target.value)} placeholder="Emote ID"
              className="flex-1 px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
            <button onClick={handleAddEmote} className="gradient-btn-magenta px-6 py-2.5 rounded-lg text-secondary-foreground flex items-center gap-2">
              <Plus className="w-4 h-4" /> ADD
            </button>
          </div>
          {customEmotes.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Custom emotes: {customEmotes.join(", ")}
            </div>
          )}
        </div>

        {/* API Management */}
        <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" /> API MANAGEMENT
          </h2>
          <div className="space-y-3 mb-4">
            {Object.entries(apis).map(([name, url]) => (
              <div key={name} className="flex gap-3 items-center">
                <span className="font-display text-sm text-primary w-28 shrink-0">{name}</span>
                <input value={url} onChange={(e) => updateApiUrl(name, e.target.value)}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
                <button onClick={() => removeApi(name)} className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/40 text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input value={newServerName} onChange={(e) => setNewServerName(e.target.value)} placeholder="Server Name"
              className="w-40 px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
            <input value={newServerUrl} onChange={(e) => setNewServerUrl(e.target.value)} placeholder="API URL"
              className="flex-1 px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all" />
            <button onClick={addApi} className="gradient-btn-magenta px-6 py-2.5 rounded-lg text-secondary-foreground flex items-center gap-2">
              <Plus className="w-4 h-4" /> ADD
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
