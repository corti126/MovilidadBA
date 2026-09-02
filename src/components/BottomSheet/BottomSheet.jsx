import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import "./BottomSheet.css";

export function BottomSheet({ open, title, onClose, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open || typeof document === "undefined") return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mba-sheet" role="presentation" onClick={onClose}>
      <div
        className="mba-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mba-sheet__grab" aria-hidden="true" />
        <div className="mba-sheet__head">
          <h2>{title}</h2>
          <button type="button" className="mba-sheet__close" onClick={onClose} aria-label="Cerrar">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="mba-sheet__body">{children}</div>
      </div>
    </div>
  );
}
