import { ArrowDown, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../components/Button/Button";
import { RouteCard } from "../../components/RouteCard/RouteCard";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { StateMessage } from "../../components/StateMessage/StateMessage";
import { useApp } from "../../context/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import { useGeolocation } from "../../hooks/useGeolocation";
import { getRouteOptions } from "../../services/transportApi";
import { searchAddress } from "../../services/usigApi";
import { getRecentSearches, saveRecentSearches } from "../../utils/storage";
import "./RoutePlanner.css";

export function RoutePlanner() {
  const { location } = useApp();
  const { request } = useGeolocation();
  const [destination, setDestination] = useState(null);
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    if (debounced.trim().length < 3) {
      setResults([]);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    searchAddress(debounced, { signal: controller.signal })
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debounced]);

  const chooseDestination = (result) => {
    setDestination(result);
    setQuery(result.label);
    setResults([]);
    const next = [result, ...recent.filter((item) => item.label !== result.label)];
    setRecent(next);
    saveRecentSearches(next);
  };

  const searchRoutes = async () => {
    const response = await getRouteOptions({ origin: location, destination });
    setPlan(response);
  };

  return (
    <div className="mba-page mba-planner">
      <SectionHeader title="¿A dónde querés ir?" subtitle="Elegí origen y destino" />

      <div className="mba-planner__form">
        <div className="mba-planner__field">
          <span className="mba-planner__label">Origen</span>
          <button type="button" className="mba-planner__origin" onClick={request}>
            <LocateFixed size={17} aria-hidden="true" />
            {location ? location.label || "Mi ubicación" : "Usar mi ubicación"}
          </button>
        </div>

        <ArrowDown size={18} className="mba-planner__arrow" aria-hidden="true" />

        <div className="mba-planner__field">
          <span className="mba-planner__label">Destino</span>
          <SearchBar
            id="mba-destination"
            value={query}
            onChange={(value) => {
              setQuery(value);
              setDestination(null);
            }}
            loading={loading}
            placeholder="Escribir dirección o lugar"
            label="Buscar destino"
          />
        </div>
      </div>

      {results.length ? (
        <ul className="mba-planner__results">
          {results.map((result) => (
            <li key={result.id}>
              <button type="button" onClick={() => chooseDestination(result)}>
                <MapPin size={16} aria-hidden="true" />
                {result.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Button full disabled={!location || !destination} onClick={searchRoutes}>
        Buscar rutas
      </Button>

      {plan?.unavailable ? (
        <div className="mba-planner__unavailable">
          <StateMessage
            tone="warn"
            title="Planificador todavía no conectado"
            description={plan.reason}
          />
        </div>
      ) : null}

      {plan?.options?.length ? (
        <div className="mba-planner__options">
          {plan.options.map((option) => (
            <RouteCard key={option.id} option={option} />
          ))}
        </div>
      ) : null}

      {recent.length ? (
        <>
          <SectionHeader title="Búsquedas recientes" />
          <ul className="mba-planner__recent">
            {recent.map((item) => (
              <li key={item.label}>
                <button type="button" onClick={() => chooseDestination(item)}>
                  <MapPin size={15} aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
