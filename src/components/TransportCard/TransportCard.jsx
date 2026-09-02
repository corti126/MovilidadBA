import { ChevronRight } from "lucide-react";

import { formatDistance, formatMinutes } from "../../utils/formatters";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { TransportBadge } from "../TransportBadge/TransportBadge";
import "./TransportCard.css";

/** Tarjeta compacta: solo lo necesario para decidir. El detalle se abre al tocar. */
export function TransportCard({ service, onOpen }) {
  const distance = formatDistance(service.distanceMeters);
  const wait = formatMinutes(service.waitMinutes);

  return (
    <article className={"mba-tcard" + (service.highlight ? " is-highlighted" : "")}>
      <button
        type="button"
        className="mba-tcard__main"
        onClick={() => onOpen?.(service)}
        aria-label={"Ver detalle de " + service.title}
      >
        <div className="mba-tcard__top">
          <TransportBadge mode={service.mode} color={service.color}>
            {service.badge}
          </TransportBadge>
          {service.highlight ? <span className="mba-tcard__flag">{service.highlight}</span> : null}
        </div>

        <h3 className="mba-tcard__title">{service.title}</h3>
        {service.subtitle ? <p className="mba-tcard__subtitle">{service.subtitle}</p> : null}

        <div className="mba-tcard__meta">
          <span className="mba-tcard__time">
            {wait || <span className="mba-tcard__muted">Sin horario en vivo</span>}
          </span>
          {distance ? <span className="mba-tcard__dot" aria-hidden="true" /> : null}
          {distance ? <span className="mba-tcard__distance">a {distance}</span> : null}
          <StatusBadge status={service.status} compact />
        </div>
      </button>

      <div className="mba-tcard__side">
        {service.favorite ? <FavoriteButton favorite={service.favorite} /> : null}
        <ChevronRight size={18} className="mba-tcard__chevron" aria-hidden="true" />
      </div>
    </article>
  );
}
