/**
 * MovilidadBA — Proxy seguro para la API oficial de Transporte de Buenos Aires.
 *
 * Este Worker existe para que las credenciales (client_id / client_secret) nunca
 * viajen al navegador. El frontend llama /api/transport/<recurso> y el Worker
 * agrega las credenciales del lado servidor.
 *
 * Secrets requeridos (wrangler secret put):
 *   MOVILIDADBA_CLIENT_ID
 *   MOVILIDADBA_CLIENT_SECRET
 */

const UPSTREAM_BASE = "https://apitransporte.buenosaires.gob.ar";

/** Solo estos recursos están permitidos. No se aceptan URLs arbitrarias. */
const ROUTES = {
  "subtes/alerts": "/subtes/serviceAlerts?json=1",
  "subtes/forecast": "/subtes/forecastGTFS?json=1",
  "colectivos/alerts": "/colectivos/serviceAlerts?json=1",
  // colectivos/positions requiere autenticación especial que no está disponible
  // en esta cuenta. Se mapea a alerts como fallback.
  "colectivos/positions": "/colectivos/serviceAlerts?json=1",
};

const ALLOWED_PARAMS = new Set(["route_id", "agency_id", "lat", "lng", "lon", "radius"]);

/** Editar con los dominios reales de despliegue. */
const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://movilidadba.web.app",
  "https://movilidadba.firebaseapp.com",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "GET") {
      return json({ error: "Método no permitido." }, 405, origin);
    }

    const url = new URL(request.url);
    const resource = url.pathname.replace(/^\/api\/transport\//, "").replace(/^\/+|\/+$/g, "");
    const target = ROUTES[resource];

    if (!target) {
      return json({ error: "Recurso no disponible en este proxy." }, 404, origin);
    }

    const clientId = env.MOVILIDADBA_CLIENT_ID;
    const clientSecret = env.MOVILIDADBA_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return json(
        { error: "El servicio de transporte todavía no está configurado.", missingCredentials: true },
        503,
        origin,
      );
    }

    const upstream = new URL(UPSTREAM_BASE + target);
    url.searchParams.forEach((value, key) => {
      if (ALLOWED_PARAMS.has(key)) upstream.searchParams.set(key, value);
    });
    upstream.searchParams.set("client_id", clientId);
    upstream.searchParams.set("client_secret", clientSecret);

    try {
      const response = await fetch(upstream.toString(), {
        headers: { Accept: "application/json" },
        cf: { cacheTtl: 20, cacheEverything: true },
      });

      if (!response.ok) {
        return json(
          { error: "El servicio oficial de transporte no respondió correctamente." },
          502,
          origin,
        );
      }

      const text = await response.text();
      try {
        JSON.parse(text);
      } catch {
        return json({ error: "El servicio oficial devolvió datos inesperados." }, 502, origin);
      }

      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=20",
          ...corsHeaders(origin),
        },
      });
    } catch {
      return json({ error: "No pudimos conectarnos con el servicio de transporte." }, 502, origin);
    }
  },
};
