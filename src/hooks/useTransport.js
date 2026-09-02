import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Ejecuta un fetch de transporte con auto-refresco, aborto al desmontar y
 * protección contra race conditions. No refresca si la pestaña no está visible.
 */
export function useTransport(fetcher, { intervalMs = 30000, enabled = true, deps = [] } = {}) {
  const [state, setState] = useState({
    data: null,
    loading: enabled,
    error: null,
    updatedAt: null,
  });
  const requestId = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async (signal) => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, loading: !prev.data, error: null }));
    try {
      const data = await fetcherRef.current({ signal });
      if (id !== requestId.current) return;
      setState({ data, loading: false, error: null, updatedAt: Date.now() });
    } catch (error) {
      if (error?.name === "AbortError" || id !== requestId.current) return;
      setState((prev) => ({
        data: prev.data,
        loading: false,
        error: error?.message || "No pudimos actualizar la información.",
        updatedAt: prev.updatedAt,
      }));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    run(controller.signal);

    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      run(controller.signal);
    }, intervalMs);

    return () => {
      controller.abort();
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMs, run, ...deps]);

  return { ...state, refresh: () => run() };
}
