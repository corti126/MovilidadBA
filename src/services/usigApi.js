/**
 * Servicios oficiales de USIG (Gobierno de la Ciudad de Buenos Aires).
 * https://usig.buenosaires.gob.ar/apis/
 * Son públicos: no requieren credenciales.
 */
const NORMALIZAR = "https://servicios.usig.buenosaires.gob.ar/normalizar";
const REVERSE = "https://servicios.usig.buenosaires.gob.ar/geocoder/2.2/reversegeocoding";

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("usig_error");
  return response.json();
}

/** Normaliza y geocodifica una dirección de CABA. */
export async function searchAddress(query, { signal, max = 6 } = {}) {
  const text = String(query || "").trim();
  if (text.length < 3) return [];
  const url = new URL(NORMALIZAR);
  url.searchParams.set("direccion", text);
  url.searchParams.set("geocodificar", "true");
  url.searchParams.set("srid", "4326");
  url.searchParams.set("maxOptions", String(max));

  const payload = await getJson(url.toString(), signal);
  const list = payload?.direccionesNormalizadas || [];
  return list
    .map((item, index) => {
      const lat = Number(item.coordenadas?.y ?? item.y);
      const lon = Number(item.coordenadas?.x ?? item.x);
      return {
        id: (item.direccion || "usig") + "-" + index,
        label: item.direccion || text,
        neighborhood: item.nombre_calle_cruce ? null : (item.barrio ?? null),
        lat: Number.isNaN(lat) ? null : lat,
        lon: Number.isNaN(lon) ? null : lon,
      };
    })
    .filter((item) => item.lat != null && item.lon != null);
}

/** Reverse geocoding: coordenadas -> dirección/barrio. */
export async function reverseGeocode({ lat, lon }, { signal } = {}) {
  const url = new URL(REVERSE);
  url.searchParams.set("x", String(lon));
  url.searchParams.set("y", String(lat));
  const payload = await getJson(url.toString(), signal);
  const label = payload?.puerta_y_calle || payload?.calle || null;
  return {
    label,
    neighborhood: payload?.barrio || null,
    lat,
    lon,
  };
}
