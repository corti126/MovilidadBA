import { ChevronRight } from "lucide-react";

import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import "./LineCard.css";

export function LineCard({ line, status, subtitle, favorite, onOpen }) {
  return (
    <article className="mba-linecard">
      <button type="button" className="mba-linecard__main" onClick={() => onOpen?.(line)}>
        <span className="mba-linecard__mark" style={{ background: line.color }} aria-hidden="true">
          {line.short}
        </span>
        <span className="mba-linecard__text">
          <span className="mba-linecard__name">{line.name}</span>
          {subtitle ? <span className="mba-linecard__sub">{subtitle}</span> : null}
        </span>
        <StatusBadge status={status} compact />
        <ChevronRight size={18} className="mba-linecard__chevron" aria-hidden="true" />
      </button>
      {favorite ? <FavoriteButton favorite={favorite} /> : null}
    </article>
  );
}
