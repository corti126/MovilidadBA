import { useMemo, useState } from "react";

import { PromotionCard } from "../../components/PromotionCard/PromotionCard";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { TransportFilter } from "../../components/TransportFilter/TransportFilter";
import { PROMOTIONS, PROMOTIONS_ARE_PLACEHOLDER } from "../../data/promotions";
import "./Promotions.css";

export function Promotions() {
  const [filter, setFilter] = useState("all");

  const list = useMemo(
    () => (filter === "all" ? PROMOTIONS : PROMOTIONS.filter((p) => p.transport === filter)),
    [filter],
  );

  return (
    <div className="mba-page mba-promos">
      <SectionHeader title="Promos de transporte" subtitle="Beneficios de subte, tren y colectivos" />

      {PROMOTIONS_ARE_PLACEHOLDER ? (
        <p className="mba-promos__notice">
          Estos beneficios son ejemplos de estructura, todavía no son promociones reales. Se
          reemplazan editando <code>src/data/promotions.js</code>.
        </p>
      ) : null}

      <TransportFilter value={filter} onChange={setFilter} />

      <div className="mba-promos__list">
        {list.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
}
