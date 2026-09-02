/**
 * Mapa de endpoints internos -> endpoints oficiales de la API de Transporte de
 * la Ciudad de Buenos Aires (https://apitransporte.buenosaires.gob.ar/).
 * Este módulo SOLO corre en el servidor: es el único lugar donde se leen las
 * credenciales. Nunca se importa desde componentes.
 */
export const UPSTREAM_BASE = "https://apitransporte.buenosaires.gob.ar";

// Solo endpoints oficiales confirmados. Los no confirmados se responden con
// 501 y un mensaje explícito en lugar de inventar una URL.
export const ENDPOINTS = {
  "subtes/alerts": { path: "/subtes/serviceAlerts", query: { json: "1" } },
  "subtes/forecast": { path: "/subtes/forecastGTFS", query: { json: "1" } },
  // Trenes: la API oficial no expone alertas ni pronósticos en esta cuenta
  // (devuelve 404). Cuando el endpoint se habilite, agregarlo acá.
  "colectivos/alerts": { path: "/colectivos/serviceAlerts", query: { json: "1" } },
  "colectivos/positions": { path: "/colectivos/vehiclePositionsSimple", query: {} },
};

// Parámetros permitidos que el frontend puede reenviar (whitelist estricta:
// esto no es un proxy genérico).
const ALLOWED_PARAMS = new Set(["route_id", "agency_id", "lat", "lng", "lon", "radius"]);

export function buildUpstreamUrl(key, searchParams, credentials) {
  const endpoint = ENDPOINTS[key];
  if (!endpoint) return null;
  const url = new URL(UPSTREAM_BASE + endpoint.path);
  Object.entries(endpoint.query).forEach(([k, v]) => url.searchParams.set(k, v));
  if (searchParams) {
    for (const [k, v] of searchParams.entries()) {
      if (ALLOWED_PARAMS.has(k) && v !== "") url.searchParams.set(k, v);
    }
  }
  url.searchParams.set("client_id", credentials.clientId);
  url.searchParams.set("client_secret", credentials.clientSecret);
  return url;
}
