import { ArrowDown, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../components/Button/Button";
import { RouteCard } from "../../components/RouteCard/RouteCard";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { StateMessage } from "../../components/StateMessage/StateMessage";
import { useApp } from "../../context/AppContext";
import { useAddressSearch } from "../../hooks/useAddressSearch";
import { useGeolocation } from "../../hooks/useGeolocation";
import { getRouteOptions } from "../../services/transportApi";
import { getNearbyStations } from "../../data/subteStations";
import { getRecentSearches, saveRecentSearches } from "../../utils/storage";
import "./RoutePlanner.css";

export function RoutePlanner() {
  const { location } = useApp();
  const { request } = useGeolocation();
  const [destination, setDestination] = useState(null);
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState(null);
  const [recent, setRecent] = useState([]);

  // Cuando ya se eligió un destino, el texto del input es esa dirección:
  // se omite la búsqueda para no volver a llamar a la API en bucle.
  const { results, loading, error } = useAddressSearch(query, {
    skip: destination?.label ?? null,
  });

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const chooseDestination = (result) => {
    setDestination(result);
    setQuery(result.label);
    const next = [result, ...recent.filter((item) => item.label !== result.label)];
    setRecent(next);
    saveRecentSearches(next);
  };

  const searchRoutes = async () => {
    setPlanError(null);
    try {
      const response = await getRouteOptions({ origin: location, destination });
      setPlan(response);
    } catch {
      setPlan(null);
      setPlanError("No pudimos calcular el viaje ahora mismo. Intentá de nuevo en unos minutos.");
    }
  };

  // Calcular estaciones cercanas al origen para mostrar en el planificador
  const nearbyStations = location ? getNearbyStations(location.lat, location.lon, 1500) : [];

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

      {error ? <p className="mba-planner__hint">{error}</p> : null}

      {destination == null && results.length ? (
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

      {nearbyStations.length > 0 && location ? (
        <div className="mba-planner__nearby">
          <SectionHeader title="Estaciones cercanas" />
          <ul className="mba-planner__stations">
            {nearbyStations.slice(0, 5).map((station) => (
              <li key={station.id}>
                <button
                  type="button"
                  onClick={() =>
                    chooseDestination({
                      label: station.name + " (Línea " + station.line + ")",
                      lat: station.lat,
                      lon: station.lon,
                    })
                  }
                >
                  <MapPin size={15} aria-hidden="true" />
                  {station.name}
                  <span className="mba-planner__station-line">Línea {station.line}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button full disabled={!location || !destination} onClick={searchRoutes}>
        Buscar rutas
      </Button>

      {planError ? (
        <div className="mba-planner__unavailable">
          <StateMessage tone="warn" title="No se pudo buscar" description={planError} />
        </div>
      ) : null}

      {plan?.unavailable ? (
        <div className="mba-planner__unavailable">
          <StateMessage
            tone="warn"
            title="Planificador no disponible"
            description={plan.reason || "El planificador de viajes no está implementado en esta versión."}
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
