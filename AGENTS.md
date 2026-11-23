<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repo facts

- npm only (`package-lock.json`); single Next.js 16.4.6 App Router app at the repo root.
- React 19.3, Tailwind CSS v4, shadcn/ui `base-nova` style on Base UI (`@base-ui/react` 1.9).
- No test suite, CI, or formatter config. `npm run lint` is the only style gate; don't invent `npm test`.

## Commands

- `npm run dev` — Turbopack dev server.
- `npm run lint` — ESLint flat config.
- `npm run build` — includes TypeScript checking; use as full verification.
- `npx tsc --noEmit` — only valid after Next has generated `next-env.d.ts` and `.next/types` (run dev or build first on a fresh clone).

## UI stack (differs from default shadcn)

- Primitives are Base UI, not Radix: use the `render` prop, not `asChild`; import from `@base-ui/react/<part>`.
- Add primitives with the installed CLI: `npx shadcn add <name>`. Keep the `base-nova` style in `components.json` and match the existing `data-slot` patterns in `components/ui/`.
- `cn` is the `cn` package (shadcn's clsx + tailwind-merge replacement), re-exported by `lib/utils.ts`. Don't add clsx or tailwind-merge.
- Tailwind v4 is CSS-first: there is no `tailwind.config`. Theme tokens and colors live in `app/globals.css` under `@theme inline`, with oklch values in `:root` and `.dark`.
- `next.config.ts` enables Cache Components, partial prefetching, and a Turbopack CSS loader. Keep them; caching/data-fetching behavior differs from stock Next, so check the bundled docs before changing it.

## Fonts

- Body/UI: Geist (`--font-geist-sans` → `--font-sans`); code: Geist Mono.
- Headings: `app/fonts/UtileDisplay-Black-TRIAL.otf`, loaded via `next/font/local` in `app/layout.tsx` as `--font-utile-display`. `--font-heading` and `--font-display` map to it, and `h1`–`h6` apply it automatically.
- That Utile file is a personal-use trial with only the 900/Black weight and ~72 glyphs (no accents, apostrophes, or ligatures). Keep it to short headings, not body text, and replace it with licensed files before shipping.
