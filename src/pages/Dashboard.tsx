import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmotes, getServerApis, setAuth, isAuthenticated } from "@/store/appStore";
import { getEmoteCdnUrl, BOT_TEAM_CODES } from "@/data/emotes";
import ParticleBackground from "@/components/ParticleBackground";
import { toast } from "sonner";
import { Copy, Send, LogOut, Gamepad2, Search } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const [teamCode, setTeamCode] = useState("");
  const [uids, setUids] = useState(["", "", "", "", "", ""]);
  const [manualEmoteId, setManualEmoteId] = useState("");
  const [server, setServer] = useState("India");
  const [sending, setSending] = useState(false);
  const [searchEmote, setSearchEmote] = useState("");

  const allEmotes = getAllEmotes();
  const apis = getServerApis();
  const serverNames = Object.keys(apis);

  const filteredEmotes = searchEmote
    ? allEmotes.filter((id) => id.includes(searchEmote))
    : allEmotes;

  const setUid = (index: number, val: string) => {
    const copy = [...uids];
    copy[index] = val;
    setUids(copy);
  };

  const buildUrl = (apiBase: string, tc: string, emoteId: string) => {
    const params = new URLSearchParams({
      tc,
      uid1: uids[0], uid2: uids[1], uid3: uids[2],
      uid4: uids[3], uid5: uids[4], uid6: uids[5],
      emote_id: emoteId,
    });
    return `${apiBase}?${params.toString()}`;
  };

  const sendEmote = useCallback(async (emoteId: string) => {
    if (!teamCode.trim()) { toast.error("Enter Team Code!"); return; }
    if (uids.every((u) => !u.trim())) { toast.error("Enter at least one UID!"); return; }

    setSending(true);
    const apiBase = apis[server] || Object.values(apis)[0];

    try {
      const url1 = buildUrl(apiBase, teamCode, emoteId);
      await fetch(url1, { mode: "no-cors" });

      const url2 = buildUrl(apiBase, BOT_TEAM_CODES[0], emoteId);
      await fetch(url2, { mode: "no-cors" });

      await new Promise((r) => setTimeout(r, 2000));
      const url3 = buildUrl(apiBase, BOT_TEAM_CODES[1], emoteId);
      await fetch(url3, { mode: "no-cors" });

      toast.success(`Emote ${emoteId} sent! ✅`);
    } catch {
      toast.error("Failed to send emote.");
    } finally {
      setSending(false);
    }
  }, [teamCode, uids, server, apis]);

  if (!auth) {
    navigate("/");
    return null;
  }

  const handleManualSend = () => {
    if (!manualEmoteId.trim()) { toast.error("Enter an Emote ID!"); return; }
    sendEmote(manualEmoteId.trim());
  };

  const copyEmoteId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied: ${id}`);
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      {/* Header */}
      <header className="sticky top-0 z-30 glass-panel rounded-none border-x-0 border-t-0 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-primary" />
            <h1 className="font-display text-xl font-bold text-primary neon-text-green tracking-wider">
              DASHBOARD <span className="text-secondary">by STAR FF</span>
            </h1>
          </div>
          <button
            onClick={() => { setAuth(null); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors font-body"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">
        {/* Input Panel */}
        <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="font-display text-lg font-semibold text-primary mb-4">CONFIGURATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Team Code</label>
              <input value={teamCode} onChange={(e) => setTeamCode(e.target.value)} placeholder="Team Code"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            {uids.map((uid, i) => (
              <div key={i}>
                <label className="text-sm text-muted-foreground mb-1 block">UID {i + 1}</label>
                <input value={uid} onChange={(e) => setUid(i, e.target.value)} placeholder={`UID ${i + 1}`}
                  className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            ))}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Server</label>
              <select value={server} onChange={(e) => setServer(e.target.value)}
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                {serverNames.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Manual Send */}
          <div className="mt-4 flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1 block">Manual Emote ID</label>
              <input value={manualEmoteId} onChange={(e) => setManualEmoteId(e.target.value)} placeholder="Enter Emote ID"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            <button onClick={handleManualSend} disabled={sending}
              className="gradient-btn px-6 py-2.5 rounded-lg text-primary-foreground flex items-center gap-2 disabled:opacity-50">
              <Send className="w-4 h-4" /> SEND
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="glass-panel p-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input value={searchEmote} onChange={(e) => setSearchEmote(e.target.value)} placeholder="Search emotes..."
              className="w-full pl-11 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
        </div>

        {/* Emote Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-display text-lg font-semibold text-primary mb-3">
            EMOTES <span className="text-muted-foreground text-sm font-body">({filteredEmotes.length})</span>
          </h2>
          {sending && (
            <div className="glass-panel p-3 mb-4 flex items-center gap-3 neon-glow-magenta">
              <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              <span className="text-secondary font-body">Sending emote...</span>
            </div>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
            {filteredEmotes.map((id) => (
              <div key={id} className="emote-card group relative flex flex-col items-center" onClick={() => sendEmote(id)}>
                <img
                  src={getEmoteCdnUrl(id)}
                  alt={`Emote ${id}`}
                  className="w-full aspect-square object-contain rounded"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); copyEmoteId(id); }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-muted/80"
                  title="Copy ID"
                >
                  <Copy className="w-3 h-3 text-foreground" />
                </button>
                <span className="text-[10px] text-muted-foreground mt-1 truncate w-full text-center">{id}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
