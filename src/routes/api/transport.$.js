import { createFileRoute } from "@tanstack/react-router";

import { ENDPOINTS, buildUpstreamUrl } from "../../services/upstream.server";

const CORS = {
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...CORS, ...extraHeaders },
  });
}

export const Route = createFileRoute("/api/transport/$")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request, params }) => {
        const key = String(params._splat || "").replace(/^\/+|\/+$/g, "");
        if (!ENDPOINTS[key]) {
          return json(
            { error: "unknown_endpoint", message: "Endpoint no disponible en MovilidadBA." },
            404,
          );
        }

        const clientId = process.env["MOVILIDADBA_CLIENT_ID"];
        const clientSecret = process.env["MOVILIDADBA_CLIENT_SECRET"];
        if (!clientId || !clientSecret) {
          return json(
            {
              error: "missing_credentials",
              message:
                "Faltan configurar las credenciales de la API de Transporte (MOVILIDADBA_CLIENT_ID / MOVILIDADBA_CLIENT_SECRET).",
            },
            503,
          );
        }

        const url = buildUpstreamUrl(key, new URL(request.url).searchParams, {
          clientId,
          clientSecret,
        });

        try {
          const upstream = await fetch(url, { headers: { accept: "application/json" } });
          const text = await upstream.text();
          if (!upstream.ok) {
            console.error("[transport-proxy]", key, upstream.status, text.slice(0, 200));
            return json(
              {
                error: "upstream_error",
                message: "La API de transporte no respondió.",
                upstreamStatus: upstream.status,
              },
              502,
            );
          }
          let data;
          try {
            data = JSON.parse(text);
          } catch {
            return json(
              { error: "bad_payload", message: "Respuesta inesperada de la API de transporte." },
              502,
            );
          }
          return json({ data, fetchedAt: Date.now() }, 200, {
            "cache-control": "public, max-age=15",
          });
        } catch {
          return json(
            { error: "network_error", message: "No pudimos contactar a la API de transporte." },
            502,
          );
        }
      },
    },
  },
});
