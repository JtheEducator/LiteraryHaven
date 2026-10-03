import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Literary Haven — A Quiet Little Library" },
      { name: "description", content: "Browse classic and modern books at Literary Haven, a cozy online library." },
      { property: "og:title", content: "Literary Haven — A Quiet Little Library" },
      { property: "og:description", content: "Browse classic and modern books at Literary Haven." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

export const SECRET_CODE = "OPENSESAME";

const books = [
  { t: "Pride and Prejudice", a: "Jane Austen", h: 20 },
  { t: "Moby-Dick", a: "Herman Melville", h: 210 },
  { t: "Frankenstein", a: "Mary Shelley", h: 140 },
  { t: "The Odyssey", a: "Homer", h: 60 },
  { t: "Dracula", a: "Bram Stoker", h: 0 },
  { t: "Jane Eyre", a: "Charlotte Brontë", h: 300 },
  { t: "The Time Machine", a: "H. G. Wells", h: 180 },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.replace(/\s/g, "").toUpperCase() === SECRET_CODE) {
      sessionStorage.setItem("vault", "1");
      nav({ to: "/vault" });
    } else setErr(true);
  };
  return (
    <main className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <header className="mb-12 border-b-2 border-primary pb-6">
        <h1 className="text-6xl font-black text-primary">Literary Haven</h1>
        <p className="mt-2 text-muted-foreground italic">A quiet little library of timeless stories.</p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {books.map((b) => (
          <article key={b.t} className="group">
            <div
              className="aspect-[2/3] rounded-r-lg shadow-lg p-4 flex flex-col justify-between transition-transform group-hover:-translate-y-2"
              style={{ background: `oklch(0.45 0.1 ${b.h})` }}
            >
              <h2 className="text-xl font-bold text-primary-foreground">{b.t}</h2>
              <p className="text-sm text-primary-foreground/80">{b.a}</p>
            </div>
          </article>
        ))}
        <button onClick={() => setOpen(true)} className="group text-left">
          <div className="aspect-[2/3] rounded-r-lg shadow-lg p-4 flex flex-col justify-between bg-foreground transition-transform group-hover:-translate-y-2 group-hover:rotate-1">
            <h2 className="text-xl font-bold text-background">The Locked Tome</h2>
            <p className="text-sm text-background/70">🔒 Author unknown</p>
          </div>
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-foreground/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-lg p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-2xl font-bold text-primary">This book is sealed</h3>
            <p className="text-sm text-muted-foreground mt-1">Speak the words to open it.</p>
            <input
              autoFocus
              value={code}
              onChange={(e) => { setCode(e.target.value); setErr(false); }}
              className="mt-4 w-full border-2 border-primary rounded-md px-3 py-2 bg-card"
              placeholder="Enter code"
            />
            {err && <p className="text-destructive text-sm mt-2">The book stays shut.</p>}
            <button className="mt-4 w-full bg-primary text-primary-foreground rounded-md py-2 font-bold">Open</button>
          </form>
        </div>
      )}
    </main>
  );
}
