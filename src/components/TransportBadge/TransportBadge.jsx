import { Bus, TrainFront, TramFront } from "lucide-react";

import "./TransportBadge.css";

const CONFIG = {
  colectivo: { Icon: Bus, label: "Colectivo" },
  subte: { Icon: TramFront, label: "Subte" },
  tren: { Icon: TrainFront, label: "Tren" },
};

export function TransportBadge({ mode, color, children }) {
  const config = CONFIG[mode] || CONFIG.colectivo;
  const Icon = config.Icon;
  return (
    <span className="mba-transport-badge" style={color ? { background: color, color: "#fff" } : undefined}>
      <Icon size={15} aria-hidden="true" />
      <span>{children || config.label}</span>
    </span>
  );
}

export function transportName(mode) {
  return (CONFIG[mode] || CONFIG.colectivo).label;
}
