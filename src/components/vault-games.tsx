import { useEffect, useRef, useState } from "react";

/* ================= LIFE SIM (original, BitLife-style) ================= */
type Life = {
  name: string; age: number; health: number; happy: number; smarts: number; looks: number;
  money: number; job: string | null; salary: number; alive: boolean; log: string[];
};
const names = ["Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan", "Avery", "Quinn"];
const jobs = [
  { t: "Barista", s: 22000, need: 0 }, { t: "Librarian", s: 41000, need: 40 },
  { t: "Engineer", s: 85000, need: 70 }, { t: "Doctor", s: 160000, need: 85 },
];
const r = (n: number) => Math.floor(Math.random() * n);
const clamp = (v: number) => Math.max(0, Math.min(100, v));
function newLife(): Life {
  const name = names[r(names.length)] ?? "Alex";
  return { name, age: 0, health: 70 + r(30), happy: 60 + r(40), smarts: r(100), looks: r(100),
    money: 0, job: null, salary: 0, alive: true, log: [`Age 0: You were born as ${name}.`] };
}
const events = [
  (l: Life) => { l.happy = clamp(l.happy + 10); return "You made a new best friend."; },
  (l: Life) => { l.health = clamp(l.health - 15); return "You caught a nasty flu."; },
  (l: Life) => { l.money += 500; return "You found $500 on the street!"; },
  (l: Life) => { l.happy = clamp(l.happy - 12); return "Your pet goldfish passed away."; },
  (l: Life) => { l.smarts = clamp(l.smarts + 6); return "You read a great book at Literary Haven."; },
];

export function LifeSim() {
  const [l, setL] = useState<Life>(newLife);
  const act = (fn: (x: Life) => string | void) => setL((p) => {
    if (!p.alive) return p;
    const x = { ...p, log: [...p.log] };
    const m = fn(x); if (m) x.log.unshift(`Age ${x.age}: ${m}`);
    return x;
  });
  const ageUp = () => act((x) => {
    x.age++; x.money += x.salary;
    if (x.age > 50) x.health = clamp(x.health - r(6));
    if (Math.random() < 0.35) { const e = events[r(events.length)]; if (e) x.log.unshift(`Age ${x.age}: ${e(x)}`); }
    if (x.health <= 0 || (x.age > 70 && Math.random() < (x.age - 70) / 40)) {
      x.alive = false; return `You died at age ${x.age} with $${x.money.toLocaleString()}.`;
    }
    return x.age === 18 ? "You graduated high school!" : "You aged a year.";
  });
  const bar = (k: string, v: number) => (
    <div className="flex items-center gap-2 text-xs"><span className="w-14">{k}</span>
      <div className="flex-1 h-2 bg-muted rounded"><div className="h-2 rounded bg-primary" style={{ width: `${v}%` }} /></div><span className="w-8 text-right">{v}%</span></div>
  );
  const btn = "px-3 py-2 rounded bg-secondary text-secondary-foreground text-sm hover:opacity-80 disabled:opacity-40";
  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="text-2xl font-serif">{l.name}, {l.age}</h3>
        <span className="text-sm">${l.money.toLocaleString()} · {l.job ?? "No job"}</span>
      </div>
      <div className="space-y-1">{bar("Health", l.health)}{bar("Happy", l.happy)}{bar("Smarts", l.smarts)}{bar("Looks", l.looks)}</div>
      <div className="flex flex-wrap gap-2">
        <button className={btn} disabled={l.age < 5} onClick={() => act((x) => { x.smarts = clamp(x.smarts + 4); return "You studied hard."; })}>Study</button>
        <button className={btn} onClick={() => act((x) => { x.health = clamp(x.health + 5); x.looks = clamp(x.looks + 2); return "You hit the gym."; })}>Gym</button>
        <button className={btn} disabled={l.money < 200} onClick={() => act((x) => { x.money -= 200; x.happy = clamp(x.happy + 10); return "You went on vacation."; })}>Vacation $200</button>
        <button className={btn} disabled={l.age < 18} onClick={() => act((x) => {
          const ok = jobs.filter((j) => x.smarts >= j.need); const j = ok[ok.length - 1];
          if (!j || Math.random() < 0.3) return "Your job application was rejected.";
          x.job = j.t; x.salary = j.s; return `You were hired as a ${j.t} ($${j.s.toLocaleString()}/yr).`;
        })}>Find job</button>
        <button className={btn} disabled={l.age < 18 || l.money < 100} onClick={() => act((x) => {
          x.money -= 100; if (Math.random() < 0.02) { x.money += 1000000; return "You WON the lottery! +$1,000,000"; } return "Lottery ticket lost. -$100";
        })}>Lottery $100</button>
      </div>
      {l.alive
        ? <button onClick={ageUp} className="w-full py-3 rounded bg-primary text-primary-foreground font-bold">Age +1</button>
        : <button onClick={() => setL(newLife())} className="w-full py-3 rounded bg-destructive text-destructive-foreground font-bold">New life</button>}
      <ul className="h-40 overflow-y-auto text-sm space-y-1 border rounded p-2">{l.log.map((m, i) => <li key={i}>{m}</li>)}</ul>
    </div>
  );
}

/* ================= MOTO STUNT (original, Moto X3M-style) ================= */
type Lv = { name: string; pts: [number, number][] };
const levels: Lv[] = [
  { name: "Level 1: Warm Up", pts: [[0, 300], [400, 300], [600, 220], [650, 220], [800, 320], [1100, 320], [1300, 200], [1340, 200], [1600, 330], [2000, 330]] },
  { name: "Level 2: Big Air", pts: [[0, 300], [300, 300], [550, 160], [580, 160], [900, 340], [1100, 340], [1250, 250], [1450, 340], [1700, 300], [1900, 150], [1930, 150], [2300, 340], [2700, 340]] },
  { name: "Level 3: Canyon", pts: [[0, 250], [350, 250], [600, 120], [640, 120], [1000, 380], [1200, 380], [1350, 300], [1500, 380], [1700, 380], [1950, 140], [1990, 140], [2350, 360], [2600, 280], [2800, 360], [3300, 360]] },
];
function groundAt(pts: [number, number][], x: number): { y: number; a: number } {
  for (let i = 0; i < pts.length - 1; i++) {
    const p = pts[i]!, q = pts[i + 1]!;
    if (x >= p[0] && x <= q[0]) {
      const t = (x - p[0]) / (q[0] - p[0]);
      return { y: p[1] + (q[1] - p[1]) * t, a: Math.atan2(q[1] - p[1], q[0] - p[0]) };
    }
  }
  return { y: 1000, a: 0 };
}

export function MotoStunt() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [lvl, setLvl] = useState(0);
  const [status, setStatus] = useState<"ride" | "crash" | "win">("ride");
  const [run, setRun] = useState(0);
  const [flips, setFlips] = useState(0);

  useEffect(() => {
    const c = cv.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const L = levels[lvl]!; const end = L.pts[L.pts.length - 1]![0] - 100;
    const keys: Record<string, boolean> = {};
    const kd = (e: KeyboardEvent) => { if (e.key.startsWith("Arrow")) e.preventDefault(); keys[e.key] = true; };
    const ku = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const b = { x: 60, y: 280, vx: 0, vy: 0, ang: 0, av: 0, ground: true, spin: 0, flips: 0 };
    let done = false; let raf = 0; const t0 = performance.now();
    const step = () => {
      if (!done) {
        const g = groundAt(L.pts, b.x);
        if (b.ground) {
          if (keys.ArrowUp) b.vx += 0.25; if (keys.ArrowDown) b.vx -= 0.3;
          b.vx += Math.sin(g.a) * 0.15; b.vx *= 0.99; b.vx = Math.max(-3, Math.min(11, b.vx));
          const nx = b.x + b.vx; const ng = groundAt(L.pts, nx);
          // launch off crests: if new ground drops steeper than trajectory
          if (ng.y - g.y > Math.abs(b.vx) * Math.tan(g.a) + 2 && b.vx > 4) {
            b.ground = false; b.vy = Math.tan(g.a) * b.vx; b.x = nx;
          } else { b.x = nx; b.y = ng.y; b.ang = ng.a; }
        } else {
          b.vy += 0.35; b.x += b.vx; b.y += b.vy;
          if (keys.ArrowLeft) b.av -= 0.012; if (keys.ArrowRight) b.av += 0.012;
          b.av *= 0.97; b.ang += b.av; b.spin += b.av;
          const ng = groundAt(L.pts, b.x);
          if (b.y >= ng.y) {
            let d = (b.ang - ng.a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2;
            if (Math.abs(d) > 0.7) { done = true; setStatus("crash"); }
            else {
              const f = Math.floor(Math.abs(b.spin) / (Math.PI * 2) + 0.15); if (f > 0) { b.flips += f; setFlips(b.flips); }
              b.ground = true; b.y = ng.y; b.ang = ng.a; b.av = 0; b.spin = 0;
            }
          }
        }
        if (b.y > 600) { done = true; setStatus("crash"); }
        if (b.x >= end) { done = true; setStatus("win"); }
      }
      // draw
      const W = c.width, H = c.height, cam = b.x - 200;
      const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#1e3a8a"); sky.addColorStop(1, "#f59e0b");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(-cam, 0);
      ctx.beginPath(); ctx.moveTo(L.pts[0]![0], H);
      for (const p of L.pts) ctx.lineTo(p[0], p[1]);
      ctx.lineTo(L.pts[L.pts.length - 1]![0], H); ctx.closePath();
      ctx.fillStyle = "#3f2a14"; ctx.fill(); ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 6; ctx.stroke();
      const fy = groundAt(L.pts, end).y;
      ctx.fillStyle = "#fff"; ctx.fillRect(end, fy - 70, 4, 70);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { ctx.fillStyle = (i + j) % 2 ? "#000" : "#fff"; ctx.fillRect(end + 4 + i * 8, fy - 70 + j * 8, 8, 8); }
      // bike
      ctx.translate(b.x, b.y); ctx.rotate(b.ang);
      ctx.strokeStyle = "#111"; ctx.lineWidth = 4;
      for (const wx of [-18, 18]) { ctx.beginPath(); ctx.arc(wx, -10, 10, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = "#ef4444"; ctx.fillRect(-16, -26, 32, 10);
      ctx.fillStyle = "#facc15"; ctx.beginPath(); ctx.arc(-2, -40, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#111"; ctx.beginPath(); ctx.moveTo(-2, -33); ctx.lineTo(-6, -24); ctx.moveTo(-2, -33); ctx.lineTo(14, -28); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "#fff"; ctx.font = "14px monospace";
      ctx.fillText(`${L.name}   Time ${((performance.now() - t0) / 1000).toFixed(1)}s   Flips ${b.flips}`, 12, 22);
      if (!done) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [lvl, run]);

  const restart = () => { setStatus("ride"); setFlips(0); setRun((n) => n + 1); };
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex gap-2">
        {levels.map((lv, i) => (
          <button key={i} onClick={() => { setLvl(i); restart(); }} className={`px-3 py-1 rounded text-xs ${i === lvl ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>Lv {i + 1}</button>
        ))}
      </div>
      <div className="relative">
        <canvas ref={cv} width={800} height={400} className="rounded max-w-full" />
        {status !== "ride" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 rounded">
            <p className="text-2xl font-bold">{status === "win" ? `Finished! ${flips} flips` : "Crashed!"}</p>
            <div className="flex gap-2">
              <button onClick={restart} className="px-4 py-2 rounded bg-secondary">Retry</button>
              {status === "win" && lvl < levels.length - 1 && (
                <button onClick={() => { setLvl(lvl + 1); restart(); }} className="px-4 py-2 rounded bg-primary text-primary-foreground">Next level</button>
              )}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs opacity-70">↑ gas · ↓ brake · ← → flip in the air · land on your wheels!</p>
    </div>
  );
}
