export const STATUS = {
  NORMAL: "normal",
  DELAYED: "delayed",
  REDUCED: "reduced",
  INTERRUPTED: "interrupted",
  SCHEDULED: "scheduled",
  UNKNOWN: "unknown",
};

export const STATUS_META = {
  [STATUS.NORMAL]: { label: "Servicio normal", tone: "ok", short: "Normal" },
  [STATUS.DELAYED]: { label: "Con demoras", tone: "warn", short: "Demorado" },
  [STATUS.REDUCED]: { label: "Servicio reducido", tone: "warn", short: "Reducido" },
  [STATUS.INTERRUPTED]: { label: "Servicio interrumpido", tone: "danger", short: "Interrumpido" },
  [STATUS.SCHEDULED]: { label: "Horario programado", tone: "info", short: "Programado" },
  [STATUS.UNKNOWN]: { label: "Sin información", tone: "neutral", short: "Sin datos" },
};

const KEYWORDS = [
  [STATUS.INTERRUPTED, ["interrump", "suspend", "no circula", "sin servicio", "cancelad"]],
  [STATUS.REDUCED, ["reducid", "limitad", "parcial", "obra", "servicio especial"]],
  [STATUS.DELAYED, ["demora", "retras", "lent"]],
];

/** Deriva un estado a partir del texto libre de una alerta oficial. */
export function statusFromAlertText(text) {
  if (!text) return STATUS.UNKNOWN;
  const value = String(text).toLowerCase();
  for (const [status, words] of KEYWORDS) {
    if (words.some((word) => value.includes(word))) return status;
  }
  return STATUS.DELAYED;
}

export function isDisruptive(status) {
  return [STATUS.DELAYED, STATUS.REDUCED, STATUS.INTERRUPTED].includes(status);
}

export function statusSeverity(status) {
  return { [STATUS.INTERRUPTED]: 3, [STATUS.REDUCED]: 2, [STATUS.DELAYED]: 1 }[status] || 0;
}
