import "./SectionHeader.css";

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mba-section-header">
      <div className="mba-section-header__text">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
