import { transportName } from "../TransportBadge/TransportBadge";
import { TransportBadge } from "../TransportBadge/TransportBadge";
import "./PromotionCard.css";

export function PromotionCard({ promotion }) {
  return (
    <article className={"mba-promo" + (promotion.featured ? " is-featured" : "")}>
      <div className="mba-promo__head">
        <TransportBadge mode={promotion.transport}>
          {transportName(promotion.transport)}
        </TransportBadge>
        {promotion.placeholder ? <span className="mba-promo__tag">Placeholder</span> : null}
      </div>
      <p className="mba-promo__discount">{promotion.discount}</p>
      <h3 className="mba-promo__title">{promotion.title}</h3>
      <p className="mba-promo__description">{promotion.description}</p>
      <dl className="mba-promo__details">
        <div>
          <dt>Medio de pago</dt>
          <dd>{promotion.paymentMethod}</dd>
        </div>
        <div>
          <dt>Vigencia</dt>
          <dd>{promotion.validity}</dd>
        </div>
      </dl>
      <p className="mba-promo__conditions">{promotion.conditions}</p>
    </article>
  );
}
