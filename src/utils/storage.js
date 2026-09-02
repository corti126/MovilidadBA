// Única capa de acceso a localStorage de MovilidadBA.
const PREFIX = "movilidadba:";

const KEYS = {
  favorites: PREFIX + "favorites",
  theme: PREFIX + "theme",
  filters: PREFIX + "transport-filter",
  location: PREFIX + "location",
  recent: PREFIX + "recent-searches",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getFavorites() {
  const value = read(KEYS.favorites, []);
  return Array.isArray(value) ? value : [];
}
export function saveFavorites(favorites) {
  return write(KEYS.favorites, favorites);
}

export function getTheme() {
  const value = read(KEYS.theme, "system");
  return ["light", "dark", "system"].includes(value) ? value : "system";
}
export function saveTheme(theme) {
  return write(KEYS.theme, theme);
}

export function getTransportFilter() {
  const value = read(KEYS.filters, "all");
  return ["all", "colectivo", "subte", "tren"].includes(value) ? value : "all";
}
export function saveTransportFilter(filter) {
  return write(KEYS.filters, filter);
}

export function getSavedLocation() {
  const value = read(KEYS.location, null);
  if (!value || typeof value.lat !== "number" || typeof value.lon !== "number") return null;
  return value;
}
export function saveLocation(location) {
  return write(KEYS.location, location);
}

export function getRecentSearches() {
  const value = read(KEYS.recent, []);
  return Array.isArray(value) ? value.slice(0, 6) : [];
}
export function saveRecentSearches(searches) {
  return write(KEYS.recent, searches.slice(0, 6));
}
