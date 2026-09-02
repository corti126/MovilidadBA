import { Bus, Footprints, TrainFront, TramFront } from "lucide-react";

import "./RouteStep.css";

const ICONS = { walk: Footprints, colectivo: Bus, subte: TramFront, tren: TrainFront };

export function RouteStep({ step, last = false }) {
  const Icon = ICONS[step.mode] || Footprints;
  return (
    <li className="mba-step">
      <span className="mba-step__rail" aria-hidden="true">
        <span className="mba-step__icon" style={step.color ? { background: step.color } : undefined}>
          <Icon size={15} />
        </span>
        {!last ? <span className="mba-step__line" /> : null}
      </span>
      <span className="mba-step__text">
        <span className="mba-step__title">{step.title}</span>
        {step.detail ? <span className="mba-step__detail">{step.detail}</span> : null}
      </span>
    </li>
  );
}
