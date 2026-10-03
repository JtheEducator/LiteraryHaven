import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/vault")({
  head: () => ({
    meta: [
      { title: "The Vault — Literary Haven" },
      { name: "description", content: "A hidden arcade inside Literary Haven." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "The Vault — Literary Haven" },
      { property: "og:description", content: "A hidden arcade inside Literary Haven." },
    ],
  }),
  component: Vault,
});

type G = { id: string; name: string; cat: string; h: number };
const games: G[] = [
  { id: "snake", name: "Snake", cat: "Classic", h: 145 },
  { id: "clicker", name: "Cookie Clicker", cat: "Idle", h: 60 },
  { id: "reaction", name: "Reaction Test", cat: "Skill", h: 20 },
  { id: "math", name: "Math Rush", cat: "Brain", h: 220 },
];

function Vault() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [play, setPlay] = useState<G | null>(null);
  const [cat, setCat] = useState("All");
  useEffect(() => setOk(sessionStorage.getItem("vault") === "1"), []);
  if (ok === null) return null;
  if (!ok)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">This page doesn't exist.</p>
        <Link to="/" className="underline text-primary">Back to the library</Link>
      </div>
    );
  const cats = ["All", ...new Set(games.map((g) => g.cat))];
  return (
    <div className="min-h-screen bg-vault text-vault-foreground font-arcade">
      <header className="flex items-center justify-between px-6 py-4 border-b border-neon/30">
        <h1 className="text-neon text-lg">▶ THE VAULT</h1>
        <Link to="/" onClick={() => sessionStorage.removeItem("vault")} className="text-xs opacity-70 hover:opacity-100">
          Close book
        </Link>
      </header>
      <div className="flex">
        <aside className="w-44 p-4 space-y-2 hidden sm:block">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`block w-full text-left text-xs px-3 py-2 rounded ${cat === c ? "bg-neon text-vault" : "hover:bg-neon/10"}`}>
              {c}
            </button>
          ))}
        </aside>
        <main className="flex-1 p-6">
          {play ? (
            <div>
              <button onClick={() => setPlay(null)} className="text-xs mb-4 text-neon">← All games</button>
              <h2 className="mb-4">{play.name}</h2>
              <div className="bg-background text-foreground rounded-lg p-6 font-sans min-h-[420px] flex items-center justify-center">
                {play.id === "snake" && <Snake />}
                {play.id === "clicker" && <Clicker />}
                {play.id === "reaction" && <Reaction />}
                {play.id === "math" && <MathRush />}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.filter((g) => cat === "All" || g.cat === cat).map((g) => (
                <button key={g.id} onClick={() => setPlay(g)} className="text-left rounded-xl overflow-hidden ring-1 ring-neon/20 hover:ring-neon hover:scale-105 transition">
                  <div className="aspect-video flex items-center justify-center text-3xl" style={{ background: `oklch(0.6 0.2 ${g.h})` }}>🎮</div>
                  <div className="p-3 text-xs">{g.name}<div className="opacity-50 mt-1">{g.cat}</div></div>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Snake() {
  const N = 20;
  type P = [number, number];
  const [snake, setSnake] = useState<P[]>([[10, 10]]);
  const [food, setFood] = useState<P>([5, 5]);
  const dir = useRef<P>([1, 0]);
  const [dead, setDead] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, P> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (m[e.key]) { e.preventDefault(); dir.current = m[e.key]!; }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    if (dead) return;
    const t = setInterval(() => {
      setSnake((s) => {
        const hd = s[0]!; const h: P = [hd[0] + dir.current[0], hd[1] + dir.current[1]];
        if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || s.some((p) => p[0] === h[0] && p[1] === h[1])) { setDead(true); return s; }
        const ate = h[0] === food[0] && h[1] === food[1];
        if (ate) setFood([Math.floor(Math.random() * N), Math.floor(Math.random() * N)]);
        return [h, ...(ate ? s : s.slice(0, -1))];
      });
    }, 120);
    return () => clearInterval(t);
  }, [dead, food]);
  return (
    <div className="text-center">
      <p className="mb-2">Score: {snake.length - 1} {dead && "— Game over"}</p>
      <div className="grid bg-vault mx-auto" style={{ gridTemplateColumns: `repeat(${N},16px)`, width: N * 16 }}>
        {Array.from({ length: N * N }, (_, i) => {
          const x = i % N, y = Math.floor(i / N);
          const on = snake.some((p) => p[0] === x && p[1] === y);
          const f = food[0] === x && food[1] === y;
          return <div key={i} className={`h-4 w-4 ${on ? "bg-neon" : f ? "bg-destructive" : ""}`} />;
        })}
      </div>
      {dead && <button onClick={() => { setSnake([[10, 10]]); dir.current = [1, 0]; setDead(false); }} className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded">Restart</button>}
      <p className="text-xs text-muted-foreground mt-2">Arrow keys to move</p>
    </div>
  );
}

function Clicker() {
  const [n, setN] = useState(0);
  const [auto, setAuto] = useState(0);
  useEffect(() => { const t = setInterval(() => setN((x) => x + auto), 1000); return () => clearInterval(t); }, [auto]);
  const cost = 10 * (auto + 1) ** 2;
  return (
    <div className="text-center space-y-4">
      <p className="text-3xl font-bold">{n} cookies</p>
      <button onClick={() => setN(n + 1)} className="text-8xl active:scale-90 transition">🍪</button>
      <button disabled={n < cost} onClick={() => { setN(n - cost); setAuto(auto + 1); }} className="block mx-auto px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-40">
        Buy baker ({cost}) — owned {auto}
      </button>
    </div>
  );
}

function Reaction() {
  const [s, setS] = useState<"idle" | "wait" | "go" | "done" | "early">("idle");
  const [ms, setMs] = useState(0);
  const start = useRef(0);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const click = () => {
    if (s === "idle" || s === "done" || s === "early") { setS("wait"); t.current = setTimeout(() => { start.current = Date.now(); setS("go"); }, 1500 + Math.random() * 2500); }
    else if (s === "wait") { clearTimeout(t.current); setS("early"); }
    else { setMs(Date.now() - start.current); setS("done"); }
  };
  const label = { idle: "Click to start", wait: "Wait for green…", go: "CLICK!", done: `${ms} ms — click to retry`, early: "Too early! Click to retry" }[s];
  return <button onClick={click} className={`w-full h-80 rounded-lg text-2xl font-bold ${s === "go" ? "bg-neon text-vault" : s === "wait" ? "bg-destructive text-primary-foreground" : "bg-muted"}`}>{label}</button>;
}

function MathRush() {
  const mk = () => { const a = Math.ceil(Math.random() * 12), b = Math.ceil(Math.random() * 12); return { a, b }; };
  const [q, setQ] = useState(mk);
  const [v, setV] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  useEffect(() => { if (time <= 0) return; const t = setTimeout(() => setTime(time - 1), 1000); return () => clearTimeout(t); }, [time]);
  if (time <= 0) return <div className="text-center"><p className="text-3xl">Score: {score}</p><button onClick={() => { setScore(0); setTime(30); setQ(mk()); }} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">Play again</button></div>;
  return (
    <form className="text-center" onSubmit={(e) => { e.preventDefault(); if (+v === q.a * q.b) setScore(score + 1); setQ(mk()); setV(""); }}>
      <p>⏱ {time}s · Score {score}</p>
      <p className="text-5xl font-bold my-6">{q.a} × {q.b}</p>
      <input autoFocus value={v} onChange={(e) => setV(e.target.value)} className="border-2 border-primary rounded px-3 py-2 text-2xl w-32 text-center" />
    </form>
  );
}
