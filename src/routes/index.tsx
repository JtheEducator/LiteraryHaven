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

type Book = {
  t: string;
  a: string;
  y: number;
  g: string;
  h: number;
  blurb: string;
  gut: number; // Project Gutenberg ebook id
};

// All books below are in the public domain; full texts are free on Project Gutenberg.
const books: Book[] = [
  { t: "Pride and Prejudice", a: "Jane Austen", y: 1813, g: "Romance", h: 20, gut: 1342, blurb: "Elizabeth Bennet spars with the proud Mr. Darcy in the wittiest courtship in English fiction." },
  { t: "Moby-Dick", a: "Herman Melville", y: 1851, g: "Adventure", h: 210, gut: 2701, blurb: "Ishmael joins the whaler Pequod on Captain Ahab's obsessive hunt for the white whale." },
  { t: "Frankenstein", a: "Mary Shelley", y: 1818, g: "Horror", h: 140, gut: 84, blurb: "A young scientist's creation turns on him in the novel that invented science fiction." },
  { t: "Dracula", a: "Bram Stoker", y: 1897, g: "Horror", h: 0, gut: 345, blurb: "Letters and diaries trace Count Dracula's voyage from Transylvania to Victorian London." },
  { t: "Jane Eyre", a: "Charlotte Brontë", y: 1847, g: "Romance", h: 300, gut: 1260, blurb: "A plain governess with an iron will falls for her brooding employer at Thornfield Hall." },
  { t: "The Odyssey", a: "Homer", y: -700, g: "Epic", h: 60, gut: 1727, blurb: "Odysseus sails home from Troy through sirens, cyclopes and ten years of divine interference." },
  { t: "The Time Machine", a: "H. G. Wells", y: 1895, g: "Sci-Fi", h: 180, gut: 35, blurb: "A Victorian inventor travels to the year 802,701 and meets the gentle Eloi — and the Morlocks." },
  { t: "Alice's Adventures in Wonderland", a: "Lewis Carroll", y: 1865, g: "Children's", h: 320, gut: 11, blurb: "Alice follows a waistcoated rabbit down a hole into a world of mad tea parties and croquet." },
  { t: "The Adventures of Sherlock Holmes", a: "Arthur Conan Doyle", y: 1892, g: "Mystery", h: 40, gut: 1661, blurb: "Twelve cases for the detective of Baker Street, told by his loyal friend Dr. Watson." },
  { t: "The Great Gatsby", a: "F. Scott Fitzgerald", y: 1925, g: "Classics", h: 200, gut: 64317, blurb: "Jay Gatsby throws lavish parties across the bay from the woman he can never truly win back." },
  { t: "Treasure Island", a: "Robert Louis Stevenson", y: 1883, g: "Adventure", h: 130, gut: 120, blurb: "Young Jim Hawkins finds a pirate map and sails after buried gold with Long John Silver." },
  { t: "The Wonderful Wizard of Oz", a: "L. Frank Baum", y: 1900, g: "Children's", h: 90, gut: 55, blurb: "A cyclone carries Dorothy and Toto to the Emerald City and the yellow brick road." },
  { t: "The War of the Worlds", a: "H. G. Wells", y: 1898, g: "Sci-Fi", h: 260, gut: 36, blurb: "Martian tripods lay waste to southern England in the original alien-invasion story." },
  { t: "A Tale of Two Cities", a: "Charles Dickens", y: 1859, g: "Classics", h: 170, gut: 98, blurb: "Two men who love the same woman meet their fates in revolutionary Paris." },
  { t: "The Picture of Dorian Gray", a: "Oscar Wilde", y: 1890, g: "Gothic", h: 290, gut: 174, blurb: "Dorian stays young while his portrait ages and records every sin in his place." },
  { t: "Little Women", a: "Louisa May Alcott", y: 1868, g: "Classics", h: 340, gut: 514, blurb: "The March sisters grow up, quarrel, create and love in Civil War-era New England." },
  { t: "Adventures of Huckleberry Finn", a: "Mark Twain", y: 1884, g: "Adventure", h: 110, gut: 76, blurb: "Huck and the runaway Jim raft down the Mississippi in America's great road novel." },
  { t: "Metamorphosis", a: "Franz Kafka", y: 1915, g: "Gothic", h: 25, gut: 5200, blurb: "Gregor Samsa wakes to find himself transformed into a monstrous insect — and his family adjusts." },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [sel, setSel] = useState<Book | null>(null);
  const [genre, setGenre] = useState("All");
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.replace(/\s/g, "").toUpperCase() === SECRET_CODE) {
      sessionStorage.setItem("vault", "1");
      nav({ to: "/vault" });
    } else setErr(true);
  };
  const genres = ["All", ...Array.from(new Set(books.map((b) => b.g))).sort()];
  const shown = books.filter((b) => genre === "All" || b.g === genre);
  return (
    <main className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <header className="mb-8 border-b-2 border-primary pb-6">
        <h1 className="text-6xl font-black text-primary">Literary Haven</h1>
        <p className="mt-2 text-muted-foreground italic">A quiet little library of timeless stories — every book free to read, in the public domain.</p>
      </header>
      <div className="mb-8 flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 py-1 rounded-full text-sm border transition ${genre === g ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {shown.map((b) => (
          <article key={b.t} className="group">
            <button onClick={() => setSel(b)} className="w-full text-left">
              <div
                className="aspect-[2/3] rounded-r-lg shadow-lg p-4 flex flex-col justify-between transition-transform group-hover:-translate-y-2"
                style={{ background: `oklch(0.45 0.1 ${b.h})` }}
              >
                <h2 className="text-xl font-bold text-primary-foreground leading-tight">{b.t}</h2>
                <div>
                  <p className="text-sm text-primary-foreground/80">{b.a}</p>
                  <p className="text-xs text-primary-foreground/60 mt-1">{b.y < 0 ? `c. ${-b.y} BC` : b.y}</p>
                </div>
              </div>
            </button>
          </article>
        ))}
        <button onClick={() => setOpen(true)} className="group text-left">
          <div className="aspect-[2/3] rounded-r-lg shadow-lg p-4 flex flex-col justify-between bg-foreground transition-transform group-hover:-translate-y-2 group-hover:rotate-1">
            <h2 className="text-xl font-bold text-background">The Locked Tome</h2>
            <p className="text-sm text-background/70">🔒 Author unknown</p>
          </div>
        </button>
      </div>
      {sel && (
        <div className="fixed inset-0 bg-foreground/70 flex items-center justify-center p-4 z-40" onClick={() => setSel(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-background rounded-lg p-8 w-full max-w-md shadow-2xl">
            <div className="flex gap-6">
              <div className="w-24 shrink-0 aspect-[2/3] rounded-r-md shadow-lg p-2 flex items-end" style={{ background: `oklch(0.45 0.1 ${sel.h})` }}>
                <p className="text-xs font-bold text-primary-foreground leading-tight">{sel.t}</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary leading-tight">{sel.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {sel.a} · {sel.y < 0 ? `c. ${-sel.y} BC` : sel.y} · {sel.g}
                </p>
                <p className="mt-3 text-sm">{sel.blurb}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Public domain — free to read, share and keep forever.</p>
            <div className="mt-4 flex gap-3">
              <a
                href={`https://www.gutenberg.org/ebooks/${sel.gut}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center bg-primary text-primary-foreground rounded-md py-2 font-bold hover:opacity-90"
              >
                Read free →
              </a>
              <button onClick={() => setSel(null)} className="px-4 py-2 rounded-md border border-border text-muted-foreground hover:text-primary">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
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
