import { STATUS, statusSeverity } from "./serviceStatus";

/**
 * Ranking de utilidad. Solo usa datos presentes: un dato ausente no penaliza
 * inventando valores, simplemente no suma información al puntaje.
 */
export function scoreService(service) {
  let score = 100;

  if (typeof service.walkMinutes === "number") score -= service.walkMinutes * 2.2;
  if (typeof service.waitMinutes === "number") score -= service.waitMinutes * 1.6;
  if (typeof service.transfers === "number") score -= service.transfers * 6;
  if (typeof service.frequencyMinutes === "number") score -= service.frequencyMinutes * 0.6;
  if (typeof service.distanceMeters === "number") score -= service.distanceMeters / 200;

  score -= statusSeverity(service.status) * 12;
  if (service.status === STATUS.NORMAL) score += 6;
  if (service.realtime) score += 8;
  if (service.status === STATUS.UNKNOWN) score -= 4;

  return score;
}

export function rankServices(services) {
  const scored = services.map((service) => ({ ...service, _score: scoreService(service) }));
  scored.sort((a, b) => b._score - a._score);

  const withTime = scored.filter((s) => typeof s.waitMinutes === "number");
  const fastest = withTime.length
    ? withTime.reduce((a, b) => (a.waitMinutes <= b.waitMinutes ? a : b))
    : null;
  const walkable = scored.filter((s) => typeof s.walkMinutes === "number");
  const leastWalk = walkable.length
    ? walkable.reduce((a, b) => (a.walkMinutes <= b.walkMinutes ? a : b))
    : null;

  return scored.map((service, index) => {
    let highlight = null;
    if (index === 0) highlight = "Mejor opción";
    else if (fastest && service.id === fastest.id) highlight = "Más rápida";
    else if (leastWalk && service.id === leastWalk.id) highlight = "Menos caminata";
    return { ...service, highlight };
  });
}
