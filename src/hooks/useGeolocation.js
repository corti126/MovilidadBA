import { useCallback, useState } from "react";

import { useApp } from "../context/AppContext";
import { reverseGeocode } from "../services/usigApi";

/** Pide ubicación solo cuando se la invoca explícitamente. */
export function useGeolocation() {
  const { location, setLocation } = useApp();
  const [status, setStatus] = useState("idle");

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          source: "device",
          label: "Tu ubicación",
        };
        setLocation(coords);
        setStatus("granted");
        try {
          const place = await reverseGeocode(coords);
          if (place?.neighborhood || place?.label) {
            setLocation({ ...coords, label: place.neighborhood || place.label });
          }
        } catch {
          /* la ubicación sigue siendo válida sin nombre de barrio */
        }
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [setLocation]);

  return { location, status, request, setLocation };
}
