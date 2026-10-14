# MovilidadBA — Status Report

## Current Setup ✅

The app is structurally complete and the development infrastructure is in place:

### Files Created/Updated
- **`AGENTS.md`** — Project guidance for future agents (this file)
- **`.env`** — Environment variables with placeholder credentials
- **`vite.config.js`** — Vite dev server with proxy config forwarding `/api/transport` to `localhost:8787`
- **`app.config.js`** — Vinxi/TanStack Start config (import errors with Node 24, Vite is primary dev mode)

### Running Services
- **`npm run dev`** — Starts Vite on `http://localhost:5174` (or 5173)
- **Wrangler dev** — Must be running separately: `npx wrangler dev --local worker/index.js` on `http://127.0.0.1:8787`
- **API Proxy Flow**: Browser → Vite (5174) → proxy → wrangler (8787) → Cloudflare Worker → Official API

### Project Structure (verified)
```
src/
├── main.jsx          # SPA entry (Vite)
├── start.ts         # TanStack Start config (SSR)
├── server.ts        # SSR fetch handler
├── router.jsx       # Router factory + QueryClient
├── routeTree.gen.ts # Auto-generated routes (do not edit)
├── routes/          # File-based TanStack Router
│   ├── __root.jsx   # Root layout, providers, shell (SPA guard)
│   ├── index.jsx    # Home (Nearby)
│   ├── como-llegar.jsx  # Route planner
│   ├── favorites.jsx
│   ├── lines.jsx / lines.$mode.$id.jsx
│   ├── map.jsx
│   └── api/transport.$.js  # Server route proxy
├── services/        # API, normalizers, upstream URL builder
├── pages/           # Page components
├── components/      # Shared UI (Header, BottomNavigation, MapCanvas, etc.)
├── context/         # ThemeContext, AppContext
├── hooks/           # useTransport, useGeolocation, useAddressSearch, useDebounce
├── utils/           # transportRanking, formatters, distance, storage
└── lib/             # Error capture, error page, Lovable error reporting
worker/
├── index.js         # Cloudflare Worker proxy (reads env MOVILIDADBA_CLIENT_ID/SECRET)
└── wrangler.jsonc   # Worker config (name, secrets ref)
```

### Data Flow ✅
1. Components (`Nearby.jsx`, `Map.jsx`) call `useTransport(fetchNearby, ...)` or `useTransport(fetcher, ...)`
2. `fetchNearby` calls `getSubtePredictions()`, `getColectivosNearby()`, `getAlerts()` from `transportApi.js`
3. These call `cachedGet(endpoint(`/api/transport/...`), ...)` from `apiClient.js`
4. `apiClient.js` calls `fetch(url, { signal })` → `/api/transport/...`
5. Vite proxy forwards to `localhost:8787` (wrangler dev)
6. Worker handles the route, reads `env.MOVILIDADBA_CLIENT_ID/SECRET` from `.env`
7. Worker forwards to official API: `https://apitransporte.buenosaires.gob.ar`
8. Response normalizes via `upstream.server.js` → `normalizers.js` → UI components

### Remaining ⚠️

**For API data to flow, the user needs to:**

1. **Get valid credentials** at https://apitransporte.buenosaires.gob.ar/console/
   - `MOVILIDADBA_CLIENT_ID`
   - `MOVILIDADBA_CLIENT_SECRET`

2. **Update `.env`** in the repo root:
   ```
   MOVILIDADBA_CLIENT_ID=tu_client_id
   MOVILIDADBA_CLIENT_SECRET=tu_client_secret
   ```

3. **Run the dev servers**:
   ```bash
   # Terminal 1:
   npm run dev
   
   # Terminal 2 (or background):
   cd worker && npx wrangler dev --local worker/index.js
   ```

4. **Allow browser geolocation** when prompted (the `useGeolocation` hook uses `navigator.geolocation.getCurrentPosition()`)

5. **The app will then**:
   - Fetch subte predictions, colectivo positions, and service alerts
   - Display them in the "Lo más útil cerca tuyo" section
   - Show markers on the map within 3km of the user's location
   - Update every 30 seconds automatically

### Gotchas Documented in AGENTS.md
- Dual entry points (SPA `main.jsx` + SSR `start.ts`/`server.ts`)
- `RootShell` SPA guard checks `dataset.mbaSpa`
- API route is server-only (TanStack Start file route)
- Worker CORS must include deploy domains
- No TypeScript config — rely on ESLint + JSDoc

## Summary

The app is **structurally complete** and the development infrastructure is set up. The remaining step is providing valid API credentials and running both the Vite and wrangler dev servers. Once those are in place, the app will:

1. ✅ Consume and display API data (subte predictions, colectivo positions, service alerts)
2. ✅ Show the map with vehicle markers near the user's location
3. ✅ Handle device geolocation (with browser permission)
4. ✅ Update data every 30 seconds via auto-refresch