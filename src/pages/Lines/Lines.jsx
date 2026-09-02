import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { LineCard } from "../../components/LineCard/LineCard";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { SectionHeader } from "../../components/SectionHeader/SectionHeader";
import { SUBTE_LINES } from "../../data/subteLines";
import { TREN_LINES } from "../../data/trenLines";
import { useTransport } from "../../hooks/useTransport";
import { getAlerts } from "../../services/transportApi";
import { STATUS } from "../../utils/serviceStatus";
import "./Lines.css";

export function Lines() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const fetchAlerts = useCallback(({ signal }) => getAlerts({ signal }), []);
  const { data, error } = useTransport(fetchAlerts, { intervalMs: 120000 });

  const statusFor = useCallback(
    (line) => {
      const alerts = data?.alerts || [];
      const match = alerts.find(
        (alert) =>
          String(alert.lineId || "").toLowerCase() === line.id.toLowerCase() ||
          String(alert.lineName || "").toLowerCase() === line.name.toLowerCase(),
      );
      if (match) return match.status;
      return data ? STATUS.NORMAL : STATUS.UNKNOWN;
    },
    [data],
  );

  const matches = useCallback(
    (lines) =>
      query.trim()
        ? lines.filter((line) => line.name.toLowerCase().includes(query.trim().toLowerCase()))
        : lines,
    [query],
  );

  const subtes = useMemo(() => matches(SUBTE_LINES), [matches]);
  const trenes = useMemo(() => matches(TREN_LINES), [matches]);

  return (
    <div className="mba-page mba-lines">
      <SectionHeader title="Líneas" subtitle="Subtes y trenes" />

      <SearchBar
        id="mba-lines-search"
        value={query}
        onChange={setQuery}
        placeholder="Buscar una línea"
        label="Buscar una línea de subte o tren"
      />

      {error ? (
        <p className="mba-lines__notice">
          No pudimos actualizar el estado de las líneas. Mostramos el listado igual.
        </p>
      ) : null}

      <SectionHeader title="Subtes" />
      <div className="mba-lines__list">
        {subtes.map((line) => (
          <LineCard
            key={line.id}
            line={line}
            status={statusFor(line)}
            favorite={{ id: "line:" + line.id, kind: "line", mode: "subte", label: line.name }}
            onOpen={() =>
              navigate({ to: "/lines/$mode/$id", params: { mode: "subte", id: line.id } })
            }
          />
        ))}
      </div>

      <SectionHeader title="Trenes" />
      <div className="mba-lines__list">
        {trenes.map((line) => (
          <LineCard
            key={line.id}
            line={line}
            status={statusFor(line)}
            subtitle="Línea ferroviaria"
            favorite={{ id: "line:" + line.id, kind: "line", mode: "tren", label: line.name }}
            onOpen={() =>
              navigate({ to: "/lines/$mode/$id", params: { mode: "tren", id: line.id } })
            }
          />
        ))}
      </div>
    </div>
  );
}
