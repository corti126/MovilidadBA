/** Catálogo estático mínimo de UI de las líneas ferroviarias del AMBA.
 *  Ramales, estados y horarios se obtienen de la API oficial. */
export const TREN_LINES = [
  { id: "mitre", name: "Mitre", short: "MIT", color: "#1a7f5a" },
  { id: "sarmiento", name: "Sarmiento", short: "SAR", color: "#c14b16" },
  { id: "roca", name: "Roca", short: "ROC", color: "#1a5fa8" },
  { id: "san-martin", name: "San Martín", short: "SMA", color: "#8a2f8f" },
  { id: "belgrano-sur", name: "Belgrano Sur", short: "BSU", color: "#b3241f" },
  { id: "belgrano-norte", name: "Belgrano Norte", short: "BNO", color: "#c99700" },
  { id: "urquiza", name: "Urquiza", short: "URQ", color: "#0f7f8f" },
  { id: "tren-de-la-costa", name: "Tren de la Costa", short: "TDC", color: "#2f7fbf" },
];

export function findTrenLine(id) {
  if (!id) return null;
  const key = String(id).toLowerCase();
  return TREN_LINES.find((line) => line.id === key || key.includes(line.id)) || null;
}
