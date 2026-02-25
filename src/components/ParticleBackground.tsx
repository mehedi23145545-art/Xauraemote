import { useMemo } from "react";

export default function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      color: i % 3 === 0 ? "var(--neon-green)" : i % 3 === 1 ? "var(--neon-magenta)" : "var(--neon-cyan)",
    })), []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: `hsl(${p.color})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px hsl(${p.color} / 0.6)`,
          }}
        />
      ))}
    </div>
  );
}
