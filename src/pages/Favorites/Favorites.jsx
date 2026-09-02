import { Link } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { useFavorites } from "../../hooks/useFavorites";
import { useTransport } from "../../hooks/useTransport";
import { getAlerts } from "../../services/transportApi";
import { STATUS, isDisruptive } from "../../utils/serviceStatus";
import "./Favorites.css";

export function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  const fetchAlerts = useCallback(({ signal }) => getAlerts({ signal }), []);
  const { data } = useTransport(fetchAlerts, { intervalMs: 90000, enabled: favorites.length > 0 });

  const statusFor = useCallback(
    (favorite) => {
      const alerts = data?.alerts || [];
      const match = alerts.find(
        (alert) =>
          alert.lineName &&
          favorite.label &&
          String(alert.lineName).toLowerCase() === String(favorite.label).toLowerCase(),
      );
      return match ? match.status : STATUS.UNKNOWN;
    },
    [data],
  );

  const sorted = useMemo(
    () =>
      [...favorites].sort(
        (a, b) => (isDisruptive(statusFor(b)) ? 1 : 0) - (isDisruptive(statusFor(a)) ? 1 : 0),
      ),
    [favorites, statusFor],
  );

  if (!favorites.length) {
    return (
      <div className="mba-page mba-favorites">
        <SectionHeader title="Favoritos" />
        <EmptyState
          icon={Heart}
          title="Guardá tus lugares y líneas favoritas"
          description="Tocá el corazón en cualquier línea o parada para tenerla siempre a mano. Se guarda solo en este dispositivo."
          action={
            <Link to="/">
              <Button>Explorar transporte</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mba-page mba-favorites">
      <SectionHeader title="Favoritos" subtitle="Guardados en este dispositivo" />
      <ul className="mba-favorites__list">
        {sorted.map((favorite) => {
          const status = statusFor(favorite);
          return (
            <li key={favorite.id} className="mba-favorites__item">
              <span className="mba-favorites__icon" aria-hidden="true">
                {favorite.kind === "place" ? <MapPin size={18} /> : <Heart size={18} />}
              </span>
              <span className="mba-favorites__text">
                <span className="mba-favorites__label">{favorite.label || "Favorito"}</span>
                <span className="mba-favorites__kind">
                  {favorite.kind === "place" ? "Lugar" : favorite.mode || "Línea"}
                </span>
              </span>
              {status !== STATUS.UNKNOWN ? <StatusBadge status={status} compact /> : null}
              <button
                type="button"
                className="mba-favorites__remove"
                onClick={() => toggleFavorite(favorite)}
              >
                Quitar
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
