import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useCallback, useMemo } from "react";

import { ErrorState } from "../../components/ErrorState/ErrorState";
import { FavoriteButton } from "../../components/FavoriteButton/FavoriteButton";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { SkeletonCard } from "../../components/SkeletonCard/SkeletonCard";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { findSubteLine } from "../../data/subteLines";
import { findTrenLine } from "../../data/trenLines";
import { useTransport } from "../../hooks/useTransport";
import { getAlerts, getSubtePredictions } from "../../services/transportApi";
import { formatClock, formatMinutes } from "../../utils/formatters";
import { STATUS } from "../../utils/serviceStatus";
import "./LineDetail.css";

export function LineDetail({ mode, id }) {
  const line = mode === "subte" ? findSubteLine(id) : findTrenLine(id);

  const fetcher = useCallback(
    async ({ signal }) => {
      const [alerts, predictions] = await Promise.allSettled([
        getAlerts({ signal }),
        mode === "subte" ? getSubtePredictions({ signal }) : Promise.resolve({ predictions: [] }),
      ]);
      return {
        alerts: alerts.status === "fulfilled" ? alerts.value.alerts : [],
        predictions: predictions.status === "fulfilled" ? predictions.value.predictions : [],
        failed: alerts.status === "rejected" && predictions.status === "rejected",
      };
    },
    [mode],
  );

  const { data, loading, error, refresh } = useTransport(fetcher, { intervalMs: 30000 });

  const alert = useMemo(() => {
    if (!line) return null;
    return (data?.alerts || []).find(
      (item) =>
        String(item.lineId || "").toLowerCase() === line.id.toLowerCase() ||
        String(item.lineName || "").toLowerCase() === line.name.toLowerCase(),
    );
  }, [data, line]);

  const stops = useMemo(() => {
    if (!line || mode !== "subte") return [];
    const list = (data?.predictions || []).filter(
      (prediction) => String(prediction.lineId || "").toLowerCase() === line.id.toLowerCase(),
    );
    const seen = new Map();
    list.forEach((prediction) => {
      if (!prediction.stopName) return;
      const current = seen.get(prediction.stopName);
      if (!current || (prediction.arrivalAt && prediction.arrivalAt < current.arrivalAt)) {
        seen.set(prediction.stopName, prediction);
      }
    });
    return Array.from(seen.values()).slice(0, 40);
  }, [data, line, mode]);

  if (!line) {
    return (
      <div className="mba-page mba-linedetail">
        <BackLink />
        <p className="mba-linedetail__empty">No encontramos esa línea.</p>
      </div>
    );
  }

  const status = alert ? alert.status : data ? STATUS.NORMAL : STATUS.UNKNOWN;

  return (
    <div className="mba-page mba-linedetail">
      <BackLink />

      <header className="mba-linedetail__head">
        <span className="mba-linedetail__mark" style={{ background: line.color }} aria-hidden="true">
          {line.short}
        </span>
        <div className="mba-linedetail__title">
          <h1>{line.name}</h1>
          <p>{mode === "subte" ? "Subte de Buenos Aires" : "Línea ferroviaria"}</p>
        </div>
        <FavoriteButton favorite={{ id: "line:" + line.id, kind: "line", mode, label: line.name }} />
      </header>

      <div className="mba-linedetail__status">
        <StatusBadge status={status} />
        {alert?.description ? <p>{alert.description}</p> : null}
      </div>

      <SectionHeader
        title={mode === "subte" ? "Próximos servicios" : "Servicio"}
        subtitle={mode === "subte" ? "Tiempo real de la API oficial" : null}
      />

      {loading && !data ? <SkeletonCard count={2} /> : null}
      {error && !data ? <ErrorState onRetry={refresh} /> : null}

      {mode === "subte" ? (
        stops.length ? (
          <ul className="mba-linedetail__stops">
            {stops.map((stop) => (
              <li key={stop.id}>
                <span className="mba-linedetail__stop">{stop.stopName}</span>
                <span className="mba-linedetail__time">
                  {formatMinutes(
                    stop.arrivalAt ? Math.max(0, (stop.arrivalAt - Date.now()) / 60000) : null,
                  ) || "Sin datos"}
                </span>
                <span className="mba-linedetail__clock">{formatClock(stop.arrivalAt) || ""}</span>
              </li>
            ))}
          </ul>
        ) : !loading ? (
          <p className="mba-linedetail__empty">
            No hay información de arribos en este momento para esta línea.
          </p>
        ) : null
      ) : (
        <p className="mba-linedetail__empty">
          El detalle de ramales, estaciones y horarios ferroviarios se muestra cuando el endpoint
          oficial correspondiente esté conectado en el proxy.
        </p>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/lines" className="mba-linedetail__back">
      <ChevronLeft size={18} aria-hidden="true" />
      Líneas
    </Link>
  );
}
