import { formatMinutes } from "../../utils/formatters";
import { RouteStep } from "../RouteStep/RouteStep";
import "./RouteCard.css";

export function RouteCard({ option }) {
  return (
    <article className="mba-routecard">
      <header className="mba-routecard__head">
        {option.highlight ? <span className="mba-routecard__flag">{option.highlight}</span> : null}
        <span className="mba-routecard__total">{formatMinutes(option.totalMinutes)}</span>
      </header>
      <ol className="mba-routecard__steps">
        {option.steps.map((step, index) => (
          <RouteStep key={index} step={step} last={index === option.steps.length - 1} />
        ))}
      </ol>
    </article>
  );
}
