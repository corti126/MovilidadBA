import { useCallback, useMemo, useState } from "react";

import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { Button } from "../../components/Button/Button";
import { MapCanvas } from "../../components/MapCanvas/MapCanvas";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TransportFilter } from "../../components/TransportFilter/TransportFilter";
import { useApp } from "../../context/AppContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useTransport } from "../../hooks/useTransport";
import { getColectivosNearby, getSubtePredictions } from "../../services/transportApi";
import { getNearbyStations } from "../../data/subteStations";
import { haversineMeters } from "../../utils/distance";
import { formatDistance } from "../../utils/formatters";
import { STATUS } from "../../utils/serviceStatus";
import "./Map.css";

export function MapPage({ onOpenLocation }) {
  const { location, filter, setFilter } = useApp();
  const { request } = useGeolocation();
  const [selected, setSelected] = useState(null);

  const fetcher = useCallback(
    async ({ signal }) => {
      const [colectivos, subte] = await Promise.allSettled([
        getColectivosNearby({ signal }),
        getSubtePredictions({ signal }),
      ]);
      return {
        vehicles: colectivos.status === "fulfilled" ? colectivos.value.vehicles : [],
        predictions: subte.status === "fulfilled" ? subte.value.predictions : [],
      };
    },
    [],
  );
  const { data, error } = useTransport(fetcher, { intervalMs: 30000, enabled: Boolean(location) });

  const markers = useMemo(() => {
    if (!location) return [];
    const allMarkers = [];

    // Agregar estaciones de subte si el filtro lo permite
    if (filter === "all" || filter === "subte") {
      const stations = getNearbyStations(location.lat, location.lon, 3000);
      stations.forEach((station) => {
        allMarkers.push({
          id: "subte-" + station.id,
          mode: "subte",
          short: station.line,
          title: station.name,
          subtitle: "Línea " + station.line,
          position: { lat: station.lat, lon: station.lon },
          distance: station.distance,
        });
      });
    }

    // Agregar colectivos si el filtro lo permite
    if (filter === "all" || filter === "colectivo") {
      if (data?.vehicles) {
        data.vehicles.forEach((vehicle) => {
          const distance = haversineMeters(location, vehicle.position);
          if (distance != null && distance < 3000) {
            allMarkers.push({
              id: vehicle.id,
              mode: "colectivo",
              short: vehicle.lineId ? String(vehicle.lineId).slice(0, 4) : "",
              title: vehicle.lineName || "Colectivo",
              subtitle: vehicle.headsign,
              position: vehicle.position,
              distance: distance,
            });
          }
        });
      }
    }

    return allMarkers;
  }, [data, location, filter]);

  return (
    <div className="mba-mappage">
      <div className="mba-mappage__filters">
        <TransportFilter value={filter} onChange={setFilter} />
      </div>

      <div className="mba-mappage__canvas">
        {location ? (
          <MapCanvas center={location} markers={markers} onSelectMarker={setSelected} />
        ) : (
          <div className="mba-mappage__permission">
            <p>Necesitamos tu ubicación para mostrarte el mapa.</p>
            <div className="mba-mappage__permission-actions">
              <Button onClick={request}>Usar mi ubicación</Button>
              <Button variant="secondary" onClick={onOpenLocation}>
                Elegir dirección
              </Button>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <p className="mba-mappage__notice">No pudimos actualizar los vehículos en el mapa.</p>
      ) : null}

      <BottomSheet
        open={Boolean(selected)}
        title={selected?.title || ""}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="mba-mappage__detail">
            <StatusBadge status={STATUS.NORMAL} />
            <p className="mba-mappage__detail-sub">{selected.subtitle || "Transporte"}</p>
            <p className="mba-mappage__detail-distance">
              A {formatDistance(selected.distance) || "distancia no disponible"} de tu ubicación
            </p>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
