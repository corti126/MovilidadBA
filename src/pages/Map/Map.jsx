import { useCallback, useMemo, useState } from "react";

import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { Button } from "../../components/Button/Button";
import { MapCanvas } from "../../components/MapCanvas/MapCanvas";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TransportFilter } from "../../components/TransportFilter/TransportFilter";
import { useApp } from "../../context/AppContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useTransport } from "../../hooks/useTransport";
import { getColectivosNearby } from "../../services/transportApi";
import { haversineMeters } from "../../utils/distance";
import { formatDistance } from "../../utils/formatters";
import { STATUS } from "../../utils/serviceStatus";
import "./Map.css";

export function MapPage({ onOpenLocation }) {
  const { location, filter, setFilter } = useApp();
  const { request } = useGeolocation();
  const [selected, setSelected] = useState(null);

  const fetcher = useCallback(({ signal }) => getColectivosNearby({ signal }), []);
  const { data, error } = useTransport(fetcher, { intervalMs: 30000, enabled: Boolean(location) });

  const markers = useMemo(() => {
    if (!location || !data?.vehicles) return [];
    if (filter === "subte" || filter === "tren") return [];
    return data.vehicles
      .map((vehicle) => ({
        id: vehicle.id,
        mode: "colectivo",
        short: vehicle.lineId ? String(vehicle.lineId).slice(0, 4) : "",
        title: vehicle.lineName || "Colectivo",
        subtitle: vehicle.headsign,
        position: vehicle.position,
        distance: haversineMeters(location, vehicle.position),
      }))
      .filter((marker) => marker.distance != null && marker.distance < 3000);
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

      {location && (filter === "subte" || filter === "tren") ? (
        <p className="mba-mappage__notice">
          Todavía no mostramos estaciones de {filter === "subte" ? "subte" : "tren"} en el mapa: la
          API oficial no expone sus coordenadas en los endpoints conectados.
        </p>
      ) : null}

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
            <p className="mba-mappage__detail-sub">{selected.subtitle || "Colectivo en circulación"}</p>
            <p className="mba-mappage__detail-distance">
              A {formatDistance(selected.distance) || "distancia no disponible"} de tu ubicación
            </p>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
