import { Bus, LayoutGrid, TrainFront, TramFront } from "lucide-react";

import "./TransportFilter.css";

const OPTIONS = [
  { value: "all", label: "Todos", icon: LayoutGrid },
  { value: "colectivo", label: "Colectivos", icon: Bus },
  { value: "subte", label: "Subtes", icon: TramFront },
  { value: "tren", label: "Trenes", icon: TrainFront },
];

export function TransportFilter({ value, onChange }) {
  return (
    <div className="mba-filter" role="group" aria-label="Filtrar por medio de transporte">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={"mba-filter__chip" + (active ? " is-active" : "")}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
          >
            <Icon size={16} aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
