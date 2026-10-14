# MovilidadBA — AGENTS.md

## Project Overview
React + TanStack Start + Vite app for Buenos Aires public transport (subtes, trenes, colectivos). Hybrid SPA/SSR: runs as Vite SPA (`src/main.jsx`) or SSR via TanStack Start (`src/start.ts`, `src/server.ts`). Cloudflare Worker (`worker/`) proxies the official API to keep credentials server-side.

## Key Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (SPA mode) |
| `npm run build` | Production build (Vite) |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint (flat config) |
| `npm run format` | Prettier write |

## Worker Deploy (Cloudflare)
```bash
cd worker
npx wrangler deploy
npx wrangler secret put MOVILIDADBA_CLIENT_ID
npx wrangler secret put MOVILIDADBA_CLIENT_SECRET
```
Worker proxies `/api/transport/<resource>` → official API with credentials. Allowed resources: `subtes/alerts`, `subtes/forecast`, `trenes/alerts`, `trenes/forecast`, `colectivos/alerts`, `colectivos/positions`.

## Architecture Notes
- **Routes** (file-based, TanStack Router): `/` (Nearby), `/como-llegar` (RoutePlanner), `/favorites`, `/lines` (with `/lines/$mode/$id` detail), `/map`, `/promotions`, `/api/transport/$` (server route proxy)
- **Data fetching**: `@tanstack/react-query` + custom `cachedGet` in `src/services/apiClient.js` (in-memory TTL cache, 20s default)
- **API layer**: `src/services/` — `upstream.server.js` (builds upstream URLs), `transportApi.js` (React Query hooks), `normalizers.js`, `apiClient.js`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` + `src/styles.css` (CSS variables for theming)
- **SSR entry**: `src/server.ts` wraps TanStack Start server entry, normalizes h3 swallowed errors
- **SPA mount**: `src/main.jsx` sets `document.documentElement.dataset.mbaSpa = "true"` so `RootShell` skips `<html>/<head>/<body>` rendering

## Environment / Secrets
- Worker: `MOVILIDADBA_CLIENT_ID`, `MOVILIDADBA_CLIENT_SECRET` (via `wrangler secret put`)
- Local dev: create `.env` in `worker/` or rely on Vite proxy (not configured; Worker runs separately)
- Frontend API route (`src/routes/api/transport.$.js`) reads `process.env.MOVILIDADBA_CLIENT_ID/SECRET` — requires Node env with vars set (not Vite `import.meta.env`)

## TypeScript
No `tsconfig.json`. Some files use `.ts` extension but project runs as plain JS/JSX. TanStack Router generates `src/routeTree.gen.ts` (auto-generated, do not edit).

## Testing
No test runner configured. Add Vitest/Jest if needed.

## Common Gotchas
- **Dual entry points**: `main.jsx` (SPA) and `start.ts`/`server.ts` (SSR) coexist. Changes to routing/context must work in both.
- **RootShell SPA guard**: Checks `dataset.mbaSpa` to avoid invalid HTML nesting when mounted in `#root`.
- **API route is server-only**: `src/routes/api/transport.$.js` uses `server: { handlers: { GET, OPTIONS } }` — runs only on server, not in browser.
- **Worker CORS**: `ALLOWED_ORIGINS` in `worker/index.js` must include your deploy domains.
- **No TS config**: Type-checking not enforced; rely on ESLint + JSDoc / manual checks.

## File Structure Highlights
```
src/
├── main.jsx              # SPA entry (Vite)
├── start.ts              # TanStack Start config (SSR)
├── server.ts             # SSR fetch handler (Cloudflare/Pages/Node)
├── router.jsx            # Router factory + QueryClient
├── routeTree.gen.ts      # Auto-generated routes (do not edit)
├── routes/               # File-based routes
│   ├── __root.jsx        # Root layout, providers, shell
│   ├── index.jsx         # Home (Nearby)
│   ├── como-llegar.jsx   # Route planner
│   ├── favorites.jsx
│   ├── lines.jsx / lines.$mode.$id.jsx
│   ├── map.jsx
│   ├── promotions.jsx
│   └── api/transport.$.js  # Server route proxy
├── services/             # API, normalizers, upstream URL builder
├── pages/                # Page components (Nearby, Lines, Map, etc.)
├── components/           # Shared UI (Header, BottomNavigation, LocationPicker, etc.)
├── context/              # ThemeContext, AppContext
├── hooks/                # Custom hooks (useTransport, useGeolocation, etc.)
├── utils/                # Transport ranking, storage, formatters, distance
├── lib/                  # Error capture, error page, Lovable error reporting
└── styles.css            # Global styles + CSS variables
worker/
├── index.js              # Cloudflare Worker proxy
└── wrangler.jsonc        # Worker config (name, secrets ref)
```