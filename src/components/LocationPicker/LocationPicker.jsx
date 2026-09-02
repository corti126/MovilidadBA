import { LocateFixed, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { useDebounce } from "../../hooks/useDebounce";
import { useGeolocation } from "../../hooks/useGeolocation";
import { searchAddress } from "../../services/usigApi";
import { Button } from "../Button/Button";
import { BottomSheet } from "../BottomSheet/BottomSheet";
import { SearchBar } from "../SearchBar/SearchBar";
import "./LocationPicker.css";

export function LocationPicker({ open, onClose }) {
  const { request, status, setLocation } = useGeolocation();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || debounced.trim().length < 3) {
      setResults([]);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    searchAddress(debounced, { signal: controller.signal })
      .then(setResults)
      .catch((err) => {
        if (err?.name !== "AbortError") setError("No pudimos buscar esa dirección.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debounced, open]);

  return (
    <BottomSheet open={open} title="Tu ubicación" onClose={onClose}>
      <div className="mba-locpicker">
        <Button
          full
          onClick={() => {
            request();
            onClose?.();
          }}
        >
          <LocateFixed size={18} aria-hidden="true" />
          Usar mi ubicación
        </Button>
        {status === "denied" ? (
          <p className="mba-locpicker__hint">
            No tenemos permiso de ubicación. Escribí una dirección para continuar.
          </p>
        ) : null}

        <SearchBar
          id="mba-location-search"
          value={query}
          onChange={setQuery}
          loading={loading}
          label="Buscar una dirección de la Ciudad de Buenos Aires"
          placeholder="Av. Corrientes 1234"
        />

        {error ? <p className="mba-locpicker__hint">{error}</p> : null}

        <ul className="mba-locpicker__results">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => {
                  setLocation({
                    lat: result.lat,
                    lon: result.lon,
                    label: result.label,
                    source: "manual",
                  });
                  onClose?.();
                }}
              >
                <MapPin size={16} aria-hidden="true" />
                <span>{result.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {!loading && debounced.trim().length >= 3 && results.length === 0 && !error ? (
          <p className="mba-locpicker__hint">No encontramos esa dirección en la Ciudad.</p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
