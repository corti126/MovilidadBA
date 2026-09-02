import "./StateMessage.css";

/** Base visual compartida por los estados vacío / error / offline / permisos. */
export function StateMessage({ icon: Icon, tone = "neutral", title, description, action }) {
  return (
    <div className={"mba-state mba-state--" + tone} role="status">
      {Icon ? (
        <span className="mba-state__icon">
          <Icon size={22} aria-hidden="true" />
        </span>
      ) : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div className="mba-state__action">{action}</div> : null}
    </div>
  );
}
