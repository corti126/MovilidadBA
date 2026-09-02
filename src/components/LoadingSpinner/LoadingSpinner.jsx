import "./LoadingSpinner.css";

export function LoadingSpinner({ label = "Cargando" }) {
  return (
    <span className="mba-spinner" role="status" aria-live="polite">
      <span className="mba-spinner__ring" aria-hidden="true" />
      <span className="mba-visually-hidden">{label}</span>
    </span>
  );
}
