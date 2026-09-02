import { useCallback, useMemo, useRef, useState } from "react";

import { MapControls } from "../MapControls/MapControls";
import "./MapCanvas.css";

const BASE_SCALE = 90000; // px por grado a zoom 1

/**
 * Mapa liviano propio (sin dependencias ni tiles de terceros): proyecta las
 * coordenadas reales devueltas por la API oficial sobre un lienzo pan/zoom.
 * Pensado para reemplazarse por la cartografía oficial de BA/USIG cuando el
 * servicio de tiles esté habilitado para el proyecto.
 */
export function MapCanvas({ center, markers = [], onSelectMarker }) {
  const [zoom, setZoom] = useState(1.6);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const [size, setSize] = useState({ width: 360, height: 480 });
  const containerRef = useCallback((node) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
  }, []);

  const project = useCallback(
    (point) => {
      if (!center) return null;
      const scale = BASE_SCALE * zoom;
      const latRad = (center.lat * Math.PI) / 180;
      return {
        x: size.width / 2 + (point.lon - center.lon) * scale * Math.cos(latRad) + offset.x,
        y: size.height / 2 - (point.lat - center.lat) * scale + offset.y,
      };
    },
    [center, zoom, offset, size],
  );

  const visible = useMemo(() => {
    if (!center) return [];
    return markers
      .map((marker) => ({ marker, position: project(marker.position) }))
      .filter(
        ({ position }) =>
          position &&
          position.x > -40 &&
          position.y > -40 &&
          position.x < size.width + 40 &&
          position.y < size.height + 40,
      )
      .slice(0, 160);
  }, [markers, project, center, size]);

  const onPointerDown = (event) => {
    dragRef.current = { x: event.clientX, y: event.clientY, xBase: offset.x, yBase: offset.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.xBase + (event.clientX - drag.x),
      y: drag.yBase + (event.clientY - drag.y),
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div className="mba-map" ref={containerRef}>
      <div
        className="mba-map__surface"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Mapa de transporte"
      >
        <div className="mba-map__grid" aria-hidden="true" />

        {center ? (
          <span
            className="mba-map__me"
            style={{ left: project(center).x, top: project(center).y }}
            aria-label="Tu ubicación"
          />
        ) : null}

        {visible.map(({ marker, position }) => (
          <button
            key={marker.id}
            type="button"
            className={"mba-map__marker mba-map__marker--" + marker.mode}
            style={{ left: position.x, top: position.y }}
            onClick={() => onSelectMarker?.(marker)}
            aria-label={marker.title}
          >
            {marker.short || ""}
          </button>
        ))}
      </div>

      <MapControls
        onZoomIn={() => setZoom((z) => Math.min(6, z * 1.4))}
        onZoomOut={() => setZoom((z) => Math.max(0.5, z / 1.4))}
        onRecenter={() => setOffset({ x: 0, y: 0 })}
      />
    </div>
  );
}
