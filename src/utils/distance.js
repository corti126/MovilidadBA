const EARTH_RADIUS_M = 6371000;

function toRad(value) {
  return (value * Math.PI) / 180;
}

/** Distancia en metros entre dos coordenadas {lat, lon}. */
export function haversineMeters(a, b) {
  if (!a || !b) return null;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h)));
}

/** Minutos caminando estimados a 80 m/min (ritmo urbano moderado). */
export function walkingMinutes(meters) {
  if (meters == null) return null;
  return Math.max(1, Math.round(meters / 80));
}
