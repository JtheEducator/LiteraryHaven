# Literary Haven

A quiet little library of timeless stories — every book free to read, in the public domain — with a secret arcade hidden inside.

Built with [TanStack Start](https://tanstack.com/start), React 19, TypeScript and Tailwind CSS v4.

## Features

- **Library** — 18 genuine public-domain classics (Austen, Shelley, Dickens, Wells and more) with real cover art from Project Gutenberg, genre filters, and blurbs.
- **Reader** — every book is fully readable on the site, page by page, and remembers where you stopped.
- **The Locked Tome** — a sealed book on the shelf. Enter the secret code to unlock…
- **The Vault** — a hidden arcade with six original mini-games: Snake, Cookie Clicker, Reaction Test, Math Rush, Life Sim (BitLife-style) and Moto Stunt Rider (Moto X3M-style).

## Getting started

```sh
git clone <this-repository-url>
cd literary-haven
npm install
npm run dev
```

Then open http://localhost:8080.

Other scripts:

```sh
npm run build      # production build
npm run test       # run tests
npm run lint       # eslint
npm run format     # prettier
```

## Notes

- All books and cover art are loaded live from [Project Gutenberg](https://www.gutenberg.org) and are in the public domain.
- The vault code lives in `src/routes/index.tsx` (`SECRET_CODE`) — change it there.
- Book data lives in `src/routes/index.tsx` (`books` array); the vault games are in `src/components/vault-games.tsx`.
