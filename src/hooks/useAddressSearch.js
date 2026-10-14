import { useEffect, useRef, useState } from "react";

import { searchAddress } from "../services/usigApi";
import { useDebounce } from "./useDebounce";

const MIN_LENGTH = 3;
const TIMEOUT_MS = 8000;
const MAX_FAILURES = 3;
const COOLDOWN_MS = 30000;

/**
 * Búsqueda de direcciones con debounce, aborto, timeout y cortocircuito.
 *
 * Si el servicio de direcciones falla varias veces seguidas (por ejemplo al
 * correr el proyecto sin backend disponible), la búsqueda se apaga por un rato
 * en lugar de reintentar sin control: así no hay bucles de red ni cuelgues.
 */
export function useAddressSearch(query, { delay = 450, enabled = true, skip = null } = {}) {
  const debounced = useDebounce(query, delay);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Refs: no disparan re-render ni re-ejecutan el efecto.
  const failures = useRef(0);
  const pausedUntil = useRef(0);
  const lastQuery = useRef(null);

  useEffect(() => {
    const text = String(debounced || "").trim();

    if (!enabled || text.length < MIN_LENGTH || (skip != null && text === String(skip).trim())) {
      setResults([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    // Consulta ya resuelta: no se vuelve a pedir.
    if (lastQuery.current === text) return undefined;

    if (Date.now() < pausedUntil.current) {
      setResults([]);
      setLoading(false);
      setError("El buscador de direcciones no está disponible. Probá de nuevo en un momento.");
      return undefined;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    setLoading(true);
    setError(null);

    searchAddress(text, { signal: controller.signal })
      .then((list) => {
        if (cancelled) return;
        failures.current = 0;
        lastQuery.current = text;
        setResults(Array.isArray(list) ? list : []);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        failures.current += 1;
        if (failures.current >= MAX_FAILURES) {
          pausedUntil.current = Date.now() + COOLDOWN_MS;
          failures.current = 0;
        }
        setResults([]);
        setError("No pudimos buscar esa dirección. Revisá tu conexión.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [debounced, enabled, skip]);

  return { results, loading, error, debounced, clearResults: () => setResults([]) };
}
