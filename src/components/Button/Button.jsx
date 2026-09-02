import "./Button.css";

export function Button({
  children,
  variant = "primary",
  size = "md",
  full = false,
  type = "button",
  ...rest
}) {
  const className = ["mba-button", "mba-button--" + variant, "mba-button--" + size, full ? "mba-button--full" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}
