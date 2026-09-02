export const UNAVAILABLE = "Información no disponible";

export function formatDistance(meters) {
  if (meters == null || Number.isNaN(meters)) return null;
  if (meters < 1000) return Math.round(meters / 10) * 10 + " m";
  return (meters / 1000).toFixed(1).replace(".", ",") + " km";
}

export function formatMinutes(minutes) {
  if (minutes == null || Number.isNaN(minutes)) return null;
  if (minutes < 1) return "Llegando";
  if (minutes < 60) return Math.round(minutes) + " min";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? h + " h" : h + " h " + m + " min";
}

export function formatClock(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeUpdate(timestamp) {
  if (!timestamp) return null;
  const diff = Math.round((Date.now() - timestamp) / 1000);
  if (diff < 45) return "Actualizado recién";
  if (diff < 3600) return "Actualizado hace " + Math.round(diff / 60) + " min";
  return "Actualizado " + formatClock(new Date(timestamp));
}

export function transportLabel(mode) {
  if (mode === "subte") return "Subte";
  if (mode === "tren") return "Tren";
  if (mode === "colectivo") return "Colectivo";
  if (mode === "walk") return "Caminata";
  return "Transporte";
}
