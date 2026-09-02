import { ChevronRight, TriangleAlert } from "lucide-react";

import { STATUS_META } from "../../utils/serviceStatus";
import "./AlertCard.css";

export function AlertCard({ alert, onOpen }) {
  const meta = STATUS_META[alert.status];
  return (
    <button type="button" className="mba-alertcard" onClick={() => onOpen?.(alert)}>
      <span className="mba-alertcard__icon" aria-hidden="true">
        <TriangleAlert size={18} />
      </span>
      <span className="mba-alertcard__text">
        <span className="mba-alertcard__line">{alert.lineName || "Servicio"}</span>
        <span className="mba-alertcard__status">{meta?.label || alert.title}</span>
      </span>
      <span className="mba-alertcard__cta">
        Ver detalles
        <ChevronRight size={16} aria-hidden="true" />
      </span>
    </button>
  );
}
