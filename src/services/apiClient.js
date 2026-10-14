/** Cliente HTTP común: caché en memoria con TTL, abort y errores humanos. */
const cache = new Map();

export class FriendlyError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "FriendlyError";
    this.code = code || "unknown";
  }
}

export function cachedGet(url, { ttl = 20000, signal, timeoutMs = 10000 } = {}) {
  const hit = cache.get(url);
  const now = Date.now();
  if (hit && now - hit.time < ttl) return Promise.resolve(hit.value);
  if (hit && hit.promise) return hit.promise;

  // Timeout propio: si el proxy no está disponible (por ejemplo corriendo el
  // front sin backend), la petición no queda colgada para siempre.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener?.("abort", () => controller.abort(), { once: true });

  const promise = fetch(url, { signal: controller.signal, headers: { accept: "application/json" } })
    .then(async (response) => {

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new FriendlyError(
          payload?.message || "No pudimos obtener la información de transporte.",
          payload?.error || String(response.status),
        );
      }
      cache.set(url, { time: Date.now(), value: payload });
      return payload;
    })
    .catch((error) => {
      cache.delete(url);
      if (error?.name === "AbortError") throw error;
      if (error instanceof FriendlyError) throw error;
      throw new FriendlyError("No pudimos conectarnos. Revisá tu conexión.", "network");
    })
    .finally(() => clearTimeout(timer));


  cache.set(url, { time: now, promise, value: hit?.value });
  return promise;
}

export function getStale(url) {
  return cache.get(url)?.value ?? null;
}
