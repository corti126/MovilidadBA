import "./IconButton.css";

export function IconButton({ icon: Icon, label, active = false, ...rest }) {
  return (
    <button
      type="button"
      className={"mba-icon-button" + (active ? " is-active" : "")}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}
