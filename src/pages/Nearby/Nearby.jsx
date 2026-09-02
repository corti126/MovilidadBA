import { Link } from "@tanstack/react-router";
import { MapPin, Search, TriangleAlert } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { AlertCard } from "../../components/AlertCard/AlertCard";
import { BottomSheet } from "../../components/BottomSheet/BottomSheet";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { ErrorState } from "../../components/ErrorState/ErrorState";
import { PermissionState } from "../../components/PermissionState/PermissionState";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { SkeletonCard } from "../../components/SkeletonCard/SkeletonCard";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TransportCard } from "../../components/TransportCard/TransportCard";
import { TransportFilter } from "../../components/TransportFilter/TransportFilter";
import { useApp } from "../../context/AppContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import { useTransport } from "../../hooks/useTransport";
import { getAlerts, getColectivosNearby, getSubtePredictions } from "../../services/transportApi";
import { haversineMeters, walkingMinutes } from "../../utils/distance";
import { formatDistance, formatMinutes, formatRelativeUpdate } from "../../utils/formatters";
import { STATUS, isDisruptive } from "../../utils/serviceStatus";
import { rankServices } from "../../utils/transportRanking";
import "./Nearby.css";

function minutesUntil(timestamp) {
  if (!timestamp) return null;
  const diff = (timestamp - Date.now()) / 60000;
  if (diff < -2 || diff > 90) return null;
  return Math.max(0, diff);
}

export function Nearby({ onOpenLocation }) {
  const { filter, setFilter, location } = useApp();
  const { status: geoStatus, request } = useGeolocation();
  const [selected, setSelected] = useState(null);

  const fetchNearby = useCallback(
    async ({ signal }) => {
      const [subte, colectivos, alerts] = await Promise.allSettled([
        getSubtePredictions({ signal }),
        location ? getColectivosNearby({ signal }) : Promise.resolve({ vehicles: [] }),
        getAlerts({ signal }),
      ]);

      if (
        subte.status === "rejected" &&
        colectivos.status === "rejected" &&
        alerts.status === "rejected"
      ) {
        throw subte.reason;
      }

      return {
        predictions: subte.status === "fulfilled" ? subte.value.predictions : [],
        vehicles: colectivos.status === "fulfilled" ? colectivos.value.vehicles : [],
        alerts: alerts.status === "fulfilled" ? alerts.value.alerts : [],
      };
    },
    [location],
  );

  const { data, loading, error, updatedAt, refresh } = useTransport(fetchNearby, {
    intervalMs: 30000,
    deps: [location?.lat, location?.lon],
  });

  const alertsByLine = useMemo(() => {
    const map = new Map();
    (data?.alerts || []).forEach((alert) => {
      if (alert.lineId) map.set(String(alert.lineId).toLowerCase(), alert);
    });
    return map;
  }, [data]);

  const services = useMemo(() => {
    if (!data) return [];
    const list = [];

    const bestBySubteLine = new Map();
    data.predictions.forEach((prediction) => {
      const minutes = minutesUntil(prediction.arrivalAt);
      const key = prediction.lineId || prediction.lineName;
      if (!key) return;
      const current = bestBySubteLine.get(key);
      if (!current || (minutes != null && (current.minutes == null || minutes < current.minutes))) {
        bestBySubteLine.set(key, { prediction, minutes });
      }
    });

    bestBySubteLine.forEach(({ prediction, minutes }, key) => {
      const alert = alertsByLine.get(String(key).toLowerCase());
      list.push({
        id: "subte-" + key,
        mode: "subte",
        badge: "Subte",
        color: prediction.color,
        title: prediction.lineName || "Subte",
        subtitle: prediction.stopName || null,
        waitMinutes: minutes,
        realtime: true,
        status: alert ? alert.status : STATUS.NORMAL,
        favorite: { id: "line:" + key, kind: "line", mode: "subte", label: prediction.lineName },
        detail: prediction,
      });
    });

    if (location) {
      const grouped = new Map();
      data.vehicles.forEach((vehicle) => {
        const distance = haversineMeters(location, vehicle.position);
        if (distance == null || distance > 1200) return;
        const key = vehicle.lineId || vehicle.id;
        const current = grouped.get(key);
        if (!current || distance < current.distance) grouped.set(key, { vehicle, distance });
      });

      grouped.forEach(({ vehicle, distance }, key) => {
        list.push({
          id: "colectivo-" + key,
          mode: "colectivo",
          badge: "Colectivo",
          title: vehicle.lineName || "Colectivo",
          subtitle: vehicle.headsign || "Vehículo en circulación cerca",
          distanceMeters: distance,
          walkMinutes: walkingMinutes(distance),
          waitMinutes: null,
          realtime: true,
          status: STATUS.NORMAL,
          favorite: { id: "line:colectivo-" + key, kind: "line", mode: "colectivo", label: vehicle.lineName },
          detail: vehicle,
        });
      });
    }

    const filtered = filter === "all" ? list : list.filter((service) => service.mode === filter);
    return rankServices(filtered).slice(0, 8);
  }, [data, filter, location, alertsByLine]);

  const disruptions = useMemo(
    () => (data?.alerts || []).filter((alert) => isDisruptive(alert.status)).slice(0, 4),
    [data],
  );

  const [openAlert, setOpenAlert] = useState(null);

  return (
    <div className="mba-page mba-nearby">
      <section className="mba-nearby__hero">
        <h1>Lo más útil cerca tuyo</h1>
        <button type="button" className="mba-nearby__place" onClick={onOpenLocation}>
          <MapPin size={15} aria-hidden="true" />
          {location
            ? location.source === "device"
              ? "Usando tu ubicación" + (location.label && location.label !== "Tu ubicación" ? " · " + location.label : "")
              : location.label
            : "Elegí tu ubicación"}
        </button>

        <Link to="/como-llegar" className="mba-nearby__search">
          <Search size={18} aria-hidden="true" />
          ¿A dónde querés ir?
        </Link>
      </section>

      {!location ? (
        <PermissionState
          denied={geoStatus === "denied" || geoStatus === "unsupported"}
          onAllow={request}
          onManual={onOpenLocation}
        />
      ) : null}

      {disruptions.length ? (
        <section aria-labelledby="mba-alerts-title">
          <SectionHeader
            title="Hay problemas en el transporte"
            subtitle="Servicios con demoras, interrupciones u obras"
          />
          <div id="mba-alerts-title" className="mba-nearby__alerts">
            {disruptions.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onOpen={setOpenAlert} />
            ))}
          </div>
        </section>
      ) : null}

      <SectionHeader
        title="Cerca tuyo"
        subtitle={updatedAt ? formatRelativeUpdate(updatedAt) : "Buscando servicios"}
      />

      <TransportFilter value={filter} onChange={setFilter} />

      <div className="mba-nearby__list">
        {loading && !data ? <SkeletonCard count={3} /> : null}

        {!loading && error && !services.length ? <ErrorState onRetry={refresh} /> : null}

        {!loading && !error && !services.length ? (
          <EmptyState
            title="No encontramos transporte cerca tuyo"
            description={
              location
                ? "Probá con otro filtro o cambiá la ubicación."
                : "Elegí una ubicación para ver qué tenés cerca."
            }
          />
        ) : null}

        {services.map((service) => (
          <TransportCard key={service.id} service={service} onOpen={setSelected} />
        ))}
      </div>

      {error && services.length ? (
        <p className="mba-nearby__stale">
          No pudimos actualizar todo. Mostramos la última información disponible.
        </p>
      ) : null}

      <BottomSheet
        open={Boolean(selected)}
        title={selected?.title || ""}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <dl className="mba-nearby__detail">
            <div>
              <dt>Estado</dt>
              <dd>
                <StatusBadge status={selected.status} />
              </dd>
            </div>
            <div>
              <dt>Próximo servicio</dt>
              <dd>{formatMinutes(selected.waitMinutes) || "Información no disponible"}</dd>
            </div>
            <div>
              <dt>Distancia</dt>
              <dd>{formatDistance(selected.distanceMeters) || "Información no disponible"}</dd>
            </div>
            <div>
              <dt>Origen del dato</dt>
              <dd>{selected.realtime ? "Tiempo real (API oficial)" : "Horario programado"}</dd>
            </div>
          </dl>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={Boolean(openAlert)}
        title={openAlert?.lineName || "Detalle del servicio"}
        onClose={() => setOpenAlert(null)}
      >
        {openAlert ? (
          <div className="mba-nearby__alert-detail">
            <StatusBadge status={openAlert.status} />
            <h3>
              <TriangleAlert size={16} aria-hidden="true" /> {openAlert.title}
            </h3>
            <p>{openAlert.description || "Información no disponible"}</p>
            <p className="mba-nearby__alert-updated">
              {formatRelativeUpdate(openAlert.updatedAt) || "Sin fecha de actualización"}
            </p>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
