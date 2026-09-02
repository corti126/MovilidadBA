import { STATUS, statusFromAlertText } from "../utils/serviceStatus";
import { findSubteLine } from "../data/subteLines";
import { findTrenLine } from "../data/trenLines";

/** GTFS-RT serviceAlerts (JSON) -> TransportAlert[] de MovilidadBA. */
export function normalizeAlerts(payload, mode) {
  const entities = payload?.entity || payload?.Entity || [];
  if (!Array.isArray(entities)) return [];

  return entities
    .map((entity, index) => {
      const alert = entity.alert || entity.Alert;
      if (!alert) return null;
      const header = pickText(alert.header_text || alert.headerText);
      const description = pickText(alert.description_text || alert.descriptionText);
      const informed = alert.informed_entity || alert.informedEntity || [];
      const routeId = Array.isArray(informed)
        ? informed.map((i) => i.route_id || i.routeId).find(Boolean)
        : null;
      const line =
        mode === "subte" ? findSubteLine(routeId) : mode === "tren" ? findTrenLine(routeId) : null;

      return {
        id: String(entity.id ?? mode + "-" + index),
        mode,
        lineId: line?.id ?? routeId ?? null,
        lineName: line?.name ?? routeId ?? null,
        title: header || "Aviso del servicio",
        description: description || null,
        status: statusFromAlertText([header, description].filter(Boolean).join(" ")),
        updatedAt: toMillis(entity.timestamp ?? payload?.header?.timestamp),
        activePeriod: normalizePeriod(alert.active_period || alert.activePeriod),
      };
    })
    .filter(Boolean);
}

function normalizePeriod(period) {
  const first = Array.isArray(period) ? period[0] : period;
  if (!first) return null;
  return { start: toMillis(first.start), end: toMillis(first.end) };
}

function pickText(field) {
  if (!field) return null;
  if (typeof field === "string") return field;
  const translations = field.translation || field.Translation;
  if (Array.isArray(translations) && translations.length) {
    const es = translations.find((t) => (t.language || "").startsWith("es"));
    return (es || translations[0]).text || null;
  }
  return null;
}

function toMillis(seconds) {
  const value = Number(seconds);
  if (!value || Number.isNaN(value)) return null;
  return value > 1e12 ? value : value * 1000;
}

/** forecastGTFS de subtes -> predicciones normalizadas. */
export function normalizeSubteForecast(payload) {
  const entities = payload?.Entity || payload?.entity || [];
  if (!Array.isArray(entities)) return [];
  const out = [];

  entities.forEach((entity, entityIndex) => {
    const trip = entity.Linea || entity.trip_update || entity.tripUpdate;
    if (!trip) return;
    const routeId = trip.Route_Id || trip.route_id || trip.trip?.route_id;
    const line = findSubteLine(routeId);
    const stops = trip.Estaciones || trip.stop_time_update || trip.stopTimeUpdate || [];
    stops.forEach((stop, stopIndex) => {
      const arrival = stop.arrival?.time ?? stop.Arrival?.time ?? stop.arrival_time;
      out.push({
        id: "subte-" + entityIndex + "-" + stopIndex,
        mode: "subte",
        lineId: line?.id ?? routeId ?? null,
        lineName: line?.name ?? routeId ?? null,
        color: line?.color ?? null,
        stopName: stop.stop_name || stop.Stop_Name || stop.stop_id || null,
        headsign: trip.Direction_ID != null ? null : trip.trip_headsign || null,
        arrivalAt: toMillis(arrival),
        realtime: true,
      });
    });
  });

  return out;
}

/** vehiclePositionsSimple de colectivos -> vehículos normalizados. */
export function normalizeColectivos(payload) {
  const list = Array.isArray(payload) ? payload : payload?.vehicles || [];
  return list
    .map((vehicle, index) => {
      const lat = Number(vehicle.latitude ?? vehicle.lat);
      const lon = Number(vehicle.longitude ?? vehicle.lon ?? vehicle.lng);
      if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
      return {
        id: String(vehicle.id ?? vehicle.route_id ?? index) + "-" + index,
        mode: "colectivo",
        lineId: vehicle.route_short_name ?? vehicle.route_id ?? null,
        lineName: vehicle.route_short_name
          ? "Línea " + vehicle.route_short_name
          : (vehicle.route_id ?? null),
        headsign: vehicle.trip_headsign || vehicle.direction || null,
        agency: vehicle.agency_name || null,
        position: { lat, lon },
        timestamp: toMillis(vehicle.timestamp),
        realtime: true,
        status: STATUS.NORMAL,
      };
    })
    .filter(Boolean);
}
