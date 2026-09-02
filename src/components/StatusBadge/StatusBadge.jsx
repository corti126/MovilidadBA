import { AlertTriangle, CalendarClock, CheckCircle2, CircleHelp, OctagonAlert, Timer } from "lucide-react";

import { STATUS, STATUS_META } from "../../utils/serviceStatus";
import "./StatusBadge.css";

const ICONS = {
  [STATUS.NORMAL]: CheckCircle2,
  [STATUS.DELAYED]: Timer,
  [STATUS.REDUCED]: AlertTriangle,
  [STATUS.INTERRUPTED]: OctagonAlert,
  [STATUS.SCHEDULED]: CalendarClock,
  [STATUS.UNKNOWN]: CircleHelp,
};

export function StatusBadge({ status = STATUS.UNKNOWN, compact = false }) {
  const meta = STATUS_META[status] || STATUS_META[STATUS.UNKNOWN];
  const Icon = ICONS[status] || CircleHelp;
  return (
    <span className={"mba-status mba-status--" + meta.tone + (compact ? " is-compact" : "")}>
      <Icon size={14} aria-hidden="true" />
      {compact ? meta.short : meta.label}
    </span>
  );
}
