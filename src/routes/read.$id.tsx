import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { books, coverUrl } from "./index";

const getBookText = createServerFn({ method: "GET" })
  .inputValidator((id: number) => {
    if (!Number.isInteger(id) || id <= 0) throw new Error("Bad id");
    return id;
  })
  .handler(async ({ data: id }) => {
    const urls = [
      `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
      `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    ];
    for (const u of urls) {
      const r = await fetch(u);
      if (!r.ok) continue;
      let t = await r.text();
      const s = t.search(/\*\*\* ?START OF (THE|THIS) PROJECT GUTENBERG[^\n]*\n/i);
      if (s >= 0) t = t.slice(t.indexOf("\n", s) + 1);
      const e = t.search(/\*\*\* ?END OF (THE|THIS) PROJECT GUTENBERG/i);
      if (e >= 0) t = t.slice(0, e);
      return t.trim();
    }
    throw new Error("Could not load book");
  });

export const Route = createFileRoute("/read/$id")({
  loader: async ({ params }) => {
    const id = Number(params.id);
    const book = books.find((b) => b.gut === id);
    const text = await getBookText({ data: id });
    return { id, book, text };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.book ? `${loaderData.book.t} by ${loaderData.book.a}` : "Read a classic";
    return {
      meta: [
        { title: `${t} — Literary Haven` },
        { name: "description", content: `Read ${t} free, in full, at Literary Haven.` },
        { property: "og:title", content: `${t} — Literary Haven` },
        { property: "og:description", content: `Read ${t} free, in full, at Literary Haven.` },
        { property: "og:type", content: "book" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  errorComponent: () => (
    <main className="min-h-screen p-12 text-center">
      <p>Sorry, this book couldn't be loaded right now.</p>
      <Link to="/" className="text-primary underline">Back to the library</Link>
    </main>
  ),
  component: Reader,
});

const PAGE = 12000;

function Reader() {
  const { id, book, text } = Route.useLoaderData();
  const pages = Math.max(1, Math.ceil(text.length / PAGE));
  const key = `page-${id}`;
  const [p, setP] = useState(0);
  useEffect(() => {
    const saved = Number(localStorage.getItem(key) ?? 0);
    if (saved > 0 && saved < pages) setP(saved);
  }, [key, pages]);
  const go = (n: number) => {
    const v = Math.min(pages - 1, Math.max(0, n));
    setP(v);
    localStorage.setItem(key, String(v));
    window.scrollTo(0, 0);
  };
  const chunk = text.slice(p * PAGE, (p + 1) * PAGE);
  const Nav = () => (
    <div className="flex items-center justify-between gap-4 my-6 text-sm">
      <button onClick={() => go(p - 1)} disabled={p === 0} className="px-4 py-2 rounded-md border border-border disabled:opacity-40 hover:border-primary">← Previous</button>
      <span className="text-muted-foreground">Page {p + 1} of {pages}</span>
      <button onClick={() => go(p + 1)} disabled={p >= pages - 1} className="px-4 py-2 rounded-md border border-border disabled:opacity-40 hover:border-primary">Next →</button>
    </div>
  );
  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Literary Haven</Link>
      <header className="flex gap-6 items-end mt-6 border-b-2 border-primary pb-6">
        <img src={coverUrl(id)} alt={book ? `Cover of ${book.t}` : "Book cover"} className="w-28 aspect-[2/3] object-cover rounded-r-md shadow-lg bg-muted" />
        <div>
          <h1 className="text-4xl font-black text-primary leading-tight">{book?.t ?? "Untitled"}</h1>
          {book && <p className="text-muted-foreground mt-1">{book.a}</p>}
        </div>
      </header>
      <Nav />
      <article className="whitespace-pre-wrap font-serif text-lg leading-relaxed">{chunk}</article>
      <Nav />
    </main>
  );
}
