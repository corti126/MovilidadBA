/**
 * Única capa que conoce las URLs internas del proxy de MovilidadBA.
 * Los componentes nunca hacen fetch directo.
 *
 * El proxy agrega las credenciales del lado del servidor
 * (MOVILIDADBA_CLIENT_ID / MOVILIDADBA_CLIENT_SECRET). El frontend no las conoce.
 */
import { cachedGet, getStale } from "./apiClient";
import { normalizeAlerts, normalizeColectivos, normalizeSubteForecast } from "./normalizers";

const BASE = "/api/transport";

function endpoint(path) {
  return BASE + "/" + path;
}

export async function getAlerts({ signal } = {}) {
  // Trenes queda fuera a propósito: la API oficial todavía no expone alertas
  // de trenes en esta integración (responde 404). Ver upstream.server.js.
  const modes = ["subtes", "colectivos"];
  const results = await Promise.allSettled(
    modes.map((mode) => cachedGet(endpoint(mode + "/alerts"), { ttl: 60000, signal })),
  );

  const alerts = [];
  let anyOk = false;
  let lastError = null;

  results.forEach((result, index) => {
    const mode = ["subte", "colectivo"][index];
    if (result.status === "fulfilled") {
      anyOk = true;
      alerts.push(...normalizeAlerts(result.value?.data, mode));
    } else if (result.reason?.name !== "AbortError") {
      lastError = result.reason;
    }
  });

  return { alerts, partial: !anyOk, error: anyOk ? null : lastError };
}

export async function getSubtePredictions({ signal } = {}) {
  const payload = await cachedGet(endpoint("subtes/forecast"), { ttl: 25000, signal });
  return { predictions: normalizeSubteForecast(payload?.data), fetchedAt: payload?.fetchedAt };
}

export async function getColectivosNearby({ signal } = {}) {
  const payload = await cachedGet(endpoint("colectivos/positions"), { ttl: 25000, signal });
  return { vehicles: normalizeColectivos(payload?.data), fetchedAt: payload?.fetchedAt };
}

export function getCachedSubtePredictions() {
  const payload = getStale(endpoint("subtes/forecast"));
  return payload ? normalizeSubteForecast(payload.data) : null;
}

/**
 * PENDIENTE DE CONFIRMACIÓN OFICIAL.
 * La API de Transporte publica un planificador de viajes, pero el endpoint
 * exacto debe confirmarse en https://apitransporte.buenosaires.gob.ar/console/
 * antes de mapearlo en el proxy. No se simula un algoritmo propio de rutas.
 */
export async function getRouteOptions() {
  return {
    options: [],
    unavailable: true,
    reason:
      "El planificador de viajes oficial todavía no está conectado. Falta mapear su endpoint en el proxy.",
  };
}
