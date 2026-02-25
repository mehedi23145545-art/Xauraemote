import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPassword, getAdminPassword, setAuth, isMaintenance } from "@/store/appStore";
import ParticleBackground from "@/components/ParticleBackground";
import { toast } from "sonner";
import { Lock, Shield, Gamepad2 } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const trimmed = password.trim();
      if (trimmed === getAdminPassword()) {
        setAuth("admin");
        toast.success("Welcome, Admin! 🔥");
        navigate("/admin");
      } else if (trimmed === getUserPassword()) {
        if (isMaintenance()) {
          toast.error("Server is under maintenance. Try again later.");
          setLoading(false);
          return;
        }
        setAuth("user");
        toast.success("Login successful! ⚡");
        navigate("/dashboard");
      } else {
        toast.error("Invalid password!");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />
      <div className="glass-panel p-8 w-full max-w-md mx-4 relative z-10 animate-fade-in-up" style={{ animationDuration: "0.6s" }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 mb-4 neon-glow-green">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary neon-text-green tracking-wider">
            STAR FF
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Emote Web Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full pl-11 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-body text-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn w-full py-3 rounded-lg text-primary-foreground font-display font-semibold tracking-widest disabled:opacity-50 transition-opacity"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          <span>Secured by STAR</span>
        </div>
      </div>
    </div>
  );
}
