import { Crosshair, Minus, Plus } from "lucide-react";

import "./MapControls.css";

export function MapControls({ onZoomIn, onZoomOut, onRecenter }) {
  return (
    <div className="mba-mapctl">
      <button type="button" onClick={onZoomIn} aria-label="Acercar">
        <Plus size={18} aria-hidden="true" />
      </button>
      <button type="button" onClick={onZoomOut} aria-label="Alejar">
        <Minus size={18} aria-hidden="true" />
      </button>
      <button type="button" onClick={onRecenter} aria-label="Volver a mi ubicación">
        <Crosshair size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
