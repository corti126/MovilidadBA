/** Catálogo estático mínimo de UI (identidad de las líneas de subte de la
 *  Ciudad de Buenos Aires). Los estados, estaciones y tiempos vienen de la API. */
export const SUBTE_LINES = [
  { id: "LineaA", name: "Línea A", short: "A", color: "var(--subte-a)" },
  { id: "LineaB", name: "Línea B", short: "B", color: "var(--subte-b)" },
  { id: "LineaC", name: "Línea C", short: "C", color: "var(--subte-c)" },
  { id: "LineaD", name: "Línea D", short: "D", color: "var(--subte-d)" },
  { id: "LineaE", name: "Línea E", short: "E", color: "var(--subte-e)" },
  { id: "LineaH", name: "Línea H", short: "H", color: "var(--subte-h)" },
];

export function findSubteLine(id) {
  if (!id) return null;
  const key = String(id).toLowerCase().replace(/[^a-z]/g, "");
  return (
    SUBTE_LINES.find((line) => line.id.toLowerCase() === key) ||
    SUBTE_LINES.find((line) => key.endsWith(line.short.toLowerCase())) ||
    null
  );
}
