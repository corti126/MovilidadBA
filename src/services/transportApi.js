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
  // colectivos/positions requiere autenticación especial que no está disponible
  // en esta cuenta. Devolvemos un array vacío para que el frontend maneje
  // la ausencia de datos correctamente.
  const payload = await cachedGet(endpoint("colectivos/positions"), { ttl: 25000, signal });
  return { vehicles: normalizeColectivos(payload?.data), fetchedAt: payload?.fetchedAt };
}

export function getCachedSubtePredictions() {
  const payload = getStale(endpoint("subtes/forecast"));
  return payload ? normalizeSubteForecast(payload.data) : null;
}

/**
 * Planificador de viajes usando datos de la API oficial de Transporte.
 * Combina predicciones de subte y alertas para estimar tiempos de viaje.
 */
export async function getRouteOptions({ origin, destination, signal } = {}) {
  if (!origin || !destination) {
    return {
      options: [],
      unavailable: true,
      reason: "Se necesitan origen y destino para calcular la ruta.",
    };
  }

  try {
    const [subteData, alertsData] = await Promise.allSettled([
      getSubtePredictions({ signal }),
      getAlerts({ signal }),
    ]);

    const predictions = subteData.status === "fulfilled" ? subteData.value.predictions : [];
    const alerts = alertsData.status === "fulfilled" ? alertsData.value.alerts : [];

    // Generar opciones de ruta basadas en datos disponibles
    const options = [];

    // Opción 1: Subte (si hay predicciones)
    if (predictions.length > 0) {
      const bestPrediction = predictions.reduce((best, pred) => {
        if (!best) return pred;
        const bestMinutes = best.arrivalAt ? (best.arrivalAt - Date.now()) / 60000 : Infinity;
        const predMinutes = pred.arrivalAt ? (pred.arrivalAt - Date.now()) / 60000 : Infinity;
        return predMinutes < bestMinutes ? pred : best;
      }, null);

      if (bestPrediction) {
        const minutes = bestPrediction.arrivalAt
          ? Math.max(0, Math.round((bestPrediction.arrivalAt - Date.now()) / 60000))
          : null;

        options.push({
          id: "subte-option",
          mode: "subte",
          title: "Subte",
          subtitle: bestPrediction.lineName || "Línea de subte",
          duration: minutes,
          durationText: minutes ? `${minutes} min` : "Tiempo no disponible",
          realtime: true,
          details: bestPrediction,
        });
      }
    }

    // Opción 2: Colectivo (estimación basada en distancia)
    const distance = haversineMeters(origin, destination);
    if (distance != null) {
      const estimatedMinutes = Math.round(distance / 500); // ~30 km/h en ciudad
      options.push({
        id: "colectivo-option",
        mode: "colectivo",
        title: "Colectivo",
        subtitle: "Estimación basada en distancia",
        duration: estimatedMinutes,
        durationText: `~${estimatedMinutes} min`,
        realtime: false,
        details: { distance },
      });
    }

    // Opción 3: Caminata (si es corta)
    if (distance != null && distance < 2000) {
      const walkMinutes = Math.round(distance / 80); // ~5 km/h
      options.push({
        id: "walking-option",
        mode: "walking",
        title: "Caminando",
        subtitle: "A pie",
        duration: walkMinutes,
        durationText: `${walkMinutes} min`,
        realtime: false,
        details: { distance },
      });
    }

    // Opción 4: Bicicleta (si es corta)
    if (distance != null && distance < 5000) {
      const bikeMinutes = Math.round(distance / 200); // ~12 km/h
      options.push({
        id: "bike-option",
        mode: "bike",
        title: "Bicicleta",
        subtitle: "En bici",
        duration: bikeMinutes,
        durationText: `${bikeMinutes} min`,
        realtime: false,
        details: { distance },
      });
    }

    if (options.length === 0) {
      return {
        options: [],
        unavailable: true,
        reason: "No hay datos suficientes para calcular rutas en este momento.",
      };
    }

    // Ordenar por duración
    options.sort((a, b) => (a.duration || Infinity) - (b.duration || Infinity));

    return {
      options,
      unavailable: false,
      reason: null,
    };
  } catch (error) {
    return {
      options: [],
      unavailable: true,
      reason: "No pudimos calcular el viaje ahora mismo. Intentá de nuevo en unos minutos.",
    };
  }
}

function haversineMeters(origin, destination) {
  if (!origin || !destination) return null;
  const lat1 = origin.lat ?? origin.latitude;
  const lon1 = origin.lon ?? origin.lng ?? origin.longitude;
  const lat2 = destination.lat ?? destination.latitude;
  const lon2 = destination.lon ?? destination.lng ?? destination.longitude;

  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
